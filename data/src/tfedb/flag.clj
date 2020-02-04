(ns tfedb.flag)

;; TODO: these could be combined with the spec, but order matters in this file

(def action-trigger
  [:none
   :entering
   :random
   :leaving
   :random_always
   :sacrifice
   :time
   :attack
   :open_door
   :searching
   :close_door
   :unlock_door
   :lock_door
   :knock_door])

(def affect
  [:armor
   :bless
   :blind
   :displace
   :chill
   :curse
   :detect_evil
   :detect_hidden
   :see_invis
   :detect_magic
   :faerie_fire
   :fire_shield
   :hide
   :infrared
   :invisible
   :wrath
   :poison
   :protect
   :sanctuary
   :sleep
   :sneak
   :regeneration
   :speed
   :water_walking
   :water_breathing
   :invulnerability
   :entangled
   :confused
   :hallucinate
   :slow
   :prot_plants
   :vitality
   :detect_good
   :life_saving
   :sleep_resist
   :resist_poison
   :ogre_strength
   :silence
   :tongues
   :continual_light
   :plague
   :tomb_rot
   :rabies
   :paralysis
   :float
   :barkskin
   :pass_door
   :axe_prof
   :sword_prof
   :bow_prof
   :light_sensitive
   :death
   :sense_danger
   :resist_fire
   :resist_cold
   :haste
   :protect_evil
   :protect_good
   :fly
   :sense_life
   :true_sight
   :resist_acid
   :resist_shock
   :thorn_shield
   :choking
   :ion_shield
   :camouflage
   :see_camouflage])

(def anti
  [:anti_human
   :anti_elf
   :anti_gnome
   :anti_dwarf
   :anti_halfling
   :anti_ent
   :anti_centaur
   :anti_lizard
   :anti_ogre
   :anti_troll
   :anti_orc
   :anti_goblin
   :anti_vyan
   :anti_mage
   :anti_psionic
   :anti_monk
   :anti_unused1
   :anti_unused2
   :anti_unused3
   :anti_good
   :anti_neutral
   :anti_evil
   :anti_lawful
   :anti_chaotic])

(def area-status
  [:open
   :worthless
   :abandoned
   :progressing
   :pending
   :blank
   :immortal])

(def direction
  [:north
   :east
   :south
   :west
   :up
   :down])

(def exit
  [:isdoor
   :closed
   :locked
   :secret
   :pickproof
   :no_show
   :no_open
   :reset_closed
   :reset_locked
   :reset_open
   :requires_climb
   :searchable])

(def layer
  [:bottom
   :under
   :base
   :over
   :top])

(def material
  [:paper
   :wood
   :leather
   :unused1
   :cloth
   :glass
   :stone
   :bone
   :flesh
   :organic
   :unused2
   :bronze
   :iron
   :steel
   :mithril
   :adamantine
   :electrum
   :silver
   :gold
   :copper
   :platinum
   :krynite])

(def object
  [:glow
   :hum
   :dark
   :lock
   :evil
   :is_invis
   :magic
   :nodrop
   :sanct
   :flaming
   :backstab
   :no_disarm
   :noremove
   :inventory
   :no_shield
   :no_major
   :noshow
   :nosacrifice
   :water_proof
   :appraised
   :no_sell
   :no_junk
   :identified
   :rust_proof
   :body_part
   :chair
   :nosave
   :burning
   :additive
   :good
   :the
   :replicate
   :known_liquid
   :poison_coated
   :no_auction
   :no_enchant
   :copied
   :random_metal
   :cover
   :two_hand])

(def object-affect
  [:none
   :strength
   :dexterity
   :intelligence
   :wisdom
   :constitution
   :magic
   :fire
   :cold
   :electricity
   :mind
   :age
   :mana
   :hp
   :move
   :unused1
   :unused2
   :armor
   :hitroll
   :damroll
   :mana_regen
   :hit_regen
   :move_regen
   :acid
   :poison])

(def object-type
  [:other
   :light
   :scroll
   :wand
   :staff
   :weapon
   :gem
   :spellbook
   :treasure
   :armor
   :potion
   :reagent
   :furniture
   :trash
   :cross
   :container
   :lockpick
   :drink_container
   :key
   :food
   :money
   :key_ring
   :boat
   :corpse
   :unused
   :fountain
   :whistle
   :trap
   :light_perm
   :bandage
   :bounty
   :gate
   :arrow
   :skin
   :body_part
   :chair
   :table
   :book
   :pipe
   :tobacco
   :deck_cards
   :fire
   :garrote])

(def position
  [:sleeping
   :meditating
   :resting
   :standing])

(def restriction
  [:bladed
   :no_hide
   :no_sneak
   :dishonorable])

(def room
  [:lit
   :safe
   :indoors
   :no_mob
   :no_recall
   :no_magic
   :no_autoscan
   :altar
   :altar_good
   :altar_neutral
   :altar_evil
   :bank
   :shop
   :pet_shop
   :office
   :no_pray
   :save_items
   :underground
   :auction_house
   :reset0
   :reset1
   :reset2
   :status0
   :status1
   :status2
   :no_mount
   :arena
   :donation
   :no_pkill])

(def room-size
  [:ant
   :rat
   :dog
   :gnome
   :human
   :ogre
   :horse
   :giant
   :elephant
   :dinosaur])

(def sector
  [:inside
   :city
   :field
   :forest
   :hills
   :mountain
   :water_surface
   :underwater
   :river
   :air
   :desert
   :caves
   :road
   :shallows])

(def spawn-mob 3)
(def spawn-object 4)

(def wearable-size
  [:custom
   :size
   :race
   :random
   :tiny
   :small
   :medium
   :large
   :giant
   :human
   :elf
   :gnome
   :dwarf
   :halfling
   :ent
   :centaur
   :lizard
   :ogre
   :troll
   :orc
   :goblin
   :vyan])

(def wear
  [:take
   :wear_finger
   :wear_neck
   :wear_body
   :wear_head
   :wear_legs
   :wear_feet
   :wear_hands
   :wear_arms
   :unused2
   :unused3
   :wear_waist
   :wear_wrist
   :held_right
   :held_left
   :wear_unused0
   :wear_unused1
   :wear_unused2
   :wear_unused3
   :wear_horse_body
   :wear_horse_back
   :wear_horse_feet])

(defn- on?* [flags flag]
  (let [;; which of the ints in flags (a vector of ints) the flag is in
        i (int (/ flag 32))
        ;; which bit in the int the flag refers to
        j (- flag (int (* 32 i)))]
    (pos? (bit-and (nth flags i) (bit-shift-left 1 j)))))

(defn- coerce-flags [i-or-is]
  (if (int? i-or-is) [i-or-is] i-or-is))

(defn on? [i-or-is flag]
  (on?* (coerce-flags i-or-is) flag))

(defn flags->set [lookup i-or-is]
  (let [flags (coerce-flags i-or-is)]
    (into #{} (for [i (range (count lookup))
                    :when (on?* flags i)]
                (nth lookup i)))))
