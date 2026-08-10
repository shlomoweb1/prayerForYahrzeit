# Les outils derrière ce site — expliqués simplement

Cette page explique, en langage simple, quels outils et technologies nous utilisons pour construire et faire fonctionner ce site.

Aucune connaissance technique n'est nécessaire pour la lire. Chaque terme est expliqué à sa première apparition.

---

## La version courte

Si vous ne devez retenir qu'une seule chose, retenez ceci :

> **Tout le site fonctionne dans votre propre navigateur, sur votre propre appareil. Il n'y a pas de serveur qui collecte vos informations, pas de suivi, pas de collecte de données cachée.**

En résumé :

- Le site est construit avec des outils gratuits et open source.
- La feuille de souvenir que vous créez est transformée en PDF **sur votre propre ordinateur** — elle n'est jamais envoyée ailleurs pour être traitée.
- Les polices hébraïques proviennent du **Open Siddur Project** (opensiddur.org/help/fonts), une collection gratuite de polices hébraïques conçues pour la prière et l'étude. Nous les préparons avec nos propres outils de conversion internes.
- Même si nous sommes basés en Israël — où la loi européenne sur la protection des données (RGPD) ne s'applique pas — nous avons construit le site pour être respectueux de la vie privée de chacun, et pour appliquer les mêmes principes partout.

---

## De quoi le site est fait

Un site web est un ensemble de fichiers que votre navigateur lit et affiche. Notre site est constitué des grandes parties suivantes.

### La page elle-même — React

La page interactive que vous voyez — l'assistant, l'aperçu, les boutons — est construite avec un outil gratuit et open source appelé **React**.

Pensez à React comme à un régisseur de scène : il décide quoi afficher, quand l'afficher, et comment réagir quand vous cliquez ou tapez.

### Le préparateur — Vite

Avant qu'un site puisse être affiché, ses fichiers doivent être préparés, organisés et optimisés.

L'outil qui fait cela s'appelle **Vite**. C'est aussi l'outil que nous utilisons pendant le développement : quand nous changeons quelque chose, le changement apparaît immédiatement dans notre navigateur.

### Le style — Tailwind

L'apparence du site — les couleurs, les espacements, les tailles, la disposition soignée de la feuille de souvenir — est réalisée avec un outil appelé **Tailwind**.

### Les langues — i18next

Le site est disponible en **hébreu, anglais, français et espagnol**.

Le système qui gère les traductions s'appelle **i18next** (le « i18n » est l'abréviation d'« internationalisation »). L'hébreu s'affiche de droite à gauche, comme il se doit.

### Installable et hors ligne — PWA

Le site peut être « installé » sur votre téléphone ou votre ordinateur, comme une petite application, et il peut fonctionner même sans connexion internet.

Cela est rendu possible par une technologie appelée **PWA** (Progressive Web App — application web progressive). Une fois que vous avez visité le site, il s'enregistre discrètement sur votre appareil pour être là quand vous en avez besoin.

---

## Les polices — des lettres hébraïques bien faites

Les textes de prière et de souvenir hébraïques ont des besoins particuliers :

