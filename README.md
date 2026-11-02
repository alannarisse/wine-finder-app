# WineFinderApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### more commands
command: ```lsof -i :4200 2>/dev/null | head -3```
description: Check if dev server is still running

npm run build 2>&1


## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## MCP Servers
This app uses the railway MCP Server and requires the [Railway CLI](https://docs.railway.com/cli)
[How to install Railway MCP server](https://docs.railway.com/ai/mcp-server)

# Terminal 1: Start backend
cd wine-api
npm run start:dev
# Terminal 2: Seed the database (first time only)
cd wine-api
npm run seed
# Terminal 3: Frontend (already running)
cd wine-finder-app
ng serve

## SCSS to CSS
Dev server (ng serve): Compiled CSS is served from memory (not written to disk)
Production build (ng build): Output goes to dist/wine-finder-app/browser/ as bundled CSS files

## Database weirdness
command: psql -d postgres -U $(whoami) -c "CREATE DATABASE wine_finder;" 2>&1
description: Create wine_finder database with current user

## Managing saved wine content

Run the API and PostgreSQL, then open `/admin` to add/edit wines and manage varietal mappings. Changes save through the API and survive refreshes. Public recommendations use that saved data too. See the [API README](../wine-api/README.md#add-content-with-the-admin-tool) for setup, data-entry steps, and server-side admin authentication setup.

Run the isolated admin integration checks with `npx playwright test e2e/admin-api.spec.ts`. They mock the API and do not change database records. The test uses installed Google Chrome.

## Extending content and publishing it to Railway

The admin **Varietal** input accepts new names; it is not limited to its suggestions. Wine records and mappings save to the database behind the configured API. Saving locally does not copy those records to Railway when you deploy code.

See the API README for:

- [New varietals, food/preparation options, and entirely new fields](../wine-api/README.md#new-varietals-food-options-and-database-fields).
- [Moving content to Railway](../wine-api/README.md#move-new-content-to-railway), including incremental additions, backups, schema changes, and a first-time full transfer into an empty database.

Food/preparation rules still live in `src/app/services/pairing.service.ts` and require a frontend deployment. New database columns also require API validation, model/form changes, and a tested SQL migration; the repo does not yet include an automated migration runner.

## Admin login configuration

The admin password is verified by the API. It is no longer stored in the Angular source, and the previous `admin_auth` browser flag does not authorize access. Set `ADMIN_PASSWORD_HASH` in the API's private `.env` locally and in its Railway service variables before starting/deploying it. See [Admin authentication setup](../wine-api/README.md#admin-authentication-setup) for the hash helper and full instructions.

Sessions expire after eight hours and are revoked on logout. API restarts sign admins out. The current server session store supports one API replica; add shared session storage before scaling. Deployed frontend and API URLs must use HTTPS. Public pairing recommendations remain available without logging in.

Authentication checks: `npx playwright test e2e/admin-auth.spec.ts e2e/admin-api.spec.ts` (mocked API; installed Chrome). Backend tests: from `wine-api`, `npm run test:e2e -- --runInBand --testPathPatterns=auth.e2e-spec.ts` (no database).
