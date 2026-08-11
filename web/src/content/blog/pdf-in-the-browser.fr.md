---
title: "Comment un PDF peut-il être créé directement dans le navigateur ?"
date: '2026-08-10'
excerpt: "Chaque feuille commémorative devient un PDF - mais la partie intéressante, c'est comment. Sans serveur, sans capture d'écran : un véritable moteur de mise en page compilé en WebAssembly reconstruit le document directement dans votre navigateur, voyelles hébraïques comprises."
---

Créer un PDF semble simple.

Nous avons un document sur une page web, et nous voulons en obtenir un fichier PDF que nous pouvons enregistrer, envoyer et imprimer.

Mais dès que nous voulons que le résultat soit **précis et cohérent**, en particulier avec l'hébreu et ses signes diacritiques (le nikoud), les choses deviennent beaucoup plus intéressantes.

---

## Au lieu d'envoyer le document à un serveur

La méthode courante pour créer un PDF consiste, pour un site web, à envoyer le document à un **serveur**.

Un serveur est simplement un autre ordinateur qui effectue le travail pour le site web.

Le processus ressemble à peu près à ceci :

**Votre ordinateur → Site web → Serveur → Création du PDF → Retour à votre ordinateur**

Cela fonctionne, mais cela signifie qu'un autre ordinateur doit faire le travail.

Si 1 000 utilisateurs créent des PDF, le serveur doit traiter 1 000 tâches de génération de PDF.

Il existe une autre approche :

**Laisser l'ordinateur ou l'appareil de l'utilisateur faire le travail lui-même.**

Le processus devient alors :

**Votre ordinateur → Navigateur → Création du PDF**

Le document n'a pas besoin d'être envoyé ailleurs juste pour être transformé en PDF.

---

## Comment un navigateur peut-il faire cela ?

C'est là qu'intervient une technologie appelée **WebAssembly**, ou **Wasm**.

Sans entrer dans les détails techniques, WebAssembly est une façon de faire tourner, à l'intérieur du navigateur, des logiciels capables d'effectuer des opérations complexes très efficacement.

Au lieu que le navigateur se contente d'afficher un site web, il peut aussi exécuter un moteur entier chargé de créer un PDF.

C'est ce qui rend l'idée particulièrement intéressante :

> **Le PDF peut être créé directement dans le navigateur, sur l'ordinateur de l'utilisateur.**

Le travail n'a pas besoin de passer par un serveur.

---

## Mais créer un PDF, ce n'est pas juste prendre une capture d'écran

Voici l'un des défis les plus importants.

Il est tentant de penser :

> « J'ai déjà la page à l'écran. Il suffit d'enregistrer ce que je vois en PDF. »

Mais ce n'est pas ce que nous voulons.

Si nous transformons simplement l'écran en image, nous obtenons une **image du document**, pas un vrai document.

Le texte n'est plus vraiment du texte.

Ce n'est que des pixels.

Et lorsqu'on l'agrandit ou qu'on l'imprime, on est limité par la qualité de cette image.

Il faut donc une autre approche.

---

## Le navigateur doit reconstruire le document

Une page web contient beaucoup de choses :

du texte, des titres, des images, des tableaux, des espacements, des marges, et plus encore.

Le navigateur doit décider où chaque élément se trouve.

Il doit savoir :

* Où commence une ligne de texte.
* Quand le texte doit passer à la ligne suivante.
* Où une image doit se placer.
* Combien d'espace le texte occupe.
* Où une page se termine et où une autre commence.
* Comment les différents éléments sont positionnés les uns par rapport aux autres.

Ce processus s'appelle la **mise en page**.

Et le logiciel chargé de prendre ces décisions s'appelle un **moteur de mise en page** (Layout Engine).

---

## Que fait un moteur de mise en page ?

Au lieu de prendre une photo de la page, un moteur de mise en page regarde **ce que le document dit qu'il doit être**.

Par exemple :

> Le titre va ici.
> Le texte va en dessous.
> L'image va sur le côté.
> Cette ligne est trop longue, il faut donc en déplacer une partie à la ligne suivante.

Le moteur calcule alors toutes ces positions.

C'est exactement ce dont nous avons besoin pour créer un PDF.

Pas une photo de la page.

**Un document reconstruit.**

---

## Et les polices, dans tout ça ?

Voici maintenant un autre problème.

Supposons que le document utilise une police particulière.

Si cette police se trouve sur l'ordinateur, tout va bien.

Mais que se passe-t-il si ce n'est pas le cas ?

Le navigateur peut utiliser une autre police à la place.

Cela s'appelle le **Font Fallback** (police de repli).

En termes simples :

> « La police que tu as demandée n'est pas disponible, donc j'en essaie une autre. »

C'est généralement une bonne chose pour un site web.

Si une police particulière manque, il vaut bien mieux afficher la page avec une autre police que de montrer des caractères manquants.

Mais lorsqu'on crée un PDF censé avoir **exactement la même apparence partout**, cela peut devenir un problème.

---

## Qu'est-ce qu'une Web Font ?

Un site web peut apporter avec lui la police dont il a besoin.

Une police fournie par le site web s'appelle une **Web Font**.

Au lieu de dire à l'ordinateur :

> « Utilise une police déjà installée chez toi. »

Le site web dit :

> « Voici la police que je veux que tu utilises. »

Cela donne au site web un bien meilleur contrôle sur l'apparence de son texte.

Mais il faut encore s'assurer que le PDF final ne dépend pas de ce qui se trouve, par hasard, sur l'ordinateur où le PDF est ouvert ou imprimé.

---

## Que se passe-t-il quand un caractère manque ?

Cela nous amène à quelque chose que les personnes ayant utilisé des ordinateurs dans les années 1990 se rappellent peut-être très bien.

