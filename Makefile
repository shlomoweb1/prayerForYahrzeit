# izkor - developer automation
#
# All targets proxy into web/ (the Vite app) or scripts/ (data pipeline).
# CI mirrors the same gates (see .github/workflows/ci.yml).
#
# Phase 5 (Firebase) targets will land here later - see plans/07-firebase.md.

NPM := npm --prefix web

.PHONY: install dev build preview lint lint-fix format format-check \
	typecheck test test-watch e2e lighthouse publish data fonts ci

## install - npm install in web/
install:
	$(NPM) install

## dev - Vite dev server (HMR) for development
##   make dev HOST=--host  → bind 0.0.0.0, reachable on the LAN (e.g. http://10.0.0.100:5173)
HOST ?=
dev:
	$(NPM) run dev -- $(HOST)

## build - production build (tsc + vite build)
build:
	$(NPM) run build

## preview - serve the production build on :4173
preview:
	$(NPM) run preview

## lint - eslint (errors fail CI)
lint:
	$(NPM) run lint

## lint-fix - eslint --fix
lint-fix:
	$(NPM) run lint:fix

## format - prettier write
format:
	$(NPM) run format

## format-check - prettier check
format-check:
	$(NPM) run format:check

## typecheck - tsc
typecheck:
	$(NPM) run typecheck

## test - vitest unit tests (run once)
test:
	$(NPM) run test

## test-watch - vitest watch mode
test-watch:
	$(NPM) run test:watch

## e2e - Playwright (spawns its own preview server on :4173)
e2e:
	$(NPM) run test:e2e

## lighthouse - audit dist (a11y/best-practices/seo) via its own static server
lighthouse: build
	$(NPM) run audit:lighthouse

## publish - build, prerender static routes, and deploy dist/ to Firebase Hosting
publish: build
	$(NPM) run prerender
	$(NPM) run deploy

## data - regenerate data/tehillim.json + data/letter-index.json
data:
	node scripts/build-tehillim.mjs
	node scripts/build-letters.mjs

## fonts - re-sync web/public/fonts from the licensed staging inventory
fonts:
	node scripts/copy-fonts.mjs

## ci - full local gate, mirrors CI (lint + typecheck + test + build + e2e)
ci: lint typecheck test build
	$(NPM) run test:e2e
