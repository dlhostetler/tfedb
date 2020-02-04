(ns tfedb.ingest.trainer
  (:require [clojure.java.io :as java.io]
            [clojure.string :as str]
            [plumbing.core :refer :all]
            [tfedb.numbers :as numbers]))

(defn- last-line? [line]
  (= "-1" line))

(defn- trim-first-quote [s]
  (if (str/starts-with? s "'")
    (subs s 1)
    s))

(defn- trim-last-quote [s]
  (if (str/ends-with? s "'")
    (subs s 0 (dec (count s)))
    s))

(defn- split-skills [skills]
  (when skills
    (-> skills
        str/trim
        trim-first-quote
        trim-last-quote
        (str/split #"'\s*'"))))

(defn- line->trainer [line]
  (let [[roomId mobId all-skills] (-> line
                                      str/trim
                                      (str/split #"\s+" 3))
        skills (split-skills all-skills)]
    (-> {:id (str roomId "." mobId)
         :roomId (numbers/str->int roomId)
         :mobId (numbers/str->int mobId)
         :type :trainer}
        (cond-> skills (assoc :skills skills)))))

(defn all-trainers []
  (println "Loading trainers...")
  (->> "tfe/areas/trainer.dat"
       java.io/resource
       java.io/reader
       line-seq
       ;; skip the first line, should say #TRAINERS
       rest
       (take-while (complement last-line?))
       (mapv line->trainer)))
