(ns tfedb.es
  (:require [clojure.data.json :as json])
  (:import (org.elasticsearch.client RestHighLevelClient RestClient RequestOptions)
           (org.elasticsearch.client.indices CreateIndexRequest GetIndexRequest)
           (org.elasticsearch.common.xcontent XContentType)
           (org.apache.http HttpHost)
           (org.elasticsearch.action.index IndexRequest)
           (org.elasticsearch.action.admin.indices.delete DeleteIndexRequest)
           (org.elasticsearch.action.bulk BulkRequest)))

;; new RestHighLevelClient(
;        RestClient.builder(
;                new HttpHost("localhost", 9200, "http"),
;                new HttpHost("localhost", 9201, "http")))
(defn ->client []
  (-> [(HttpHost. "localhost" 9200 "http")]
      into-array
      (RestClient/builder)
      (RestHighLevelClient.)))

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
