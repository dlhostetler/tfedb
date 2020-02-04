(ns tfedb.ingest
  (:require [clojure.string :as str]
            [tfedb.numbers :as numbers])
  (:import (java.io BufferedReader)))

(defn unexpected-eof []
  (println "Unexpected EoF")
  nil)

(defn unhandled-line [line]
  (println "Unknown Input -" line)
  ;; nil means stop, so we need to pass something back
  :skip)

(defn- empty-entry? [[_ v]]
  (or (nil? v)
      (and (string? v)
           (str/blank? v))
      (and (coll? v)
           (empty? v))))

(defn clean-map
  "Removes nil or blank values from the map."
  [m]
  (->> m
       (remove empty-entry?)
       (into {})))

(defn collapse-update [room u]
  (if (vector? u)
    (apply update-in room u)
    room))

;; Reading
;; =======

(defn assert-line [^BufferedReader r expected]
  (let [l (.readLine r)]
    (when-not (= expected l)
      (println "Unexpected line - [Expected] " expected ", [Actual] " l))))

(defn read-text [^BufferedReader r]
  (-> (loop [l (.readLine r)
             s ""]
        (if (str/ends-with? l "~")
          (str s (apply str (drop-last l)))
          (recur (.readLine r) (str s l \newline))))
      str/trim))

(defn read-id [^BufferedReader r]
  (try
    (loop [l (.readLine r)]
      (if-not (str/blank? l)
        (->> l rest (apply str) (Integer/parseInt))
        ;; often there are blank lines before ids, skip them
        (recur (.readLine r))))
    (catch Exception e
      (println "Cannot read id. Error:" (.getMessage e))
      -1)))

(defn read-int [^BufferedReader r]
  (numbers/str->int (.readLine r)))

(defn read-ints [^BufferedReader r]
  (numbers/line->ints (.readLine r)))

(defn- read-description [line]
  (let [placeholder (read-text line)
        value (read-text line)]
    [[:descriptions] (fnil conj []) {:placeholder placeholder :value value}]))

;; Code Block
;; ==========

(defn- read-code-block-value [^BufferedReader r]
  (let [line (.readLine r)]
    (cond
      ;; EoF
      (or (nil? line) (= "#0" line))
      (unexpected-eof)
      ;; End of Block
      (= "!" line)
      nil
      ;; Description
      (= "E" line)
      (read-description r)
      ;; Unhandled
      :else
      (unhandled-line line))))

(defn read-script [^BufferedReader r]
  (let [code (read-text r)]
    (->> (repeatedly #(read-code-block-value r))
         (take-while some?)
         (reduce collapse-update {:code code}))))

;; Association
;; ===========

(defn- associate-entity [entity {:keys [id type]}]
  (let [k (keyword (str (name type) "s"))]
    (update entity k (fnil conj []) id)))

(defn associate-entities [entity other-entities]
  (reduce associate-entity entity other-entities))
