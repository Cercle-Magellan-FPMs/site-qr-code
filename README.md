# Site QR Code — Cercle informatique de la FPMs

Générateur statique de QR Codes de virement SEPA/EPC, construit avec Astro.

## Coordonnées configurées

- Bénéficiaire : `cercle informatique de la fpms`
- IBAN : `BE70 7512 1182 7125`
- BIC : `NICABEBBXXX`

La configuration bancaire se trouve dans `src/config.js`.

## Fonctionnalités

- Astro en sortie statique
- QR EPC069-12 version `002`
- virement SCT / UTF-8
- montant libre avec raccourcis
- communication facultative jusqu'à 140 caractères
- conservation locale via `localStorage`
- génération du QR exclusivement côté navigateur
- validation IBAN mod-97
- téléchargement PNG
- copie du payload EPC
- interface mobile-first reprenant le branding Magellan

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Le résultat statique est généré dans `dist/`.

## Dokploy

Configurer l'application en **Static** :

- Branch : `main`
- Build Path : `/`
- Build Command : `npm run build`
- Publish Directory : `dist`
- Container Port : `80`
