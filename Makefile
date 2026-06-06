.DEFAULT_GOAL := help

# ─── Setup ──────────────────────────────────────────────────────────────

install: ## Install dependencies with bun
	bun install

add: ## Add a dependency (usage: make add PKG=name)
	bun add $(PKG)

add-dev: ## Add a dev dependency (usage: make add-dev PKG=name)
	bun add -d $(PKG)

remove: ## Remove a dependency (usage: make remove PKG=name)
	bun remove $(PKG)

# ─── Next.js ────────────────────────────────────────────────────────────

dev: ## Start Next.js dev server
	bun run dev

build: ## Build Next.js for production
	bun run build

start: ## Start Next.js production server
	bun run start

# ─── Storybook ──────────────────────────────────────────────────────────

storybook: ## Start Storybook dev server on :6006
	bun run storybook

storybook-build: ## Build Storybook static site
	bun run build-storybook

# ─── Quality ────────────────────────────────────────────────────────────

lint: ## Run ESLint
	bun run lint

lint-fix: ## Run ESLint with --fix
	bunx eslint --fix .

typecheck: ## Run TypeScript type check
	bunx tsc --noEmit

check: lint typecheck ## Run lint + typecheck

# ─── Tests ──────────────────────────────────────────────────────────────

test: ## Run tests once
	bunx vitest run

test-watch: ## Run tests in watch mode
	bunx vitest

# ─── Housekeeping ───────────────────────────────────────────────────────

clean: ## Remove build artifacts and caches
	rm -rf .next storybook-static node_modules/.cache

clean-all: clean ## Remove build artifacts + node_modules + lockfile
	rm -rf node_modules bun.lock

reinstall: clean-all install ## Wipe and reinstall everything

# ─── Help ───────────────────────────────────────────────────────────────

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "; printf "\nUsage: make \033[36m<target>\033[0m\n\nTargets:\n"} \
		/^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: install add add-dev remove dev build start storybook storybook-build \
        lint lint-fix typecheck check test test-watch clean clean-all reinstall help
