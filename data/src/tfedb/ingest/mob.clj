(ns tfedb.ingest.mob
  (:require [clojure.java.io :as java.io]
            [clojure.string :as str]
            [tfedb.dice :as dice]
            [tfedb.flag :as flag]
            [tfedb.ingest :as ingest]
            [tfedb.numbers :as numbers])
  (:import (java.io BufferedReader)))

(defn- humanize-sex [c]
  (get {:F :female
        :M :male
        :N :neutral
        :R :random}
       (keyword c)))

(defn- read-preamble
  "Reads through the area file's preamble, skipping to right before the rooms.
  A map containing common area information is returned."
  [^BufferedReader r]
  (ingest/assert-line r "#MOBILES")
  (ingest/assert-line r ""))

(defn- read-description [^BufferedReader r]
  (let [name (ingest/read-text r)
        keywords (ingest/read-text r)
        appearance (ingest/read-text r)
        herePrefix (ingest/read-text r)
        adjectives (ingest/read-text r)
        hereSuffix (ingest/read-text r)
        appearancePlural (ingest/read-text r)
        herePluralPrefix (ingest/read-text r)
        adjectivesPlural (ingest/read-text r)
        herePluralSuffix (ingest/read-text r)
        description (ingest/read-text r)]
    {:adjectives adjectives
     :adjectivesPlural adjectivesPlural
     :appearance appearance
     :appearancePlural appearancePlural
     :description description
     :herePrefix herePrefix
     :hereSuffix hereSuffix
     :herePluralPrefix herePluralPrefix
     :herePluralSuffix herePluralSuffix
     :keywords keywords
     :name name}))

(defn- read-creator [^BufferedReader r]
  {:creator (ingest/read-text r)})

(defn- read-attacks [^BufferedReader r]
  {:attacks (ingest/read-script r)})

(defn- read-info0 [^BufferedReader r]
  (let [[nation group race adult maturity skeletonId zombieId corpseId]
        (ingest/read-ints r)]
    (cond-> {:adult adult
             :groupId group
             :maturity maturity
             :nationId nation
             :raceId race}
      (pos? skeletonId)
      (assoc :skeletonId skeletonId)
      (pos? zombieId)
      (assoc :zombieId zombieId)
      (pos? corpseId)
      (assoc :corpseId corpseId))))

(defn- read-info1 [^BufferedReader r]
  (let [[price kills deaths wander date light color]
        (ingest/read-ints r)]
    ;; TODO: determine if any of these actually matter
    nil))

(defn- read-info2 [^BufferedReader r]
  (let [[actFlags affectedBy0 affectedBy1 affectedBy2 alignment]
        (ingest/read-ints r)
        affects (flag/flags->set flag/affect
                                 [affectedBy0 affectedBy1 affectedBy2])]
    ;; TODO: figure out act flags
    (cond-> {:alignmentId alignment}
      (not (empty? affects))
      (assoc :affects affects))))

(defn- read-level [^BufferedReader r]
  {:level (numbers/str->int (.readLine r))})

(defn- read-attributes [^BufferedReader r]
  (let [[str int wis dex con] (ingest/read-ints r)]
    {:attributes (into [] (for [[k v] {:constitution con
                                       :dexterity dex
                                       :intelligence int
                                       :strength str
                                       :wisdom wis}]
                            {:type k
                             :value v}))}))

(defn- read-resists [^BufferedReader r]
  (let [[magic fire cold shock mind acid poison] (ingest/read-ints r)]
    {:resists (into [] (for [[k v] {:acid acid
                                    :cold cold
                                    :fire fire
                                    :magic magic
                                    :mind mind
                                    :poison poison
                                    :shock shock}]
                         {:type k
                          :value v}))}))

