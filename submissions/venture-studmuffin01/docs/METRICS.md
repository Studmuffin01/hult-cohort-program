# Metrics — AI Prompting Academy (venture)

## Source (locked)

**Self-hosted Ludwitt reference API** on Railway (same pattern Roger accepted for Week 4/5 peers).

| Field | Value |
|-------|--------|
| API base (HTTPS) | `https://hult-cohort-program-production.up.railway.app` |
| Events / metrics path prefix | `/v1` |
| Full events base (Vercel `LUDWITT_API_BASE_URL`) | `https://hult-cohort-program-production.up.railway.app/v1` |
| Venture / Academy `app_id` | `7f6cbf89-341f-4c5d-bb50-482b9528f2ea` |
| Production app URL | https://prompt-like-a-pro-red.vercel.app |
| Integration checklist | https://prompt-like-a-pro-red.vercel.app/integration |

Reason: hosted `api.ludwitt.hult` was unreliable; staff accept a named reference-API instance. This `app_id` was registered on the Railway instance (17 Aug 2026).

**Do not commit** `api_key` / `jwt_secret`. Events auth for this reference API uses the documented demo developer key in server env only.

## Rules

- Count only **qualified external** users (≥1 real learning action)
- **Do not count** cohort members
- **Do not count** user ids containing `studmuffin01` / own handle
- Date-stamp every snapshot pasted into the PR
- Survey respondents are **not** product users

## Wiring verified

| Check | Result |
|-------|--------|
| Railway `/health` | `{"ok":true,"service":"ludwitt-hult-api"}` |
| Production `/integration` Events API base | Railway `/v1` (not `api.ludwitt.hult`) |
| Launch JWT → session source `ludwitt` | OK |
| Ping `lesson_started` | `mode=live` |

## Snapshots

| Date (ET) | unique_users | qualified_users | Notes |
|-----------|-------------:|----------------:|-------|
| 2026-08-17 | 1 | 1 | Smoke test after Railway wiring; JSON in `metrics-snapshot-2026-08-17.json`. Not yet ≥25 external. |
| 2026-08-20 | 10 | 10 | Live API pull; recruiting toward ≥25 qualified external users. |

### Raw export (2026-08-17)

```json
{"unique_users":1,"qualified_users":1}
```

### Raw export (2026-08-20)

```json
{"unique_users":10,"qualified_users":10}
```

Source command (key not stored in repo):

```text
GET https://hult-cohort-program-production.up.railway.app/v1/apps/7f6cbf89-341f-4c5d-bb50-482b9528f2ea/metrics
Authorization: Bearer <developer key>
```

## PR paste block

```text
Metrics source: self-hosted Ludwitt reference API on Railway
API: https://hult-cohort-program-production.up.railway.app
app_id: 7f6cbf89-341f-4c5d-bb50-482b9528f2ea
Snapshot date: 2026-08-20
unique_users: 10
qualified_users: 10
App URL: https://prompt-like-a-pro-red.vercel.app
Note: Recruiting toward ≥25 qualified external users. Survey respondents not counted.
```
