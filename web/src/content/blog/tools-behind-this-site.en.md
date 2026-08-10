---
title: "The Tools Behind This Website - Explained Simply"
date: '2026-08-10'
excerpt: "What quietly powers this site - the open-source stack, the Hebrew fonts, and the choice to do all the work in your browser so your sheet never leaves your device."
---

People often ask what quietly runs a site like this - so this is our answer, in plain language, from the workshop where it is built.

No technical knowledge is needed to read it. Every term is explained the first time it appears.

---

## The Short Version

If you only remember one thing, remember this:

> **The whole website runs in your own browser, on your own device. There is no server collecting your information, no tracking, and no hidden data collection.**

In short:

- The website is built with free, open-source tools.
- The memorial sheet you create is turned into a PDF **on your own computer** - it is never sent anywhere to be processed.
- The Hebrew fonts come from the **Open Siddur Project** (opensiddur.org/help/fonts), a free collection of Hebrew fonts made for prayer and study texts. We prepare them with our own in-house conversion tools.
- Even though we are based in Israel - where the European privacy law (GDPR) does not apply - we built the website to be friendly to everyone's privacy, and to respect the same principles everywhere.

---

## What the Website Is Made Of

A website is a collection of files that your browser reads and shows to you. Our website is made of the following main parts.

### The Page Itself - React

The interactive page you see - the wizard, the preview, the buttons - is built with a free, open-source tool called **React**.

Think of React as the stage manager: it decides what to show, when to show it, and how it reacts when you click or type.

### The Preparer - Vite

Before a website can be shown, its files must be prepared, organized, and optimized.

The tool that does this is called **Vite**. It is also the tool we use while developing: when we change something, the change appears in our browser immediately.

### The Styling - Tailwind

The look of the website - colors, spacing, sizes, the careful arrangement of the memorial sheet - is styled with a tool called **Tailwind**.

### The Languages - i18next

The website is available in **Hebrew, English, French, and Spanish**.

The system that manages the translations is called **i18next** (the "i18n" is short for "internationalization"). Hebrew is shown from right to left, as it should be.

### Installable and Offline - PWA

The website can be "installed" on your phone or computer, like a small app, and it can work even without an internet connection.

This is made possible by a technology called **PWA** (Progressive Web App). Once you have visited the website, it quietly saves itself on your device so it is there when you need it.

---

## The Fonts - Hebrew Letters Done Right

Hebrew prayer and memorial texts have special needs:

