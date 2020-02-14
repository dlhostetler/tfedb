(ns tfedb.ingest.object
  (:require [clojure.java.io :as java.io]
            [clojure.string :as str]
            [tfedb.dice :as dice]
            [tfedb.flag :as flag]
            [tfedb.ingest :as ingest]
            [tfedb.numbers :as numbers])
  (:import (java.io BufferedReader)))

(defn- read-preamble
  "Reads through the object file's preamble, skipping to right before the
  objects."
  [^BufferedReader r]
  (ingest/assert-line r "#OBJECTS")
  (ingest/assert-line r ""))

(defn- read-description [^BufferedReader r]
  (let [name (ingest/read-text r)
        namePlural (ingest/read-text r)
        adjectives (ingest/read-text r)
        adjectivesPlural (ingest/read-text r)
        hereSuffix (ingest/read-text r)
        herePluralSuffix (ingest/read-text r)
        herePrefix (ingest/read-text r)
        herePluralPrefix (ingest/read-text r)]
    {:herePrefix herePrefix
     :hereSuffix hereSuffix
     :herePluralPrefix herePluralPrefix
     :herePluralSuffix herePluralSuffix
     :name (cond->> name
                    (not (str/blank? adjectives))
                    (str adjectives " "))
     :namePlural (cond->> namePlural
                          (not (str/blank? adjectivesPlural))
                          (str adjectivesPlural " "))}))

(defn- read-authors [^BufferedReader r]
  (let [creator (ingest/read-text r)
        updater (ingest/read-text r)]
    {:creator creator
     :updater updater}))

(defn- read-info0 [^BufferedReader r]
  (let [[type fakes extraFlags0 extraFlags1 wearFlags antiFlags]
        (ingest/read-ints r)]
    {:anti (flag/flags->set flag/anti antiFlags)
     :flags (flag/flags->set flag/object [extraFlags0 extraFlags1])
     :subtype (nth flag/object-type type)
     :wearLocations (flag/flags->set flag/wear wearFlags)}))

(defn- read-info1 [^BufferedReader r]
  (let [[restrictionFlags sizeFlags materialFlags affectFlags0 affectFlags1
         affectFlags2 layerFlags] (ingest/read-ints r)]
    {:affect (->> [affectFlags0 affectFlags1 affectFlags2]
                  (flag/flags->set flag/affect)
                  (mapv (fn [t] {:type t})))
     :layers (flag/flags->set flag/layer layerFlags)
     :materials (flag/flags->set flag/material materialFlags)
     :restriction (flag/flags->set flag/restriction restrictionFlags)
     :size (flag/flags->set flag/wearable-size sizeFlags)}))

(defmulti interpret-value
          (fn [subtype value0 value1 value2 value3]
            subtype))

(defmethod interpret-value :default [_ _ _ _ _]
  nil)

(defmethod interpret-value :armor [_ v0 v1 v2 _]
  {:ac v1
   :acGlobal v2
   :enchantment v0})

(defmethod interpret-value :container [_ v0 _ v2 _]
  (cond-> {:capacity v0}
    (not (zero? v2))
    (assoc :keyId v2)))

(defmethod interpret-value :corpse [_ v0 v1 _ _]
  {:halflife v0
   :mobId v1})

(defmethod interpret-value :drink_container [_ v0 _ _ _]
  {:capacity v0})

(defmethod interpret-value :food [_ v0 _ _ _]
  {:nourishment v0})

(defmethod interpret-value :reagent [_ v0 _ _ _]
  {:charges v0})

(defmethod interpret-value :weapon [_ v0 v1 v2 v3]
  {:attack v3
   :damage (dice/->dice v1 v2)
   :enchantment v0})

(defn- read-value [subtype ^BufferedReader r]
  ;; these values are dependent on item type
  (let [[value0 value1 value2 value3] (ingest/read-ints r)]
    (interpret-value subtype value0 value1 value2 value3)))

(defn- read-info2 [^BufferedReader r]
  (let [[weight cost level limit repair durability blocks light]
        (ingest/read-ints r)]
    (cond-> {:blocks blocks
             :cost cost
             :durability durability
             :level level
             :light light
             :repair repair
             :weight weight}
      (not (neg? limit))
      (assoc :limit limit))))

(defn- read-date [^BufferedReader r]
  ;; TODO: figure out the date format
  (let [date (.readLine r)]
    nil))

(defn- read-affect [line]
  (let [[location modifier] (-> line
                                (str/split #"\s" 2)
                                last
                                numbers/line->ints)]
    [[:affects] (fnil conj []) {:amount modifier
                                :type (nth flag/object-affect location)}]))

(defn- read-extra-description [^BufferedReader r]
  (let [keywords (ingest/read-text r)
        description (ingest/read-text r)]
    [[:descriptions]
     (fnil conj [])
     {:description description :keywords keywords}]))

(defn- action? [line]
  ;; 0-13 followed by an integer
  (re-matches #"^[0-9][0-3]? -?[0-9]+$" line))

(defn- read-action [line ^BufferedReader r]
  (let [[n _] (numbers/line->ints line)
        verbs (ingest/read-text r)
        targets (ingest/read-text r)]
    (merge {:targets targets
            ;; TODO: it'd be nice to know what this meant
            :type n
            :verbs verbs}
           (ingest/read-script r))))

(defn- read-actions [^BufferedReader r]
  (loop [line (.readLine r)
         actions []]
    (if (not= "-1" line)
      (let [action (read-action line r)]
        (recur (.readLine r) (conj actions action)))
      (when-not (empty? actions)
        {:actions actions}))))

(defn read-object-value [^BufferedReader r]
  (let [line (.readLine r)]
    (cond
      ;; EoF
      (or (nil? line) (= "#0" line))
      (ingest/unexpected-eof)
      ;; End of Object
      (= "-1" line)
      nil
      ;; Affect
      (str/starts-with? line "A")
      (read-affect line)
      ;; Description
      (= "E" line)
      (read-extra-description r)
      ;; The source code appears to just read this and discard it
      (= "P" line)
      :skip
      ;; Action
      (action? line)
      (read-action line r)
      ;; Unhandled
      :else
      (ingest/unhandled-line line))))

(defn read-object [^BufferedReader r]
  (let [id (ingest/read-id r)]
    (when (pos? id)
      (let [description (read-description r)
            authors (read-authors r)
            {:keys [subtype] :as info0} (read-info0 r)
            o (merge {:id id}
                     description
                     authors
                     info0
                     (read-info1 r)
                     (read-value subtype r)
                     (read-info2 r)
                     (read-date r))]
        (->> (repeatedly #(read-object-value r))
             (take-while some?)
             (reduce ingest/collapse-update o)
             ingest/clean-map)))))

(defn objects [^BufferedReader r]
  (take-while some? (repeatedly #(read-object r))))

;; Public
;; ======

(defn read-objects [x]
  (with-open [r (java.io/reader x)]
    (read-preamble r)
    (->> (objects r)
         (map #(merge {:type :object} %))
         (into []))))

(defn all-objects []
  (println "Loading objects...")
  (->> "tfe/areas/obj.obj" java.io/resource read-objects))
