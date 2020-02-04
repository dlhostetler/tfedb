(ns tfedb.ingest.table
  (:require [clojure.java.io :as java.io]
            [clojure.string :as str]
            [plumbing.core :refer :all]
            [tfedb.ingest :as ingest]
            [tfedb.numbers :as numbers])
  (:import (java.io BufferedReader)))

(defn- expected-count [^BufferedReader r]
  (ingest/assert-line r "")
  (let [n (ingest/read-int r)]
    (ingest/assert-line r "")
    n))

(defmulti read-field (fn [r entry field] (:type field)))

(defmethod read-field :bool [r entry {:keys [k]}]
  (assoc entry k (not (zero? (ingest/read-int r)))))

(defmethod read-field :int [r entry {:keys [k]}]
  (assoc entry k (ingest/read-int r)))

(defmethod read-field :optionalInt [r entry {:keys [k]}]
  (let [s (ingest/read-text r)]
    (if-not (str/blank? s)
      (assoc entry k (numbers/str->int s))
      entry)))

(defmethod read-field :string [r entry {:keys [k]}]
  (let [s (ingest/read-text r)]
    (if-not (str/blank? s)
      (assoc entry k s)
      entry)))

(defn- read-entry [^BufferedReader r fields]
  (reduce (partial read-field r) {} fields))

(defn ingest [{:keys [type] :as spec}]
  (println "Loading" (str (name type) "s" "..."))
  (with-open [reader (->> spec
                          :resource
                          java.io/resource
                          java.io/reader)]
    (ingest/assert-line reader "#TABLE")
    (into [] (for [id (range (expected-count reader))]
               (-> (read-entry reader (:fields spec))
                   (assoc :id id)
                   (assoc :type type))))))

;; Tables
;; ======

(defn alignments []
  (ingest {:fields [{:k :name :type :string}
                    {:k :abbreviation :type :string}]
           :resource "tfe/tables/Alignments"
           :type :alignment}))

(defn character-affects []
  (ingest {:fields [{:k :name :type :string}
                    {:k :description :type :string}
                    {:k :nameScore :type :string}
                    {:k :messageOn :type :string}
                    {:k :messageOnRoom :type :string}
                    {:k :messageOff :type :string}
                    {:k :messageOffRoom :type :string}
                    {:k :location :type :int}
                    {:k :modified :type :optionalInt}]
           :resource "tfe/tables/Aff.Char"
           :type :characterAffect}))

(defn groups []
  (ingest {:fields [{:k :name :type :string}]
           :resource "tfe/tables/Groups"
           :type :group}))

(defn liquids []
  (ingest {:fields [{:k :name :type :string}
                    {:k :color :type :string}
                    {:k :hunger :type :int}
                    {:k :thirst :type :int}
                    {:k :alcohol :type :int}
                    {:k :costPerLiter :type :int}
                    {:k :creatable :type :bool}
                    {:k :spell :type :string}]
           :resource "tfe/tables/Liquids"
           :type :liquid}))

;; TODO: better names for these fields from table.cc
(defn nations []
  (ingest {:fields [{:k :name :type :string}
                    {:k :abbreviation :type :string}
                    {:k :temple :type :int}
                    {:k :room0 :type :int}
                    {:k :room1 :type :int}
                    {:k :race0 :type :int}
                    {:k :race1 :type :int}
                    {:k :race2 :type :int}
                    {:k :race3 :type :int}
                    {:k :race4 :type :int}
                    {:k :race5 :type :int}
                    {:k :race6 :type :int}
                    {:k :race7 :type :int}
                    {:k :race8 :type :int}
                    {:k :race9 :type :int}
                    {:k :race10 :type :int}
                    {:k :race11 :type :int}
                    {:k :race12 :type :int}
                    {:k :alignment0 :type :int}
                    {:k :alignment1 :type :int}
                    {:k :alignment2 :type :int}
                    {:k :alignment3 :type :int}
                    {:k :alignment4 :type :int}
                    {:k :alignment5 :type :int}
                    {:k :alignment6 :type :int}
                    {:k :alignment7 :type :int}
                    {:k :alignment8 :type :int}]
           :resource "tfe/tables/Nations"
           :type :nation}))

(defn races []
  (ingest {:fields [{:k :name :type :string}
                    {:k :abbreviation :type :string}
                    {:k :track :type :string}]
           :resource "tfe/tables/Races"
           :type :race}))
