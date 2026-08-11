---
title: "What's Behind This Website - Explained Simply"
date: '2026-08-10'
excerpt: "What quietly runs this site - why it's built with free tools, how the Hebrew fonts are prepared, and why the work happens on your device, not ours"
---

People often ask what quietly runs a site like this - so here is the answer, in plain language, with no technical jargon.

---

## The Short Version

If you only remember one thing, remember this:

> **The whole website runs on your own device. There is no server collecting your information, no tracking, and no hidden data collection.**

In short:

- The website is built with free, open-source tools.
- The memorial sheet you create is turned into a PDF **on your own device** - it is never sent anywhere to be processed.
- The Hebrew fonts come from the Open Siddur Project (opensiddur.org/help/fonts), a free collection of fonts made for prayer and study texts. We check and adjust them ourselves before they go on the site.
- Even though we are based in Israel, where the European privacy law (GDPR) does not apply to us - we built the website to respect the same privacy principles everywhere.

---

## What the Website Is Made Of

A website is really just a collection of files that your browser reads and shows you. Here are the main parts our website is made of, without much jargon.

### The Page You See

The wizard, the preview, the buttons - everything you see and click on is built with free, open-source tools, so the page reacts to you instantly: when you type or click, the change appears on screen right away, without reloading the page.

### The Look

The colors, spacing, and careful layout of the memorial sheet were designed with care, so the page looks clean and orderly - both on screen and on paper, after printing.

### The Languages

The website is available in **Hebrew, English, French, and Spanish**. Hebrew is shown right-to-left, as it should be.

### Installable and Works Offline

You can "install" the website on your phone or computer, like a small app, and it can work even without an internet connection. After you've visited the site once, it quietly saves itself on your device, so it's there even when there's no network.

---

## The Fonts - Hebrew Letters Done Right

Hebrew is the language of Jewish sacred texts, and it has unique features - vowel marks (nikud) and cantillation marks (ta'amim) - that a font has to know how to display correctly:

- The **vowel marks** above and below the letters.
- The **cantillation marks** used in Biblical reading.
- Letters that must look beautiful at every size, on screen and on paper.

Ordinary fonts often fail at this.

### Where the Fonts Come From

The fonts we use come from the **Open Siddur Project** - a free, open collection of Hebrew fonts designed specifically for prayer, liturgy, and study (opensiddur.org/help/fonts). The project's fonts are free to use under open licenses (mostly the SIL Open Font License), meaning anyone can use them without paying.

### Preparing the Fonts

The fonts don't arrive ready to use. We process them ourselves in advance - for example, making sure every letter and every vowel mark has exactly the right shape, including its bold version. That way, when the PDF is created, the exact right letter is used - no guessing, no falling back to a shape that doesn't quite fit.

This processing happens **before** the website goes online, in our own workshop. These finished fonts are what get sent to you along with the rest of the site's files - the website doesn't download fonts from any outside service while you're using it.

### The Result

The website offers **22 Hebrew font families** for the memorial sheet - from the traditional styles of printed prayer books, through clear modern fonts, to a special font for people with reading difficulties.

---

## How the PDF Is Created

Creating the PDF is the most interesting part.

### The Usual Way: A Server Does the Work

The usual way to create a PDF on a website is to send the document to another computer - a **server** - which creates the PDF and sends it back. This has two problems:

1. **Privacy** - your document leaves your device.
2. **Cost** - when many people create PDFs, the server has to do a lot of work.

### Our Way: Your Own Device Does the Work

We do it differently. The PDF is created **inside your own browser, on your own device**, thanks to a technology built into modern browsers that lets them run complex software quickly, without reaching out to the network.

We wrote our own PDF engine ourselves, and prepare it so your browser can run it directly - a file of about 20 megabytes, which we send along with the rest of the site.

The engine is called **Folio**. It started as an open project, and we built our own version on top of it, extending it especially for the needs of Hebrew documents: right-to-left text, vowel marks (nikud), and accurate fonts in the final PDF.

So when you press "Download PDF":

> **Your device → Your browser → The PDF is created → The PDF is saved on your device.**

Nothing is sent to any server. The document never leaves your computer.

### Why We Bother

Because it matters to us that the result is **beautiful and accurate** - what you see on screen should be exactly what appears on paper, even in Hebrew, even with nikud, even on a printer that has never encountered our fonts before.

---

## Privacy - What Happens to Your Information

This is important, so let's be very clear.

### What We Don't Have

The website has:

- **No server** collecting your information.
- **No database** storing your sheets.
- **No account** you have to create.
- **No tracking** of your visits.
- **No cookies** watching you.
- **No selling of data** to outside parties.

The memorial details you type - the name, the date, the settings - are never sent anywhere. They live only in your own browser, and disappear when you close the tab.

### The Two Small Exceptions

To be completely honest, there are two small moments when your device talks to the outside world:

1. **Paper size** - the moment you enter the wizard, the website makes a single, brief request to a free public service to guess the common paper size in your country (Letter or A4), based on your IP address. Only your approximate location (country) is involved, and if the request fails, the website simply chooses A4. This choice is shown, and you can change it, in the last step of the wizard, alongside the sheet's other formatting settings.

2. **Contact form** - the "About" page has a contact form. If you use it, the message and email address **you** typed pass through a trusted external service that delivers them to us by email. Nothing else is sent.

That's all. Everything else - the fonts, the texts, the PDF creation - loads from our own website and is processed on your device.

### GDPR - Why We Care Even Though We Don't Have To

The European privacy law, **GDPR**, applies to organizations in the European Union. We are in Israel, so the law doesn't formally apply to us.

But privacy isn't something you do only because a law says so. We built the website so that even a strict European auditor would find nothing to object to:

> **Minimal data. Processing on your own device. No tracking. Full transparency.**

That's how we like to work - being friendly to everyone, and respecting everyone's privacy, wherever they live.

---

## What Happens Where - a Simple Map

Here is the full journey of a memorial sheet:

**You type the details** (in the wizard)
↓
**The sheet is arranged** (in your browser)
↓
**The fonts are embedded** (from the site's own files, into the document)
↓
**The PDF is created** (inside your browser, on your device)
↓
**You download it** (the file never went anywhere else)

---

## For the Curious

We check the website regularly - its speed, its accessibility for people with disabilities, and its correctness - to keep the quality high.

---

## In One Sentence

We built a website with free, open-source tools, where everything happens on your own device: your memorial sheet is created, styled with beautiful free Hebrew fonts, and turned into a PDF - all in your browser, all privately, with no server, no tracking, and no data collection.

If you have a question about anything on this page, we're happy to answer - through the contact form on the About page.
