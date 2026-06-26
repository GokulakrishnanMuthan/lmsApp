# CLAUDE.md

Guidance for working in this repository.

## Project

**lms-app** — a Library Management System SPA built with **Angular 16** (CLI 16.2, generated on Angular 15). It manages books, racks, devotees (members/borrowers), book issuing/returns, reporting, and user/role administration.

## Commands

```bash
npm start        # ng serve  -> dev server at http://localhost:4200 (auto-reload)
npm run build    # ng build  -> output in dist/lms-app
npm run watch    # ng build --watch (development configuration)
npm test         # ng test   -> Karma + Jasmine unit tests
```

Run a single spec by filtering in the Karma browser, or temporarily use `fdescribe`/`fit`.

## Backends (important)

The frontend talks to **two different backends** — both must be running for full functionality:

- `http://localhost:8080/lms/` — primary Spring-style REST API (books, issues, returns, devotees, racks, reports, auth). Defined as `apiUrl` in [auth.service.ts](src/app/service/auth.service.ts).
- `http://localhost:3000/` — a `json-server` mock (`db.json` at repo root) serving `role` and `devote` endpoints (`apiUrlRole`, `apiUrlDevotes`).

All HTTP calls are centralized in a single [AuthService](src/app/service/auth.service.ts) — despite the name, it is the app-wide API client, not just authentication. Add new endpoints here.

## Architecture

- **Components** live under [src/app/components/](src/app/components/), one folder per feature (login, dashboard, book, newbook, devote, newdevote, bookissue, newbookissue, retunbook, reports, racks, settings, userlist, etc.). Most are declared in [app.module.ts](src/app/app.module.ts) (no lazy-loaded feature modules).
- **Routing** is flat in [app-routing.module.ts](src/app/app-routing.module.ts); most routes are protected by `AuthGuard`.
- **Auth** is session-based: [AuthGuard](src/app/guard/auth.guard.ts) checks `sessionStorage` (`username`, `userrole`) via `AuthService.isLoggedIn()`. The `user` route additionally requires `userrole === 'admin'`. There is no token/HTTP interceptor — login state is plain `sessionStorage`.
- **State (NgRx)** in [src/app/ngrx/](src/app/ngrx/) holds only **book search-filter strings** (rack, row, accessNo, title, author, publisher, language) used to persist list filters across navigation — not domain data. Single root reducer registered via `StoreModule.forRoot({ book: reducer })`.
- **Interfaces / models** in [src/app/interfaces/](src/app/interfaces/) (`book`, `bookissue`, `bookVo`, `devote`).
- **UI**: Angular Material ([material.module.ts](src/material.module.ts)), `@angular/flex-layout`, `ngx-toastr` for notifications, `xlsx` for report exports. Tables use `MatTableDataSource` with `MatPaginator` + `MatSort`.

## Conventions & gotchas

- **Forms**: `ReactiveFormsModule` is the norm (e.g. `this.buider.group(...)` — note the misspelled `buider` field is consistent across components).
- Filenames carry intentional-looking typos used as identifiers/routes — keep them as-is: `retunbook` (return book), `devote`/`devotee` (member), `buider`. Don't "fix" these without updating all references and routes.
- Most service methods and component fields are typed `any`; payloads are passed loosely. Match the surrounding style unless explicitly asked to tighten typing.
- Components subscribe directly to `AuthService` observables in `ngOnInit` (no `async` pipe, no unsubscribe). Follow existing patterns; if introducing long-lived subscriptions, prefer `takeUntilDestroyed`/`async` pipe.
- Lots of commented-out `console.log` debugging is left in source — harmless, but don't add more.
- `AuthService.saveIssueBook(...)` subscribes internally and returns the subscription (fire-and-forget); other write methods return the `Observable` for the caller to subscribe. Be aware of the inconsistency when wiring new calls.

## Notes

- Package versions are mixed: Angular core is 16.x while Material/CDK/flex-layout are 15.x. Be cautious adding Material APIs that assume v16.
- No environment files in use — API base URLs are hardcoded in `AuthService`. Changing environments means editing that file.