Parfois, au lieu d'un caractère, on voyait apparaître :

**□**

Un petit carré.

Pour quelqu'un qui a grandi avec des ordinateurs modernes, cela peut sembler étrange.

Mais ce carré signifie simplement :

> « Il y a un caractère ici, mais je n'ai pas la forme nécessaire pour le dessiner. »

La forme d'un caractère à l'intérieur d'une police s'appelle un **Glyphe** (Glyph).

---

## Qu'est-ce qu'un Glyphe ?

Une façon simple de penser à un Glyphe est :

**Le dessin d'un caractère.**

Par exemple, le caractère dit :

> « Ceci est la lettre A. »

Le Glyphe est la forme réelle que la police utilise pour dessiner la lettre A.

Des polices différentes ont des Glyphes différents.

C'est pourquoi la même lettre peut avoir une apparence complètement différente d'une police à l'autre.

Le Glyphe est essentiellement l'information dont l'ordinateur a besoin pour savoir **comment dessiner le caractère**.

---

## Pourquoi ne pas simplement transformer le texte en image ?

Parce qu'on perdrait alors l'un des avantages les plus importants du vrai texte.

Si on transforme le mot :

**Bonjour**

en image, l'ordinateur ne sait plus qu'il s'agit du mot « Bonjour ».

Il ne voit que des pixels.

En travaillant plutôt avec les Glyphes de la police, on peut préserver les formes réelles des caractères.

Le texte peut ainsi rester net, même agrandi ou imprimé.

Et plus important encore :

**nous n'avons pas besoin de compter sur le fait que l'ordinateur ou l'imprimante de destination possède exactement la même police.**

L'information nécessaire pour dessiner le texte peut faire partie du document lui-même.

---

## Et puis il y a l'hébreu

L'hébreu a déjà des exigences particulières.

Mais dès qu'on ajoute le **nikoud** (les signes vocaliques), les choses se compliquent encore.

Par exemple :

**שָׁלוֹם**

Les petits signes qui apparaissent au-dessus et en dessous des lettres ne sont pas de simples petites images.

Ils font partie du texte.

Le système doit savoir :

* Quel signe est présent.
* À quelle lettre il appartient.
* Où exactement il doit être placé.
* Comment il interagit avec la police.
* Ce qui se passe quand la police change.

C'est là que la bonne gestion des Glyphes et des polices devient particulièrement importante.

---

## Une police, c'est bien plus que des « dessins de lettres »

Une manière utile de voir une police est celle d'une grande collection de formes.

Elle contient les formes des lettres, des chiffres, de la ponctuation, et de nombreux autres caractères.

Quand on veut afficher du texte, il faut trouver la forme correcte pour chaque caractère et la placer au bon endroit.

Avec le nikoud hébreu, il y a encore plus de travail.

Les signes du nikoud doivent être positionnés par rapport aux lettres auxquelles ils appartiennent.

Il ne suffit donc pas de savoir :

> « Il y a un kamats ici. »

Il faut aussi savoir :

> « Où exactement ce kamats doit-il être placé par rapport à la lettre ? »

---

## L'extension du moteur PDF pour l'hébreu et le nikoud

Le moteur PDF que nous utilisons s'appelle **Folio**. C'est un projet open source à l'origine, sur lequel nous avons construit notre propre version, en l'étendant spécialement pour les besoins des documents en hébreu.

En particulier :

**le nikoud, les polices, le Font Fallback et les Glyphes.**

L'objectif n'est pas simplement que l'hébreu ait une belle apparence dans le navigateur.

L'objectif est que le texte reste précis et cohérent une fois la page transformée en PDF.

---

## Le résultat que nous voulons

En fin de compte, nous voulons ceci :

**Vous créez un PDF sur votre ordinateur**

↓

**Vous l'envoyez à quelqu'un d'autre**

↓

**Cette personne l'ouvre sur un autre ordinateur**

↓

**Elle l'imprime sur une autre imprimante**

Et le résultat reste identique.

Elle ne devrait pas avoir besoin d'installer la police d'origine.

Nous ne devrions pas avoir à compter sur ce qui se trouve, par hasard, sur son ordinateur.

Nous ne devrions pas avoir à transformer le texte en image.

Et le PDF ne devrait pas avoir besoin d'être créé sur un serveur distant.

---

## Tout assembler

L'idée peut se résumer ainsi :

### HTML

Le document que nous voulons transformer en PDF.

↓

### Moteur de mise en page

Calcule où chaque élément doit se trouver.

↓

### Web Fonts

Fournissent les polices dont le document a besoin.

↓

### Glyphes

Fournissent les formes précises des lettres et des caractères.

↓

### PDF

Enregistre le résultat comme un document autonome qui peut être ouvert et imprimé.

Et tout cela peut se produire :

**directement dans le navigateur, grâce à WebAssembly.**

---

## Alors, qu'est-ce qui rend vraiment cette approche spéciale ?

Il ne s'agit pas simplement de pouvoir « télécharger un PDF ».

Ce qui est intéressant, c'est **la façon dont** le PDF est créé.

Au lieu de photographier ce que le navigateur affiche, nous reconstruisons le document.

Au lieu de nous fier aux polices installées sur l'ordinateur, nous pouvons fournir l'information dont le document a besoin.

Au lieu de transformer le texte en image, nous travaillons avec les formes réelles des caractères.

Et au lieu d'envoyer le document à un serveur pour faire le travail, tout le processus peut se dérouler à l'intérieur du navigateur.

En ajoutant à cela une prise en charge correcte de l'hébreu et du nikoud, on obtient un résultat où :

> **Le PDF créé dans le navigateur reste un document réel, net et cohérent - de l'écran jusqu'à l'imprimante.**
