---
title: "Ce qu'il y a derrière ce site - expliqué simplement"
date: '2026-08-10'
excerpt: "Ce qui fait fonctionner ce site en silence - pourquoi il est construit avec des outils libres, comment les polices hébraïques sont préparées, et pourquoi le travail se fait sur votre appareil, pas chez nous"
---

On nous demande souvent ce qui fait fonctionner un site comme celui-ci en silence - voici donc la réponse, en langage simple, sans jargon technique.

---

## La version courte

Si vous ne devez retenir qu'une seule chose, retenez celle-ci :

> **Tout le site fonctionne sur votre propre appareil. Il n'y a aucun serveur qui collecte vos informations, aucun suivi, et aucune collecte de données cachée.**

En bref :

- Le site est construit avec des outils libres et ouverts.
- La feuille de mémoire que vous créez devient un PDF **sur votre propre appareil** - elle n'est jamais envoyée nulle part pour être traitée.
- Les polices hébraïques proviennent du Open Siddur Project (opensiddur.org/help/fonts), une collection gratuite de polices conçues pour les textes de prière et d'étude. Nous les vérifions et les ajustons nous-mêmes avant qu'elles n'arrivent sur le site.
- Bien que nous soyons basés en Israël, où la loi européenne sur la vie privée (RGPD) ne s'applique pas à nous - nous avons construit le site pour respecter les mêmes principes de confidentialité partout.

---

## De quoi le site est fait

Un site web est en réalité une simple collection de fichiers que votre navigateur lit et vous montre. Voici les principales parties dont notre site est fait, sans trop de jargon.

### La page que vous voyez

L'assistant de création, l'aperçu, les boutons - tout ce que vous voyez et sur quoi vous cliquez est construit avec des outils libres et ouverts, de sorte que la page vous répond instantanément : quand vous tapez ou cliquez, le changement apparaît à l'écran immédiatement, sans recharger la page.

### L'apparence

Les couleurs, les espacements, et la mise en page soignée de la feuille de mémoire ont été conçus avec attention, pour que la page paraisse propre et ordonnée - à l'écran comme sur le papier, après impression.

### Les langues

Le site est disponible en **hébreu, anglais, français et espagnol**. L'hébreu s'affiche de droite à gauche, comme il se doit.

### Installable et utilisable hors ligne

Vous pouvez « installer » le site sur votre téléphone ou votre ordinateur, comme une petite application, et il peut fonctionner même sans connexion internet. Après votre première visite, il s'enregistre discrètement sur votre appareil, pour être là même sans réseau.

---

## Les polices - des lettres hébraïques comme il se doit

L'hébreu est la langue des textes sacrés juifs, et il a des particularités - les signes de vocalisation (nikoud) et les signes de cantillation (taamim) - que la police doit savoir afficher correctement :

- Les **signes de vocalisation** au-dessus et en dessous des lettres.
- Les **signes de cantillation** utilisés dans la lecture de la Torah.
- Des lettres qui doivent rester belles à toutes les tailles - à l'écran comme sur le papier.

Les polices ordinaires échouent souvent sur ce point.

### D'où viennent les polices

Les polices que nous utilisons proviennent du **Open Siddur Project** - une collection libre et ouverte de polices hébraïques conçues spécialement pour la prière, la liturgie et l'étude (opensiddur.org/help/fonts). Les polices du projet sont libres d'utilisation sous des licences ouvertes (principalement la licence SIL Open Font License), ce qui signifie que tout le monde peut les utiliser sans payer.

### La préparation des polices

Les polices n'arrivent pas prêtes à l'emploi. Nous les traitons nous-mêmes au préalable - par exemple, en veillant à ce que chaque lettre et chaque signe de vocalisation ait exactement la bonne forme, y compris sa version grasse. Ainsi, au moment de créer le PDF, on sait exactement quelle lettre afficher - sans deviner, sans se rabattre sur une forme qui ne convient pas.

Ce traitement se fait **avant** la mise en ligne du site, dans notre propre atelier. Ce sont ces polices déjà prêtes qui vous sont envoyées avec le reste des fichiers du site - le site ne télécharge aucune police depuis un service extérieur pendant que vous l'utilisez.

### Le résultat

Le site propose **22 familles de polices hébraïques** pour la feuille de mémoire - des styles traditionnels des livres de prière imprimés, en passant par des polices modernes et claires, jusqu'à une police spéciale pour les personnes ayant des difficultés de lecture.

---

## Comment le PDF est créé

La création du PDF est la partie la plus intéressante.

### La méthode habituelle : un serveur fait le travail

La méthode habituelle pour créer un PDF sur un site consiste à envoyer le document à un autre ordinateur - un **serveur** - qui crée le PDF et le renvoie. Cela pose deux problèmes :

1. **Confidentialité** - votre document quitte votre appareil.
2. **Coût** - quand beaucoup de personnes créent des PDF, le serveur doit fournir beaucoup de travail.