- Les **signes de vocalisation** (nikoud) au-dessus et au-dessous des lettres.
- Les **signes de cantillation** (te'amim) utilisés pour la lecture biblique.
- Des lettres qui doivent rester belles à toutes les tailles, à l'écran comme sur le papier.

Les polices d'ordinateur ordinaires échouent souvent sur ce terrain.

### D'où viennent les polices

Les polices que nous utilisons proviennent du **Open Siddur Project** — une collection gratuite et ouverte de polices hébraïques, conçues spécialement pour la prière, la liturgie et l'étude (opensiddur.org/help/fonts).

Les polices du projet sont libres d'utilisation sous des licences ouvertes (principalement la SIL Open Font License), ce qui signifie que chacun peut les utiliser sans payer.

### La préparation des polices — nos outils internes

Les polices n'arrivent pas prêtes à l'emploi. Elles doivent être vérifiées, converties et organisées avant d'être placées sur le site.

Pour cela, nous utilisons nos propres outils de préparation internes, construits autour de deux utilitaires open source bien connus : **FontForge** et **FontTools** (le « couteau suisse » du monde des polices).

Cela se passe **avant** la mise en ligne du site, dans notre propre atelier. Le site lui-même ne télécharge jamais de polices depuis un service extérieur — elles sont stockées sur notre propre serveur.

### Le résultat

Le site propose **22 familles de polices hébraïques** pour la feuille de souvenir — des styles traditionnels des siddourim imprimés aux polices modernes et claires, en passant par une police spéciale pour les personnes ayant des difficultés de lecture.

---

## Le moteur PDF — Folio

La création du PDF est la partie la plus intéressante.

### La méthode courante : un serveur fait le travail

La façon habituelle de créer un PDF sur un site web est d'envoyer le document à un autre ordinateur — un **serveur** — qui crée le PDF et le renvoie.

Cela pose deux problèmes :

1. **La vie privée** — votre document quitte votre appareil.
2. **Le coût** — quand beaucoup de personnes créent des PDF, le serveur doit faire beaucoup de travail.

### Notre méthode : votre appareil fait le travail

Nous faisons différemment. Le PDF est créé **dans votre propre navigateur, sur votre propre appareil**.

Cela est possible grâce à une technologie appelée **WebAssembly** (en abrégé Wasm) — une façon pour les navigateurs d'exécuter des logiciels complexes rapidement, directement dans la page.

Nous avons écrit notre propre moteur PDF dans un langage de programmation appelé **Go**, puis nous l'avons compilé en un fichier que votre navigateur peut exécuter : un module WebAssembly d'environ 20 Mo que nous fournissons avec le site.

Le moteur s'appelle **Folio**. C'est un projet open source à l'origine, et nous en avons construit notre propre version, en l'étendant spécialement pour les besoins des documents hébraïques : texte de droite à gauche, nikoud, et polices précises dans le PDF final.

Ainsi, quand vous appuyez sur « Télécharger le PDF » :

> **Votre appareil → Votre navigateur → Le PDF est créé → Le PDF est sur votre appareil.**

Rien n'est envoyé à un serveur. Le document ne quitte jamais votre ordinateur.

### Pourquoi tant d'efforts ?

Parce que nous tenons à ce que le résultat soit **beau et précis** — ce que vous voyez à l'écran doit être exactement ce qui apparaîtra sur le papier, même en hébreu, même avec le nikoud, même sur une imprimante qui n'a jamais entendu parler de nos polices.

---

## Vie privée — ce qui arrive à vos informations

C'est important, alors soyons très clairs.

### Ce que nous n'avons PAS

Le site n'a :

- **Aucun serveur** qui collecte vos informations.
- **Aucune base de données** qui stocke vos feuilles.
- **Aucun compte** à créer.
- **Aucun suivi** de vos visites.
- **Aucun cookie** qui vous observe.
- **Aucune publicité**, et aucune vente de données.

Les informations mémorielles que vous saisissez — le nom, la date, les réglages — ne sont jamais envoyées nulle part. Elles vivent uniquement dans votre navigateur, dans l'adresse web de la page, et disparaissent quand vous fermez l'onglet.

### Les deux petites exceptions

Pour être tout à fait honnêtes, il y a deux petits moments où votre appareil communique avec le monde extérieur :

1. **Le format de papier** — lorsque vous entrez dans l'assistant pour la première fois, le site fait une seule requête brève à un service public gratuit pour deviner le format de papier courant dans votre pays (Letter ou A4). Seule la localisation approximative (le pays) est en jeu, et si la requête échoue, le site choisit simplement A4.

2. **Le formulaire de contact** — sur la page « À propos », il y a un formulaire de contact. Si vous l'utilisez, il n'envoie que le message et l'adresse e-mail que **vous** avez tapés. Rien d'autre.

C'est tout. Tout le reste — les polices, les textes, le moteur PDF — est chargé depuis notre propre site et traité sur votre appareil.

### RGPD — pourquoi nous y tenons, même si nous n'y sommes pas obligés

La loi européenne sur la protection des données, le **RGPD**, s'applique aux organisations de l'Union européenne. Nous sommes en Israël, donc la loi ne s'applique pas à nous.

Mais la vie privée n'est pas une chose que l'on fait parce qu'une loi l'exige. Nous avons construit le site pour qu'un auditeur européen même strict n'y trouve rien à redire :

> **Données minimales. Traitement local. Aucun suivi. Transparence totale.**

C'est notre façon de faire : être amical avec tout le monde et respecter les règles de chacun, où qu'il vive.

---

## Ce qui se passe où — une carte simple

Voici tout le parcours d'une feuille de souvenir :

**Vous saisissez les informations** (dans l'assistant)
↓
**La feuille est mise en page** (dans votre navigateur)
↓
**Les polices sont incorporées** (depuis notre serveur, dans le document)
↓
**Le PDF est créé** (par Folio, dans votre navigateur, sur votre appareil)
↓
**Vous le téléchargez** (le fichier n'est jamais allé ailleurs)

---

## L'atelier — les outils que nous utilisons pour construire le site

Pour les curieux, voici l'« établi » avec lequel nous construisons et vérifions le site. Tout est gratuit et open source :

- **Go** — le langage de programmation dans lequel le moteur PDF est écrit.
- **Node.js** — l'outil qui exécute les scripts de préparation, y compris les outils de polices.
- **FontForge et FontTools** — nos outils internes de préparation des polices (vérification, conversion et organisation des polices hébraïques).
- **TypeScript** — une version prudente de JavaScript, le langage des navigateurs ; il nous aide à détecter les erreurs avant la mise en ligne.
- **Playwright** — un robot qui ouvre le site automatiquement et le teste, page par page, dans de vrais navigateurs, à chaque changement.
- **Lighthouse et axe** — des inspecteurs automatiques qui vérifient la qualité du site : vitesse, accessibilité pour les personnes handicapées, et bonnes pratiques.
- **GitHub** — l'endroit où nous conservons et gérons le code source du site, visible par tous.

---

## En une phrase

Nous avons construit un site avec des outils gratuits et open source, où tout se passe sur votre propre appareil : votre feuille de souvenir est créée, mise en forme avec de belles polices hébraïques libres, et transformée en PDF — tout cela dans votre navigateur, en toute confidentialité, sans serveur, sans suivi et sans collecte de données.

Si vous avez une question sur quoi que ce soit dans cette page, utilisez le formulaire de contact de la page « À propos » — nous serons heureux de répondre.
