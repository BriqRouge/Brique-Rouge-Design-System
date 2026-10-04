# Design System Starter — Commandes disponibles
# Utilisation : make <commande>

.PHONY: help setup tokens dev test build

## Affiche cette aide
help:
	@echo ""
	@echo "Design System Starter — Commandes disponibles"
	@echo "=============================================="
	@grep -E '^##' Makefile | sed 's/## /  /'
	@echo ""

## Installe les dépendances (première utilisation)
setup:
	pnpm install

## Compile les tokens Style Dictionary → CSS Variables
tokens:
	pnpm turbo run build --filter=@brique-rouge/tokens

## Lance Storybook en local sur localhost:6007 (compile les tokens d'abord)
dev: tokens
	pnpm turbo run dev --filter=@brique-rouge/storybook

## Lance les tests Vitest
test:
	pnpm turbo run test

## Build complet (tokens → composants → storybook)
build:
	pnpm turbo run build
