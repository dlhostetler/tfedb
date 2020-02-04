(defproject tfedb-data "0.0.1-SNAPSHOT"
  :description "The Forest's Edge data parsing and indexing."
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.9.0"]
                 [org.clojure/data.json "0.2.6"]
                 [org.elasticsearch.client/elasticsearch-rest-high-level-client "7.5.2"]
                 [prismatic/plumbing "0.5.5"]]
  :main tfedb.main
  :profiles {:uberjar {:aot :all}
             :dev {:plugins [[lein-binplus "0.6.4"]]}})
