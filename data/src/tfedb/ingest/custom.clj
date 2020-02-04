(ns tfedb.ingest.custom
  (:require [clojure.java.io :as java.io]
            [clojure.string :as str]
            [plumbing.core :refer :all]
            [tfedb.numbers :as numbers]))

(defn- last-line? [line]
  (= "-1" line))

(defn- line->recipe [{:keys [roomId] :as location} line]
  (let [[_ objectId cost & ingredients] (numbers/line->ints line)
        recipeId (str roomId "." objectId)]
    (merge location {:cost cost
                     :id recipeId
                     :ingredients (->> ingredients
                                       (partition 2)
                                       (filter (comp pos? first))
                                       (mapv (fn [[objectId n]]
                                               {:objectId objectId
                                                :numRequired n})))
                     :objectId objectId
                     :type :recipe})))

(defn- line->location [line]
  (let [[roomId mobId] (numbers/line->ints line)]
    {:mobId mobId
     :roomId roomId}))

(defn- lines->recipes [lines]
  (loop [lines lines
         location nil
         recipes []]
    (let [l (-> lines first str/trim)]
      (cond
        ;; End of File
        (last-line? l)
        recipes
        ;; Ingredient
        (str/starts-with? l "0")
        (recur (rest lines) location (conj recipes (line->recipe location l)))
        ;; Location
        :else
        (recur (rest lines) (line->location l) recipes)))))

(defn all-recipes []
  (->> "tfe/areas/shop.dat"
       java.io/resource
       java.io/reader
       line-seq
       ;; skip the first line, should say #SHOPS
       rest
       lines->recipes))
