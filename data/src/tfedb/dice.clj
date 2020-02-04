(ns tfedb.dice)

(defn ->dice [number sides]
  {:number number
   :sides sides})

(defn int->dice [i]
  {:number (bit-and i 0x3F)
   :plus (bit-shift-right i 18)
   :sides (-> i
              (bit-shift-right 6)
              (bit-and 0xFFF))})

(defn dice->str [{:keys [number plus sides] :as dice}]
  (when dice
    (cond->
      (str number "d" sides)
      plus
      (str "+" plus))))

(defn dice-range [{:keys [number plus sides]}]
  [(cond-> sides plus (+ plus))
   (cond-> (* number sides) plus (+ plus))])
