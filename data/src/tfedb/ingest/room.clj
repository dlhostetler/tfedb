(ns tfedb.ingest.room
  (:require [clojure.java.io :as java.io]
            [clojure.string :as str]
            [plumbing.core :refer :all]
            [tfedb.flag :as flag]
            [tfedb.ingest :as ingest]
            [tfedb.numbers :as numbers]
            [tfedb.seq :as seq])
  (:import (java.io BufferedReader)))

;; Preamble
;; ========

(defn- read-preamble
  "Reads through the area file's preamble, skipping to right before the rooms.
  A map containing common area information is returned."
  [^BufferedReader r]
  (ingest/assert-line r "#AREA")
  (let [area (ingest/read-text r)
        author (ingest/read-text r)
        help (ingest/read-text r)
        _ (ingest/assert-line r "")
        [level resetTime] (ingest/read-ints r)
        [status] (ingest/read-ints r)]
    (when-not (str/blank? help)
      (println "Found a help: " help))
    (ingest/assert-line r "#ROOMS")
    (ingest/assert-line r "")
    {:area area
     :author author
     :level level
     :resetTime resetTime
     :status (nth flag/area-status status)}))

;; Room
;; ====

;; Exit
;; ----

(defn- exit? [line]
  (re-matches #"D[0-9]" line))

(defn- direction [line]
  (get {"D0" :n
        "D1" :e
        "D2" :s
        "D3" :w
        "D4" :u
        "D5" :d} line (keyword line)))

(defn- read-exit [^BufferedReader r from-room-id dir]
  (let [exit-name (ingest/read-text r)
        keywords (ingest/read-text r)
        [flags keyId to-room-id strength light size] (ingest/read-ints r)]
    (-> {:dir dir
         :flags (flag/flags->set flag/exit flags)
         :fromRoomId from-room-id
         :id (str (name dir) ":" from-room-id "->" to-room-id)
         :keywords keywords
         :light light
         :name exit-name
         :size (nth flag/room-size size)
         :strength strength
         :toRoomId to-room-id
         :type :exit}
        (cond-> (not (neg? keyId)) (assoc :keyId keyId))
        ingest/clean-map)))

;; POI
;; ---

(defn- read-poi [^BufferedReader r]
  (let [keywords (ingest/read-text r)
        description (ingest/read-text r)]
    {:description description
     :keywords keywords
     :type :poi}))

;; Action
;; ------

(defn- read-action [^BufferedReader r]
  (let [verbs (ingest/read-text r)
        targets (ingest/read-text r)
        script (ingest/read-script r)
        [trigger value flags] (ingest/read-ints r)]
    (-> {:flags (flag/flags->set flag/direction flags)
         :script script
         :targets targets
         :trigger (nth flag/action-trigger trigger)
         :type :action
         :value value
         :verbs verbs}
        ingest/clean-map)))

;; Spawn
;; -----

(defn- spawn? [line]
  (re-matches #"[0-9]+ [0-9]+ [0-9]+ .?[0-9]+ [0-9]+" line))

(defn- spawn-type [flags]
  (if (flag/on? flags flag/spawn-mob-flag) :mob :object))

(defn- value->position [value]
  (cond
    (and (>= value 0) (< value (count flag/position)))
    (nth flag/position value)
    (= value -1)
    :inventory
    (= value -2)
    :ground
    :else
    :unknown))

(defn- read-spawn [line]
  (let [[spawn-id flags chances value liquid] (numbers/line->ints line)
        spawn-type (spawn-type flags)]
    {:chances chances
     :flags (if (= :mob spawn-type)
              (flag/flags->set flag/spawn-mob flags)
              (flag/flags->set flag/spawn-object flags))
     :liquidId liquid
     :position (value->position value)
     :spawnId spawn-id
     :spawnType spawn-type
     :type :spawn
     :value value}))

;; Config
;; ------

(defn read-room-value [^BufferedReader r room-id]
  (let [line (.readLine r)]
    (cond
      ;; EoF
      (or (nil? line) (= "#0" line))
      (ingest/unexpected-eof)
      ;; End of Room
      (= "S" line)
      nil
      ;; End of Loot
      (= "-1" line)
      :skip
      ;; Exit
      (exit? line)
      (read-exit r room-id (direction line))
      ;; POI
      (= "E" line)
      (read-poi r)
      ;; Action
      (= "A" line)
      (read-action r)
      ;; Spawn
      (spawn? line)
      (read-spawn line)
      ;; Unhandled
      :else
      (ingest/unhandled-line line))))

(defn- read-description [^BufferedReader r]
  (let [name (ingest/read-text r)
        description (ingest/read-text r)
        comments (ingest/read-text r)]
    {:comments comments
     :description description
     :name name}))

(defn- read-info0 [^BufferedReader r]
  (let [[flags sector size] (ingest/read-ints r)]
    {:flags (flag/flags->set flag/room flags)
     :sector (nth flag/sector sector)
     :size (nth flag/room-size size)}))

(defn- read-room [base-room ^BufferedReader r]
  (let [id (ingest/read-id r)]
    (when (pos? id)
      (merge base-room
             {:id id}
             (read-description r)
             (read-info0 r)))))

(defn- associate-child [room {:keys [type] :as child}]
  (let [k (keyword (str (name type) "s"))]
    (update room k (fnil conj []) child)))

(defn- associate-children [room children]
  (reduce associate-child room children))

(defn- room-objects [base-room ^BufferedReader r]
  (when-let [{:keys [id] :as room} (read-room base-room r)]
    (let [[children child-entities] (->> (repeatedly #(read-room-value r id))
                                         (take-while some?)
                                         (remove #(= :skip %))
                                         (seq/bifurcate :id))]
      ;; the child-entities are full entities that need to have their ids associated,
      ;; while the children don't live on their own and should be placed within
      ;; the room
      (conj child-entities (-> room
                               (associate-children children)
                               (ingest/associate-entities child-entities))))))

(defn- all-room-objects [base-room ^BufferedReader r]
  (->> (repeatedly #(room-objects base-room r))
       (take-while some?)
       ;; if the sequence isn't realized before the stream closes, bad things happen
       (into [] cat)))

(defn- areas []
  (->> "tfe/areas/area.lst"
       java.io/resource
       slurp
       str/split-lines
       (take-while #(not= "$" %))
       (map #(str "tfe/areas/" % ".are"))))

;; Public
;; ======

(defn read-entities [area]
  (with-open [r (java.io/reader area)]
    (let [base-room (merge {:type :room}
                           (read-preamble r))]
      (all-room-objects base-room r))))

(defn all-entities []
  (println "Loading rooms...")
  (->> (areas)
       (map java.io/resource)
       (mapcat read-entities)
       (into [])))
