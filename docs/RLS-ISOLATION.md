# RLS isolation — Weidner Lawnscape

Highest-risk area on the shared production database: cross-tenant data leakage.

## Threat model

| Actor | Must see Weidner ops data? |
|-------|----------------------------|
| Anon (public site) | No — forms use service-role server routes only |
| Authenticated user with no `weidner_staff_profiles` row | No |
| Weidner staff | Only rows where `tenant_id` = Weidner tenant |
| Staff of another tenant (DAWG/MA5/etc.) | No Weidner rows |
| SQL Editor / service role | Bypass RLS (trusted operators only) |

## Automated / documented tests

1. **Structural SQL** — `scripts/rls-isolation-test.sql` sections A1–A3  
   Asserts RLS on all `weidner_*` tables, private bucket, tenant row exists.

2. **API isolation (required before launch)** — section B  
   Prove with **PostgREST + user JWTs**, not the SQL editor:
   - Weidner staff JWT → can read own leads
   - Other-tenant JWT → `[]` on `weidner_leads`
   - Anon key → cannot select/insert leads

3. **App unit tests** — `npm test`  
   - `WEIDNER_TENANT_ID` only from env  
   - Client payloads with `tenant_id` are rejected

## App enforcement (belt and suspenders)

```
Form / API body  →  never trusted for tenant_id
Server           →  getWeidnerTenantId() from env
DB RLS           →  weidner_is_staff(tenant_id)
Trigger          →  tenant_id immutable on UPDATE
```

## Sign-off

- [ ] Migrations 001–005 applied
- [ ] `scripts/rls-isolation-test.sql` A1–A3 PASS
- [ ] Cross-tenant API test (B2/B3) PASS
- [ ] Estimate form still works end-to-end
- [ ] Results noted in launch checklist
