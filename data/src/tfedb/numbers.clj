(ns tfedb.numbers
  (:require [clojure.string :as str]))

(defn str->int [s]
  (when s
    (try
      (Integer/parseInt s)
      (catch Exception _
        nil))))

(defn line->ints [line]
  (map str->int (str/split line #"\s+")))
