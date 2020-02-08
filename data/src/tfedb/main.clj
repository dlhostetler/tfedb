(ns tfedb.main
  (:require [tfedb.entities :as entities]
            [tfedb.es :as es])
  (:gen-class))

(def es-bool
  {:type :boolean})

(def es-int
  {:type :long})

(def es-kw
  {:type :keyword})

(def es-text
  {:type :text
   :fields {:raw {:type :keyword}}})

(def dice
  {:dynamic false
   :properties {:number es-int
                :plus es-int
                :sides es-int}})

(def script
  {:dynamic false
   :properties {:code es-text
                :descriptions {:dynamic false
                               :properties {:placeholder es-kw
                                            :value es-text}}
                :type es-kw}})

(def mappings
  {:alignment {:dynamic false
               :properties {:abbreviation es-kw
                            :name es-text}}
   :exit {:dynamic false
          :properties {:dir es-kw
                       :fromRoomId es-kw
                       :keyId es-kw
                       :light es-int
                       :size es-kw
                       :strength es-int
                       :toRoomId es-kw}}
   :group {:dynamic false
           :properties {:name es-text}}
   :liquid {:dynamic false
            :properties {:alcohol es-int
                         :color es-kw
                         :costPerLiter es-int
                         :creatable es-bool
                         :hunger es-int
                         :name es-text
                         :thirst es-int}}
   :mob {:dynamic false
         :properties {:adult es-int
                      :adjectives es-text
                      :adjectivesPlural es-text
                      :affects es-kw
                      :alignment es-kw
                      :appearance es-text
                      :appearancePlural es-text
                      :armor {:dynamic false
                              :properties {:armor es-int
                                           :chance es-int
                                           :name es-text}}
                      :attacks script
                      :attributes {:dynamic false
                                   :properties {:name es-kw
                                                :value es-int}}
                      :corpseId es-kw
                      :creator es-text
                      :description es-text
                      :dice {:dynamic false
                             :properties {:dice dice
                                          :purpose es-kw}}
                      :gold es-int
                      :groupId es-kw
                      :herePluralPrefix es-text
                      :herePluralSuffix es-text
                      :herePrefix es-text
                      :hereSuffix es-text
                      :keywords es-text
                      :level es-int
                      :maturity es-int
                      :nationId es-kw
                      :name es-text
                      :objects {:dynamic false
                                :properties {;; TODO: chances == dice?
                                             :chances es-int
                                             ;; TODO: what determines where this object spawns?
                                             :flags es-int
                                             :liquidId es-kw
                                             :objectId es-kw
                                             :value es-int}}
                      :raceId es-kw
                      :resists {:dynamic false
                                :properties {:type es-kw
                                             :value es-int}}
                      :roomIds es-kw
                      :scripts script
                      :sex es-kw
                      :size es-int
                      :skeletonId es-kw
                      :weight es-int
                      :zombieId es-kw}}
   :nation {:dynamic false
            :properties {:abbreviation es-kw
                         :name es-text
                         :temple es-int}}
   :object {:dynamic false
            :properties {:ac es-int
                         :acGlobal es-int
                         :affects {:dynamic false
                                   :properties {:amount es-int
                                                :type es-kw}}
                         :anti es-kw
                         :attack es-int
                         :blocks es-int
                         :capacity es-int
                         :charges es-int
                         :cost es-int
                         :creator es-text
                         :damage dice
                         :descriptions {:dynamic false
                                        :properties {:description es-text
                                                     :keywords es-text}}
                         :durability es-int
                         :enchantment es-int
                         :flags es-kw
                         :halflife es-int
                         :herePrefix es-text
                         :hereSuffix es-text
                         :herePluralPrefix es-text
                         :herePluralSuffix es-text
                         :ingredientForIds es-kw
                         :keyId es-kw
                         :layers es-kw
                         :level es-int
                         :light es-int
                         :limit es-int
                         :materials es-kw
                         :mobId es-kw
                         :name es-text
                         :namePlural es-text
                         :nourishment es-int
                         :recipeIds es-kw
                         :repair es-int
                         :restriction es-kw
                         :size es-kw
                         :subtype es-kw
                         :unlocksContainerIds es-kw
                         :unlocksExitIds es-kw
                         :updater es-text
                         :wear es-kw
                         :weight es-int}}
   :race {:dynamic false
          :properties {:abbreviation es-kw
                       :name es-text}}
   :recipe {:dynamic false
            :properties {:cost es-int
                         :ingredients {:dynamic false
                                       :properties {:numRequired es-int
                                                    :objectId es-kw}}
                         :mobId es-kw
                         :objectId es-kw
                         :roomId es-kw}}
   :room {:dynamic false
          :properties {:actions {:dynamic false
                                 :properties {:flags es-kw
                                              :script script
                                              :targets es-text
                                              :trigger es-kw
                                              :value es-int
                                              :verbs es-kw}}
                       :area es-kw
                       :author es-text
                       :comments es-text
                       :description es-text
                       :exitIds es-kw
                       :flags es-kw
                       :level es-int
                       :name es-text
                       :pois {:dynamic false
                              :properties {:description es-text
                                           :keywords es-text}}
                       :sector es-kw
                       :size es-kw
                       :spawns {:dynamic false
                                :properties {:chances es-int
                                             :liquidId es-kw
                                             :mobId es-kw
                                             :objectId es-kw
                                             :position es-kw
                                             :roomId es-kw
                                             :value es-int}}
                       :status es-kw}}
   :skill {:dynamic false
           :properties {:trainerIds es-kw}}
   :trainer {:dynamic false
             :properties {:mobIds es-kw
                          :roomId es-kw
                          :skills es-kw}}})

(defn -main [& args]
  (with-open [client (es/->safe-client)]
    (doseq [[entity-type entities-by-id] (entities/entities-by-type)
            :let [mapping (get mappings entity-type)]]
      (println "Indexing" (str (name entity-type) "..."))
      (if mapping
        (es/index-all! client
                       entity-type
                       mapping
                       (vals entities-by-id)
                       {:force true})
        (println "No mapping for" (str (name entity-type) ",") "skipping.")))))
