# 01 — Architecture

## نظرة عامة

    [Public Web / PWA]  [Admin Dashboard]
             \              /
              \            /
              [ Backend API ]
                    |
              [ PostgreSQL ]
                    |
        [ Sources / Verification ]

## المبادئ

- Modular Monolith أولاً (لا Microservices)
- لا Kubernetes
- لا Redis بدون حاجة
- لا AI قبل الـ MVP
- لا Mobile App قبل إثبات Web

## Stack مقترح (سيتم تأكيده في STEP 2)

| الطبقة | التقنية |
|---|---|
| Backend | TBD |
| Database | PostgreSQL (SQLite في التطوير) |
| Frontend | TBD |
| Admin | TBD |
| Auth | JWT / Secure Session |
