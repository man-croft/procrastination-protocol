;; ============================================
;; LEADERBOARD - Hall of Laziness
;; Clarity 2 Smart Contract
;; ============================================

(define-constant ERR_NOT_FOUND (err u404))
(define-constant ERR_INVALID_STREAK (err u400))
(define-constant ERR_LIST_OVERFLOW (err u500))
(define-constant ERR_STREAK_TOO_SHORT (err u403))

;; Minimum streak to qualify for leaderboard (1 day = 144 blocks)
(define-constant MIN_LEADERBOARD_STREAK u144)

(define-data-var top-scores (list 10 { user: principal, blocks: uint }) (list))

(define-public (update-my-position)
  (let
    (
      (streak-result (contract-call? .streak-tracker get-streak-blocks tx-sender))
      (current-scores (var-get top-scores))
    )
    ;; Verify streak exists
    (match streak-result
      streak
        (begin
          ;; Check minimum streak requirement
          (asserts! (>= streak MIN_LEADERBOARD_STREAK) ERR_STREAK_TOO_SHORT)
          
          ;; Filter out existing score for this user
          (let
            (
              (filtered-scores (filter filter-sender current-scores))
              (new-entry { user: tx-sender, blocks: streak })
            )
            ;; Insert into sorted position
            (let
              (
                (updated-list (insert-sorted new-entry filtered-scores))
              )
              (ok (var-set top-scores updated-list))
            )
          )
        )
      ERR_NOT_FOUND
    )
  )
)

;; Insert entry into sorted list (descending order by blocks)
(define-private (insert-sorted (entry { user: principal, blocks: uint }) (sorted-list (list 10 { user: principal, blocks: uint })))
  (let
    (
      (result (fold insert-into-list sorted-list { entry: entry, accumulated: (list), inserted: false }))
    )
    (if (get inserted result)
      ;; Entry was inserted, return accumulated list (limited to 10)
      (default-to (list) (as-max-len? (get accumulated result) u10))
      ;; Entry wasn't inserted (lower than all), append at end if room
      (if (< (len sorted-list) u10)
        (default-to (list) (as-max-len? (append sorted-list entry) u10))
        sorted-list ;; List full, entry doesn't make top 10
      )
    )
  )
)

;; Helper for fold-based insertion
(define-private (insert-into-list 
  (current-entry { user: principal, blocks: uint })
  (state { entry: { user: principal, blocks: uint }, accumulated: (list 10 { user: principal, blocks: uint }), inserted: bool }))
  (let
    (
      (new-entry (get entry state))
      (acc (get accumulated state))
      (already-inserted (get inserted state))
    )
    (if already-inserted
      ;; Already inserted, just accumulate current entry
      {
        entry: new-entry,
        accumulated: (default-to acc (as-max-len? (append acc current-entry) u10)),
        inserted: true
      }
      ;; Not inserted yet, check if new entry should go before current
      (if (> (get blocks new-entry) (get blocks current-entry))
        ;; Insert new entry before current
        {
          entry: new-entry,
          accumulated: (default-to acc (as-max-len? (append (default-to acc (as-max-len? (append acc new-entry) u10)) current-entry) u10)),
          inserted: true
        }
        ;; New entry goes after, keep accumulating
        {
          entry: new-entry,
          accumulated: (default-to acc (as-max-len? (append acc current-entry) u10)),
          inserted: false
        }
      )
    )
  )
)

(define-private (filter-sender (entry { user: principal, blocks: uint }))
  (not (is-eq (get user entry) tx-sender))
)

(define-private (cdr (l (list 10 { user: principal, blocks: uint })))
  (default-to (list) (as-max-len? (slice? l u1 (len l)) u10))
)

(define-read-only (get-leaderboard)
  (ok (var-get top-scores))
)
