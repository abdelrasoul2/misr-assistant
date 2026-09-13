# 02 — Data Model

## الجداول الأساسية

- `services`
- `categories`
- `requirements`
- `steps`
- `fees`
- `locations`
- `sources`
- `service_aliases`
- `service_questions`
- `service_question_options`

## مبدأ Freshness

لا نخزن `fee = 500` فقط. بل:

    amount, currency, effective_from, effective_until,
    source_id, verified_at, verified_by, status, notes

## Verification Workflow

    Draft → Under Review → Verified → Published
                                    ↓
                              Needs Review → Outdated