- The **vowel marks** (nikud) above and below the letters.
- The **cantillation marks** (ta'amim) used in Biblical reading.
- Letters that must look beautiful at every size, on screen and on paper.

Ordinary computer fonts often fail at this.

### Where the Fonts Come From

The fonts we use come from the **Open Siddur Project** - a free, open-source collection of Hebrew fonts designed specifically for prayer, liturgy, and study (opensiddur.org/help/fonts).

The project's fonts are free to use under open licenses (mostly the SIL Open Font License), which means anyone can use them without paying.

### Preparing the Fonts - Our Own In-House Tools

The fonts do not arrive ready to use. They must be checked, converted, and arranged before they can be placed on the website.

For this we use our own in-house preparation tools, built around two well-known open-source utilities: **FontForge** and **FontTools** (the "Swiss Army knives" of font work).

This happens **before** the website goes online, in our own workshop. The website itself never downloads fonts from any outside service - they are stored on our own server.

### The Result

The website offers **22 Hebrew font families** for the memorial sheet - from the traditional styles used in printed siddurim, to clear modern fonts, to a special font for people with reading difficulties.

---

## The PDF Engine - Folio

Creating the PDF is the most interesting part.

### The Common Way: A Server Does the Work

The usual way to create a PDF on a website is to send the document to another computer - a **server** - which creates the PDF and sends it back.

This has two problems:

1. **Privacy** - your document leaves your device.
2. **Cost** - when many people create PDFs, the server must do a lot of work.

### Our Way: Your Own Device Does the Work

We do it differently. The PDF is created **inside your own browser, on your own device**.

This is possible thanks to a technology called **WebAssembly** (Wasm) - a way for browsers to run complex software quickly, right inside the page.

We wrote our own PDF engine in a programming language called **Go**, and then compiled it into a file your browser can run: a WebAssembly module of about 20 MB that we ship together with the website.

The engine is called **Folio**. It started as an open-source project, and we built our own version of it, extending it especially for the needs of Hebrew documents: right-to-left text, vowel marks (nikud), and accurate fonts in the final PDF.

So when you press "Download PDF":

> **Your device → Your browser → PDF is created → The PDF is on your device.**

Nothing is sent to any server. The document never leaves your computer.

### Why Bother?

Because we care that the result is **beautiful and accurate** - the way the sheet looks on your screen should be exactly the way it looks on paper, even with Hebrew, even with nikud, even on a printer that has never heard of our fonts.

---

## Privacy - What Happens to Your Information

This is important, so let's be very clear.

### What We Do NOT Have

The website has:

- **No server** collecting your information.
- **No database** storing your sheets.
- **No account** you must create.
- **No tracking** of your visits.
- **No cookies** watching you.
- **No advertising**, and no selling of data.

The memorial details you type - the name, the date, the settings - are never sent anywhere. They live only in your own browser, in the web address of the page, and disappear when you close the tab.

### The Two Small Exceptions

To be completely honest, there are two small moments where your device talks to the outside world:

1. **Paper size** - when you enter the wizard for the first time, the website makes a single, brief request to a free public service to guess which paper size is common in your country (Letter or A4). Only your device's approximate location (country) is involved, and if the request fails, the website simply chooses A4.

2. **Contact form** - on the "About" page there is a contact form. If you use it, it sends only the message and email address that **you** typed. Nothing else.

That's all. Everything else - the fonts, the texts, the PDF engine - is loaded from our own website and processed on your device.

### GDPR - Why We Care Even Though We Don't Have To

The European privacy law, **GDPR**, applies to organizations in the European Union. We are in Israel, so the law does not apply to us.

But privacy is not something you do because a law says so. We built the website so that even a strict European auditor would find nothing to complain about:

> **Minimal data. Local processing. No tracking. Full transparency.**

That is how we like to do things - be friendly with everyone, and respect everyone's rules, wherever they live.

---

## What Happens Where - a Simple Map

Here is the whole journey of a memorial sheet:

**You type the details** (in the wizard)
↓
**The sheet is arranged** (in your browser)
↓
**The fonts are embedded** (from our own server, into the document)
↓
**The PDF is created** (by Folio, inside your browser, on your device)
↓
**You download it** (the file never went anywhere else)

---

## The Workshop - the Tools We Use to Build the Website

For those who are curious, here is the "workbench" we use to build and check the website. All of it is free and open-source:

- **Go** - the programming language in which the PDF engine is written.
- **Node.js** - the tool that runs the preparation scripts, including the font tools.
- **FontForge & FontTools** - our in-house font preparation tools (checking, converting, and organizing the Hebrew fonts).
- **TypeScript** - a careful version of JavaScript, the language of browsers; it helps us catch mistakes before the website goes online.
- **Playwright** - a robot that opens the website automatically and tests it, page by page, in real browsers, on every change.
- **Lighthouse & axe** - automatic inspectors that check the quality of the website: speed, accessibility for people with disabilities, and good practices.
- **GitHub** - where we keep and manage the website's source code, visible to everyone.

---

## In One Sentence

We built a website with free, open-source tools, where everything happens on your own device: your memorial sheet is created, styled with beautiful free Hebrew fonts, and turned into a PDF - all in your browser, all privately, with no server, no tracking, and no data collection.

If you have any question about anything on this page, please use the contact form on the About page - we are happy to answer.
