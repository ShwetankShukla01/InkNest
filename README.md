# InkNest — Blog & Community

InkNest is a full-stack blogging platform built for the Hatchable runtime.

## Features
- Email-code / passkey authentication managed by Hatchable
- Create and edit blog posts; delete only your own posts
- Comment on stories; delete only your own comments
- Search by title/content/topic and filter by category
- PostgreSQL database, parameterized SQL, responsive frontend
- Three sample seed stories

## Stack
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: JavaScript API handlers using the Hatchable SDK
- Database: PostgreSQL
- Authentication: Hatchable passwordless auth

## Project structure
- `public/` — browser UI and styles
- `api/posts.js` — list/search/create posts
- `api/posts/[id].js` — read/update/delete a post
- `api/comments.js` — list/create/delete comments
- `migrations/` — schema definitions
- `seed.sql` — sample posts
- `hatchable.toml` — app metadata and auth configuration

## Deploy
Import this ZIP into Hatchable, or copy the files into an existing Hatchable project and deploy. The API files import `db` and `auth` from the Hatchable SDK, so they are not drop-in Express handlers without adaptation.

## Important
The hosted project uses a richer version of the UI. This ZIP is a portable source starter with the same backend schema and API behavior, and a lighter local frontend. Never commit secrets or real user data.
