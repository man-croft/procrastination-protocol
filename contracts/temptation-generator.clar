;; ============================================
;; TEMPTATION GENERATOR - Random Events
;; Clarity 2 Smart Contract
;; ============================================

(define-constant ERR_NO_EVENT (err u404))
(define-constant ERR_ALREADY_CLAIMED (err u409))

(define-map claimed-events { user: principal, block: uint } bool)

(define-read-only (get-current-temptation)
  (let ((height-mod (mod burn-block-height u144))) ;; Daily cycle approx
    (if (is-eq height-mod u0)
      (ok { name: "Midnight Snack", bonus: u1000000 }) ;; 1 STX
      (if (is-eq height-mod u72)
        (ok { name: "Noon Nap", bonus: u5000000 }) ;; 5 STX
        (err ERR_NO_EVENT)
      )
    )
  )
)

(define-public (claim-temptation)
  (let
    (
      (event (unwrap! (get-current-temptation) ERR_NO_EVENT))
    )
    (asserts! (is-none (map-get? claimed-events { user: tx-sender, block: burn-block-height })) ERR_ALREADY_CLAIMED)
    (map-set claimed-events { user: tx-sender, block: burn-block-height } true)
    (contract-call? .procrastination-vault apply-temptation-bonus tx-sender (get bonus event))
  )
)
