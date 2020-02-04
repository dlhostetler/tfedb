(ns tfedb.entities
  (:require [plumbing.core :refer :all]
            [tfedb.ingest.room :as room]
            [tfedb.ingest.custom :as custom]
            [tfedb.ingest.mob :as mob]
            [tfedb.ingest.object :as object]
            [tfedb.ingest.table :as table]
            [tfedb.ingest.trainer :as trainer]
            [tfedb.seq :as seq])
  (:refer-clojure :rename {get core-get}))

(defn- entities->records
  [entities]
  (reduce (fn [records {:keys [id type] :as entity}]
            (assoc-in records [type id] entity))
          {}
          entities))

;; Cross Referencing
;; =================

(defn- cross-reference-entity-val
  [records to-entity-type to-entity-id to-entity-k from-entity-val]
  (update-in records
             [to-entity-type to-entity-id to-entity-k]
             (fnil conj [])
             from-entity-val))

(defn- cross-reference-entity
  [records from-entity entity->ids to-entity-type from-entity-k to-entity-k]
  (if-let [ids (seq/coerce (entity->ids from-entity))]
    (reduce (fn [r id]
              (cross-reference-entity-val r
                                          to-entity-type
                                          id
                                          to-entity-k
                                          (core-get from-entity from-entity-k)))
            records
            ids)
    records))

(defn- cross-reference
  [from-entity-type entity->ids to-entity-type from-entity-k to-entity-k records]
  (println "Cross-referencing ids from"
           (str (name from-entity-type) "."
                (if (keyword? entity->ids) (name entity->ids) "fn"))
           "into"
           (str (name to-entity-type) "." (name to-entity-k) "..."))
  (reduce (fn [r entity]
            (cross-reference-entity r
                                    entity
                                    entity->ids
                                    to-entity-type
                                    from-entity-k
                                    to-entity-k))
          records
          (-> records (core-get from-entity-type) vals)))

(defn- cross-referenced [records]
  (println "Cross referencing...")
  (->> records
       (cross-reference :exit :keyId :object :id :unlocksExitIds)
       (cross-reference :object :keyId :object :id :unlocksContainerIds)
       (cross-reference :recipe
                        (fn [recipe]
                          (->> recipe
                               :ingredients
                               (map :objectId)))
                        :object
                        :id
                        :ingredientForIds)
       (cross-reference :recipe :objectId :object :id :recipeIds)
       (cross-reference :spawn :mobId :mob :roomId :roomIds)
       (cross-reference :trainer :skills :skill :id :trainerIds)))

;; Constructor
;; ===========

;; TODO: remaining tables
(defn entities-by-type []
  (println "Ingesting entities...")
  (let [entities (concat
                   (custom/all-recipes)
                   (room/all-entities)
                   (mob/all-mobs)
                   (object/all-objects)
                   (table/alignments)
                   (table/groups)
                   (table/liquids)
                   (table/nations)
                   (table/races)
                   (trainer/all-trainers))]
    (-> entities
        entities->records
        cross-referenced)))
