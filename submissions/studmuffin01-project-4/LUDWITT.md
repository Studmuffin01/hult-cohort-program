# Ludwitt wiring — your checklist

You do the registration in the browser. The app already knows how to verify tokens and send events.

## A. Register the app (you)

1. Open https://ludwitt.com/developers (or staff’s current developer portal).
2. Create / register an app with roughly:
   - **Title:** Prompt Like a Pro: The SCORE Method for Copilot  
   - **Description:** ≥ 100 characters — professional prompting with SCORE for managers, analysts, lawyers, etc.  
   - **Topic:** Professional skills / Prompt engineering  
   - **Launch URL:** `http://localhost:3000/launch` for local tests → later `https://YOUR_VERCEL_URL/launch`  
   - **Repo URL:** your public GitHub (or cohort PR head when ready)
3. Save these three values somewhere private:
   - `app_id`
   - `api_key`
   - `jwt_secret`

Never commit them. Never paste them into chat if you can avoid it.

## B. Put keys in the app

```bat
cd submissions\studmuffin01-project-4
copy .env.example .env.local
```

Edit `.env.local` and fill:

```
LUDWITT_APP_ID=...
LUDWITT_API_KEY=...
LUDWITT_JWT_SECRET=...
LUDWITT_API_BASE_URL=https://api.ludwitt.hult/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
ALLOW_DEV_BYPASS=true
```

**Local sandbox note:** `execution/ludwitt-hult-api` authenticates events with the
**developer** key (`prod_key_demo`), not the `app_…` key returned at registration.
Keep `app_id` + `jwt_secret` from register; set `LUDWITT_API_KEY=prod_key_demo` and
`LUDWITT_API_BASE_URL=http://localhost:4000/v1`.

Restart `npm run dev` after any env change.

## C. Confirm wiring in the UI

1. Open http://localhost:3000/integration  
2. All three secrets should show **OK**  
3. Start a session (bypass or real token)  
4. Click **Ping lesson_started**  
   - `mode=live` → API accepted the event  
   - `mode=dry-run` → keys still missing or wrong env file  

## D. Test real launch JWT (local)

With `LUDWITT_JWT_SECRET` set:

```bat
node scripts\mint-launch-token.mjs
```

Open the printed URL. You should land on Module 01 — **not** “Launch from Ludwitt/Hult”.

## E. Optional: local Ludwitt API sandbox

If the public API is down or you want a dry practice:

```bat
cd execution\ludwitt-hult-api
npm install
npm run dev
```

Point `LUDWITT_API_BASE_URL=http://localhost:4000/v1`, register via that API (`DEVELOPER.md`), put returned creds in `.env.local`.

## F. Production (after deploy)

1. Set the same three secrets + API base on Vercel  
2. `NEXT_PUBLIC_APP_URL=https://YOUR_DEPLOY`  
3. `ALLOW_DEV_BYPASS=false`  
4. Update Ludwitt listing **launch_url** to `https://YOUR_DEPLOY/launch`  
5. Launch from the Ludwitt directory once and confirm `/integration` session source is `ludwitt`

## Merge bar reminder

Sunday needs evidence of:

1. Registered app (app id + listing URL)  
2. Working `/launch?token=` (bad token → “Launch from Ludwitt/Hult”)  
3. Events firing (≥1 non-heartbeat per session)  
