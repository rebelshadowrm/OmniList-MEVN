# Phase 2 Readiness

Phase 2 is considered complete when the current Express/Vite app no longer relies on browser-only state for its primary auth and catalog flows, and there is a repeatable verification step before Phase 3 schema work begins.

## Closed items

- Auth bootstrap is session-first through `GET /api/auth/session`.
- Password reset is implemented and stored with hashed reset tokens.
- Catalog search/detail/genre requests are mediated through `/api/catalog/...`.
- Active browse, detail, thread, profile, and list editing flows no longer rely on `querySelector` or `contenteditable`.
- The remaining browser-only behavior is isolated to explicitly client-side concerns such as theme application and outside-click listeners.

## Verification

Run:

```bash
npm run verify:phase2
```

This executes:

- client type-checking
- client regression tests for session bootstrap and catalog services
- client production build

## Before Phase 3

- Keep `entityRef` reads backward-compatible until a real backfill script exists.
- Do not remove legacy numeric identifiers until migrated data has been verified.
- Treat any new client-side third-party catalog fetch as a regression.
