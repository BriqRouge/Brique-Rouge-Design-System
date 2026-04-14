# Design System Starter — Commandes disponibles
# Utilisation : make <commande>

.PHONY: help setup tokens dev test build example reset-tokens

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
	pnpm turbo run build --filter=@starter/tokens

## Lance Storybook en local sur localhost:6007 (compile les tokens d'abord)
dev: tokens
	pnpm turbo run dev --filter=@starter/storybook

## Lance les tests Vitest
test:
	pnpm turbo run test

## Build complet (tokens → composants → storybook)
build:
	pnpm turbo run build

## Teste le système avec des tokens d'exemple (tokens.example.json)
example:
	cp packages/tokens/tokens.example.json packages/tokens/tokens.json
	$(MAKE) tokens

## Remet tokens.json à son état vide initial
reset-tokens:
	@printf '{\n  "$$schema": "https://raw.githubusercontent.com/tokens-studio/tokens-schema/main/schema.json",\n  "_comment": "Remplace ce fichier par ton export Figma Variables. Voir Étape 2 dans Storybook."\n}\n' > packages/tokens/tokens.json
	@echo "✅ tokens.json remis à zéro"
