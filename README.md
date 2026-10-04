# Site QR Code — cercle informatique de la fpms

Site statique pour générer un QR Code de virement SEPA conforme au format EPC069-12 v2.

## Coordonnées configurées

- IBAN : `BE70 7512 1182 7125`
- BIC : `NICABEBBXXX`
- Bénéficiaire : `cercle informatique de la fpms`

Le nom du titulaire est défini dans `src/config.js`. Il doit correspondre au nom du bénéficiaire attendu par la banque.

## Fonctionnalités

- EPC version `002`, SCT, UTF-8
- QR généré côté navigateur avec correction d'erreur `M`
- montant saisi par le visiteur
- communication libre jusqu'à 140 caractères
- montant et communication conservés dans `localStorage`
- validation IBAN mod-97
- limite EPC de 331 octets
- téléchargement PNG et copie du payload EPC
- aucune API ni backend
- déploiement Vercel prêt à l'emploi

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Déploiement Vercel

Importer le dépôt dans Vercel. Le projet est détecté comme Vite ; `vercel.json` fixe également la commande de build et le dossier `dist`.
