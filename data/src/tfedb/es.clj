(ns tfedb.es
  (:require [clojure.data.json :as json]
            [clojure.java.io :as java.io]
            [robert.bruce :as bruce]
            [clojure.string :as str])
  (:import (java.net URL ConnectException)
           (org.apache.http HttpHost)
           (org.elasticsearch.action.admin.cluster.health ClusterHealthRequest)
           (org.elasticsearch.action.admin.indices.delete DeleteIndexRequest)
           (org.elasticsearch.action.bulk BulkRequest)
           (org.elasticsearch.action.index IndexRequest)
           (org.elasticsearch.client RestHighLevelClient RestClient RequestOptions)
           (org.elasticsearch.client.indices CreateIndexRequest GetIndexRequest)
           (org.elasticsearch.cluster.health ClusterHealthStatus)
           (org.elasticsearch.common.xcontent XContentType)))

(defn- url-to-host [url-str]
  (let [url ^URL (java.io/as-url url-str)]
    (HttpHost. (.getHost url) (.getPort url) (.getProtocol url))))

(defn- es-urls []
  (if-let [urls (System/getenv "ES_URL")]
    (str/split urls #",")
    ["http://localhost:9200"]))

(defn ->client []
  (println "Attempting to create ES client.")
  (->> (es-urls)
       (map url-to-host)
       into-array
       (RestClient/builder)
       (RestHighLevelClient.)))

(defn wait-for-green [^RestHighLevelClient client]
  (let [request (-> (ClusterHealthRequest.)
                    (.timeout "30s")
                    ;; try waiting for green, but timeout for status purposes
                    (.waitForStatus ClusterHealthStatus/GREEN))]
    (-> client
        (.cluster)
        (.health request RequestOptions/DEFAULT)))
  client)

(defn ->safe-client []
  (let [client (->client)]
    (bruce/try-try-again
      {:decay (fn [ms]
                ;; double the wait every time, but only up to a max of 30s
                (min (* 2 ms) 30000))
       :error-hook (fn [ex]
                     (if (instance? ConnectException ex)
                       (do
                         (println "ES is unavailable. Trying again.")
                         true)
                       (throw ex)))
       :sleep 1000
       :tries :unlimited}
      #(wait-for-green client))))

(defn ^IndexRequest ->index-request [index document]
  (let [d (-> document
              (dissoc :id :type)
              json/write-str)
        ]
    (-> (IndexRequest. (name index))
        (.id (-> document :id str))
        (.source ^String d XContentType/JSON))))

(defn create-index! [^RestHighLevelClient client index mapping]
  (let [request (-> (CreateIndexRequest. (name index))
                    (.settings {"index.number_of_replicas" 1
                                "index.number_of_shards" 1})
                    (.mapping ^String (json/write-str mapping)
                              XContentType/JSON))]
    (-> client
        (.indices)
        (.create request RequestOptions/DEFAULT))))

(defn index-exists? [^RestHighLevelClient client index]
  (let [request (-> [(name index)]
                    into-array
                    (GetIndexRequest.)
                    (.local false))]
    (-> client
        (.indices)
        (.exists request RequestOptions/DEFAULT))))

(defn drop-index! [^RestHighLevelClient client index]
  (let [request (-> (DeleteIndexRequest. (name index)))]
    (-> client
        (.indices)
        (.delete request RequestOptions/DEFAULT))))

(defn index-doc! [^RestHighLevelClient client index document]
  (let [request (->index-request index document)]
    (-> client
        (.index request RequestOptions/DEFAULT))))

(defn index-all! [^RestHighLevelClient client index mapping documents {:keys [force]
                                                                       :or {force true}}]
  (when (index-exists? client index)
    (if force
      (drop-index! client index)
      (throw (ex-info "Index already exists."
                      {:index index
                       :reason :index-exists}))))
  (create-index! client index mapping)
  (doseq [batch (partition-all 100 documents)
          :let [bulk-request (BulkRequest.)]]
    (doseq [document batch]
      (.add bulk-request (->index-request index document)))
    (.bulk client bulk-request RequestOptions/DEFAULT)))
