# Design System Starter

![CI](https://github.com/RomainRichardpro/design-system-starter/workflows/CI/badge.svg)

> Un template pour industrialiser un Design System avec Figma, React et Claude AI.

## Ce que ce template te permet de faire

- Transformer tes variables Figma en tokens CSS automatiquement
- Documenter ton Design System dans Storybook
- Créer des composants React accessibles et testés avec Claude AI
- Déployer ta documentation en ligne via GitHub Pages

---

## Avant de commencer

Tu as besoin de quatre outils sur ton ordinateur.
Suis les instructions selon ton système.

---

### 1. Node.js 18 ou plus récent

Node.js est le moteur qui fait tourner le projet.

**Mac**
1. Va sur https://nodejs.org
2. Télécharge la version **LTS** (bouton vert à gauche)
3. Ouvre le fichier téléchargé et suis les étapes d'installation

**Windows**
1. Va sur https://nodejs.org
2. Télécharge la version **LTS** (bouton vert à gauche)
3. Ouvre le fichier `.msi` téléchargé et suis les étapes d'installation
4. Redémarre ton ordinateur après l'installation

**Vérifier que l'installation a fonctionné**

Ouvre ton terminal et tape :
```bash
node --version
```
Tu dois voir un numéro qui commence par `v18` ou plus (ex: `v20.11.0`).

> **C'est quoi le terminal ?**
> C'est une fenêtre dans laquelle tu tapes des commandes texte.
> - Sur Mac : ouvre **Terminal**
>   (Applications → Utilitaires → Terminal)
> - Sur Windows : ouvre **Git Bash**
>   (installé automatiquement avec Git à l'étape suivante)

---

### 2. Git

Git te permet de récupérer ce template et de versionner tes changements.

**Mac**
1. Ouvre ton Terminal
2. Tape cette commande et appuie sur Entrée :
```bash
xcode-select --install
```
3. Une fenêtre s'ouvre — clique sur **Installer**
4. Attends la fin de l'installation (5 à 10 minutes)

**Windows**
1. Va sur https://git-scm.com
2. Clique sur **Download for Windows**
3. Ouvre le fichier téléchargé et suis les étapes
   (laisse toutes les options par défaut)
4. À la fin, tu auras accès à **Git Bash** — c'est ton terminal pour la suite

**Vérifier que l'installation a fonctionné**
```bash
git --version
```
Tu dois voir quelque chose comme `git version 2.43.0`.

---

### 3. pnpm

pnpm est le gestionnaire de dépendances du projet.
Une fois Node.js installé, ouvre ton terminal et tape :
```bash
npm install -g pnpm
```

**Vérifier que l'installation a fonctionné**
```bash
pnpm --version
```
Tu dois voir un numéro de version (ex: `8.15.0`).

---

### 4. Claude Pro avec MCP Figma

Claude AI est ton partenaire pour lire les composants Figma
et générer le code.

**Créer un compte Claude Pro**
1. Va sur https://claude.ai
2. Crée un compte ou connecte-toi
3. Souscris à l'abonnement **Pro**

**Connecter le MCP Figma**
1. Dans Claude, clique sur ton avatar en bas à gauche
2. Va dans **Paramètres**
3. Clique sur **Intégrations**
4. Trouve **Figma** dans la liste et clique sur **Connecter**
5. Autorise l'accès à ton compte Figma

---

## Démarrage

Une fois les quatre outils installés, tu es prêt.

### Étape 1 — Copier le template

Sur cette page GitHub, clique sur le bouton vert **"Use this template"**
puis **"Create a new repository"**.

- Donne un nom à ton repo (ex: `mon-projet-design-system`)
- Laisse les autres options par défaut
- Clique sur **"Create repository"**

> GitHub va créer une copie de ce template dans ton compte.
> Tu seras redirigé vers ton nouveau repo.

### Étape 2 — Récupérer le projet sur ton ordinateur

Sur la page de **ton nouveau repo** (pas ce template),
clique sur le bouton vert **"Code"** puis copie l'URL affichée.

Ouvre ton terminal et tape ces commandes
(remplace l'URL par celle que tu viens de copier) :
```bash
git clone https://github.com/TON-COMPTE/TON-REPO.git
cd TON-REPO
```

> `git clone` télécharge le projet sur ton ordinateur.
> `cd TON-REPO` t'amène dans le dossier du projet.

### Étape 3 — Installer le projet
```bash
make setup
```

> Cette commande installe toutes les dépendances du projet.
> Elle peut prendre 1 à 2 minutes.
> Tu verras défiler des lignes dans le terminal — c'est normal.

### Étape 4 — Lancer Storybook
```bash
make dev
```

> Ouvre ton navigateur sur **http://localhost:6007** ou **https://briqrouge.github.io/Brique-Rouge-Design-System**

✅ Tu vois Storybook s'ouvrir dans ton navigateur ?
**La suite du guide est directement dans Storybook.**

---

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `make setup` | Installe les dépendances |
| `make dev` | Lance Storybook en local |
| `make tokens` | Génère les CSS depuis tokens.json |
| `make test` | Lance les tests |
| `make build` | Build complet du projet |
| `make help` | Liste toutes les commandes |

---

Auteur : Damien Ramzi — Senior Product Designer, UX Strategist (sur la base du template de Romain Richard).
Licence : MIT