### Notre méthode : votre appareil fait le travail

Nous faisons les choses différemment. Le PDF est créé **à l'intérieur de votre propre navigateur, sur votre propre appareil**, grâce à une technologie intégrée aux navigateurs modernes qui leur permet d'exécuter des logiciels complexes rapidement, sans passer par le réseau.

Nous avons écrit nous-mêmes notre moteur de création de PDF, et nous le préparons pour que votre navigateur puisse l'exécuter directement - un fichier d'environ 20 mégaoctets, que nous envoyons avec le reste du site.

Ce moteur s'appelle **Folio**. Il a commencé comme un projet ouvert, et nous en avons construit notre propre version, en l'étendant spécialement pour les besoins des documents hébraïques : texte de droite à gauche, signes de vocalisation, et polices précises dans le PDF final.

Alors quand vous cliquez sur « Télécharger le PDF » :

> **Votre appareil → Votre navigateur → Le PDF est créé → Le PDF est enregistré sur votre appareil.**

Rien n'est envoyé à un serveur. Le document ne quitte jamais votre ordinateur.

### Pourquoi on se donne cette peine

Parce qu'il nous importe que le résultat soit **beau et précis** - ce que vous voyez à l'écran doit être exactement ce qui apparaît sur le papier, même en hébreu, même avec les signes de vocalisation, même sur une imprimante qui n'a jamais rencontré nos polices.

---

## Confidentialité - ce qu'il advient de vos informations

C'est important, alors soyons très clairs.

### Ce que nous n'avons pas

Le site n'a :

- **Aucun serveur** qui collecte vos informations.
- **Aucune base de données** qui stocke vos feuilles.
- **Aucun compte** que vous devez créer.
- **Aucun suivi** de vos visites.
- **Aucun cookie** qui vous espionne.
- **Aucune vente de données** à des tiers.

Les détails de la feuille de mémoire que vous tapez - le nom, la date, les réglages - ne sont jamais envoyés nulle part. Ils vivent uniquement dans votre propre navigateur, et disparaissent quand vous fermez l'onglet.

### Les deux petites exceptions

Pour être tout à fait honnêtes, il y a deux petits moments où votre appareil parle au monde extérieur :

1. **Le format de papier** - dès que vous entrez dans l'assistant, le site fait une seule requête brève à un service public gratuit pour deviner le format de papier courant dans votre pays (Letter ou A4), à partir de votre adresse IP. Seule votre localisation approximative (le pays) est concernée, et si la requête échoue, le site choisit simplement A4. Ce choix est affiché, et vous pouvez le modifier, à la dernière étape de l'assistant, avec les autres réglages de mise en forme de la feuille.

2. **Le formulaire de contact** - la page « À propos » comporte un formulaire de contact. Si vous l'utilisez, le message et l'adresse e-mail **que vous** avez tapés passent par un service externe de confiance qui nous les transmet par e-mail. Rien d'autre n'est envoyé.

C'est tout. Tout le reste - les polices, les textes, la création du PDF - se charge depuis notre propre site et se traite sur votre appareil.

### RGPD - pourquoi ça nous importe même si nous n'y sommes pas obligés

La loi européenne sur la vie privée, le **RGPD**, s'applique aux organisations de l'Union européenne. Nous sommes en Israël, donc la loi ne s'applique pas officiellement à nous.

Mais la confidentialité n'est pas quelque chose qu'on fait uniquement parce qu'une loi le dit. Nous avons construit le site pour qu'un auditeur européen strict n'y trouve rien à redire :

> **Données minimales. Traitement sur votre propre appareil. Aucun suivi. Transparence totale.**

C'est ainsi que nous aimons travailler - être bienveillants envers tous, et respecter la confidentialité de chacun, où qu'il vive.

---

## Ce qui se passe où - une carte simple

Voici le parcours complet d'une feuille de mémoire :

**Vous tapez les détails** (dans l'assistant)
↓
**La feuille est mise en page** (dans votre navigateur)
↓
**Les polices sont intégrées** (depuis les fichiers du site, dans le document)
↓
**Le PDF est créé** (à l'intérieur de votre navigateur, sur votre appareil)
↓
**Vous le téléchargez** (le fichier n'est jamais allé ailleurs)

---

## Pour les curieux

Nous vérifions régulièrement le site - sa vitesse, son accessibilité pour les personnes en situation de handicap, et son bon fonctionnement - pour maintenir une qualité élevée.

---

## En une phrase

Nous avons construit un site avec des outils libres et ouverts, où tout se passe sur votre propre appareil : votre feuille de mémoire est créée, mise en forme avec de belles polices hébraïques gratuites, et transformée en PDF - le tout dans votre navigateur, en toute confidentialité, sans serveur, sans suivi et sans collecte de données.

Si vous avez une question sur le contenu de cette page, nous serons heureux d'y répondre - via le formulaire de contact de la page « À propos ».
