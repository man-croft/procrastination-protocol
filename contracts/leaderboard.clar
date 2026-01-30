;; ============================================
;; LEADERBOARD - Hall of Laziness
;; Clarity 2 Smart Contract
;; ============================================

(define-data-var top-scores (list 10 { user: principal, blocks: uint }) (list))

(define-public (update-my-position)
  (let
    (
      (streak (unwrap-panic (contract-call? .streak-tracker get-streak-blocks tx-sender)))
      (current-scores (var-get top-scores))
      ;; Filter out existing score for this user
      (filtered-scores (filter filter-sender current-scores))
    )
    (if (< (len filtered-scores) u10)
      ;; If room, just append
      (ok (var-set top-scores (unwrap-panic (as-max-len? (append filtered-scores { user: tx-sender, blocks: streak }) u10))))
      ;; If full, remove the first one (FIFO) and append new
      (let
        (
          ;; This is a bit tricky in Clarity without 'slice' or 'cdr' easily on lists
          ;; But we can use a trick or just accept we need to implement 'remove-first' logic
          ;; For MVP, let's just use the filtered list if it's smaller (meaning they were already in it)
          ;; If they weren't in it, we need to drop someone.
          (new-list (unwrap-panic (as-max-len? (append (if (is-eq (len filtered-scores) u10) (cdr filtered-scores) filtered-scores) { user: tx-sender, blocks: streak }) u10)))
        )
        (ok (var-set top-scores new-list))
      )
    )
  )
)

(define-private (filter-sender (entry { user: principal, blocks: uint }))
  (not (is-eq (get user entry) tx-sender))
)

(define-private (cdr (l (list 10 { user: principal, blocks: uint })))
  (unwrap-panic (as-max-len? (slice? l u1 (len l)) u10))
)

(define-read-only (get-leaderboard)
  (ok (var-get top-scores))
)
