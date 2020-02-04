(ns tfedb.seq)

(defn coerce [s]
  (when s
    (if (or (seq? s)
            (set? s)
            (vector? s))
      s
      (vector s))))

(defn bifurcate [pred coll]
  (let [grouped (group-by (comp boolean pred) coll)]
    [(get grouped false)
     (get grouped true)]))