(defn- read-armor-line [^BufferedReader r]
  (let [[chance armor name] (-> r ingest/read-text (str/split #" " 3))
        armor (numbers/str->int armor)
        chance (numbers/str->int chance)]
    (when (and (pos? armor) (pos? chance))
      {:armor armor
       :chance chance
       :name name})))

(defn- read-armor [^BufferedReader r]
  (let [armor (->> (repeatedly 5 #(read-armor-line r))
                   (remove nil?)
                   (into []))]
    (when-not (empty? armor)
      {:armor armor})))

(defn- read-wear-part [^BufferedReader r]
  (let [[wearPart] (ingest/read-ints r)]
    ;; TODO: figure out if this is a meaningful thing
    nil))

(defn- read-dice [^BufferedReader r]
  (let [[hp move] (ingest/read-ints r)]
    {:dice [{:dice (dice/int->dice hp)
             :purpose :hp}
            {:dice (dice/int->dice move)
             :purpose :movement}]}))

(defn- read-info3 [^BufferedReader r]
  (let [[damage rounds special damageTaken xp] (ingest/read-ints r)]
    ;; TODO: determine if any of these actually matter
    ;; TODO: there's an xp value here, but it seems really high
    {}))

(defn- read-info4 [^BufferedReader r]
  (let [[sex gold size weight] (-> r (.readLine) (str/split #" "))]
    ;; TODO: human readable size?
    {:gold (numbers/str->int gold)
     :sex (humanize-sex sex)
     :size (numbers/str->int size)
     :weight (numbers/str->int weight)}))

(defn- line->object [line]
  (let [[objectId flags chances value liquid] (numbers/line->ints line)]
    {:chances chances
     :flags flags
     :liquidId liquid
     :objectId objectId
     :value value}))

(defn- read-objects [^BufferedReader r]
  (loop [line (.readLine r)
         objects []]
    (if (not= "-1" line)
      (recur (.readLine r) (conj objects (line->object line)))
      (when-not (empty? objects)
        {:objects objects}))))

(defn- script-type [n]
  (let [k (-> n str keyword)]
    (get {:0 :enter
          :1 :flee
          :2 :ask
          :3 :leave
          :4 :die
          :5 :kill
          :6 :give
          :7 :sleep
          :8 :to
          :10 :death
          :11 :attack} k k)))

(defn- read-script [line ^BufferedReader r]
  ;; TODO: the number after the script identifier is -1 almost all the time,
  ;; but sometimes it's not
  (let [[n _] (numbers/line->ints line)
        keywords (ingest/read-text r)]
    (-> {:type (script-type n)}
        (merge (ingest/read-script r))
        (cond->
          (not (str/blank? keywords))
          (merge {:keywords keywords})))))

(defn- read-scripts [^BufferedReader r]
  (loop [line (.readLine r)
         scripts []]
    (if (not= "-1" line)
      (let [script (read-script line r)]
        (recur (.readLine r) (conj scripts script)))
      (when-not (empty? scripts)
        {:scripts scripts}))))

(defn read-mob [^BufferedReader r]
  (let [id (ingest/read-id r)]
    (when (pos? id)
      (-> (merge {:id id}
                 (read-description r)
                 (read-creator r)
                 (read-attacks r)
                 (read-info0 r)
                 (read-info1 r)
                 (read-info2 r)
                 (read-level r)
                 (read-attributes r)
                 (read-resists r)
                 (read-armor r)
                 (read-wear-part r)
                 (read-dice r)
                 (read-info3 r)
                 (read-info4 r)
                 (read-objects r)
                 (read-scripts r))
          ingest/clean-map))))

(defn mobs [^BufferedReader r]
  (take-while some? (repeatedly #(read-mob r))))

;; Public
;; ======

(defn read-mobs [x]
  (with-open [r (java.io/reader x)]
    (read-preamble r)
    (->> (mobs r)
         (map #(merge {:type :mob} %))
         (into []))))

(defn all-mobs []
  (println "Loading mobs...")
  (-> "tfe/areas/mob.mob" java.io/resource read-mobs))