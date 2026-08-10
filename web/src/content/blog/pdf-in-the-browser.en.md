---
title: "How Can a PDF Be Created Directly in the Browser?"
date: '2026-08-10'
excerpt: "Every memorial sheet becomes a PDF - but the interesting part is how. No server, no screenshots: a real layout engine compiled to WebAssembly rebuilds the document right in your browser, Hebrew vowels and all."
---

Creating a PDF sounds simple.

We have a document on a web page, and we want to turn it into a PDF that we can save, send, and print.

But once we want the result to be **accurate and consistent**, especially with Hebrew and Hebrew diacritics (Nikud), things become much more interesting.

---

## Instead of Sending the Document to a Server

The common way to create a PDF is for a website to send the document to a **server**.

A server is simply another computer that performs work for the website.

The process might look something like this:

**Your computer → Website → Server → Create PDF → Back to your computer**

This works, but it means that another computer has to do the work.

If 1,000 users are creating PDFs, the server has to handle 1,000 PDF-generation jobs.

There is another approach:

**Let the user's own computer/device do the work.**

Then the process becomes:

**Your computer → Browser → Create PDF**

The document doesn't need to be sent somewhere else just to turn it into a PDF.

---

## How Can a Browser Do That?

This is where a technology called **WebAssembly**, or **Wasm**, comes in.

Without getting too technical, WebAssembly is a way to run software inside the browser that can perform complex operations very efficiently.

Instead of the browser only displaying a website, it can also run an entire engine responsible for creating a PDF.

This makes the idea particularly interesting:

> **The PDF can be created directly inside the browser, on the user's own computer.**

The work doesn't have to go through a server.

---

## But Creating a PDF Isn't Just Taking a Screenshot

Here is one of the most important challenges.

It is tempting to think:

> "I already have the page on the screen. Just save what I see as a PDF."

But that's not what we want.

If we simply turn the screen into an image, we get a **picture of the document**, not a real document.

The text is no longer really text.

It is just pixels.

And when we enlarge it or print it, we are limited by the quality of that image.

So we need another approach.

---

## The Browser Has to Rebuild the Document

A web page contains many things:

text, headings, images, tables, spacing, margins, and more.

The browser has to decide where everything belongs.

It needs to know:

* Where a line of text starts.
* When the text needs to move to the next line.
* Where an image should go.
* How much space the text takes.
* Where one page ends and another begins.
* How different elements are positioned relative to each other.

This process is called **layout**.

And the software responsible for making these decisions is called a **Layout Engine**.

---

## What Does a Layout Engine Do?

Instead of taking a picture of the page, a layout engine looks at **what the document says it should look like**.

For example:

> The heading goes here.
> The text goes underneath it.
> The image goes on the side.
> This line is too long, so part of it needs to move to the next line.

The engine then calculates all of those positions.

This is what we need when creating a PDF.

Not a picture of the page.

**A rebuilt document.**

---

## What About Fonts?

Now we have another problem.

Suppose the document uses a particular font.

If that font exists on the computer, everything is fine.

But what happens if it doesn't?

The browser can use another font instead.

This is called **Font Fallback**.

In simple terms:

> "The font you asked for isn't available, so I'll try another one."

That's usually a good thing for a website.

If a particular font is missing, it is much better to display the page using another font than to show missing characters.

But when creating a PDF that should look **exactly the same everywhere**, this can become a problem.

---

## What Is a Web Font?

A website can bring the font it needs with it.

A font that is provided by the website is called a **Web Font**.

Instead of telling the computer:

> "Use a font that is already installed on your computer."

The website can say:

> "Here is the font I want you to use."

This gives the website much more control over how its text looks.

But we still need to make sure that the final PDF does not depend on whatever happens to be installed on the computer where the PDF is opened or printed.

---

## What Happens When a Character Is Missing?

This brings us to something that people who used computers in the 1990s might remember very well.

Sometimes, instead of a character, you would see:

**□**

A little square.

For someone who grew up with modern computers, this might seem strange.

But that square simply means:

> "There is a character here, but I don't have the shape I need to draw it."

The shape of a character inside a font is called a **Glyph**.

---

## What Is a Glyph?

A simple way to think about a Glyph is:

**The drawing of a character.**

For example, the character says:

> "This is the letter A."

The Glyph is the actual shape that the font uses to draw the letter A.

Different fonts have different Glyphs.

That's why the same letter can look very different in different fonts.

The Glyph is essentially the information the computer needs to know **how to draw the character**.

---

## Why Not Just Turn the Text Into an Image?

Because then we lose one of the most important advantages of real text.

If we turn the word:

**Hello**

into an image, the computer no longer knows that it is the word "Hello."

It only sees pixels.

When working with the font's Glyphs instead, we can preserve the actual shapes of the characters.

This allows the text to remain sharp when enlarged or printed.

And more importantly:

**we don't have to rely on the destination computer or printer having exactly the same font installed.**

The information needed to draw the text can be part of the document itself.

---

## And Then There Is Hebrew

Hebrew already has some special requirements.

But once we add **Nikud**, things become even more complicated.

For example:

**שָׁלוֹם**

The small marks above and below the letters are not simply little pictures.

They are part of the text.

The system needs to know:

* Which mark is present.
* Which letter it belongs to.
* Exactly where it should be placed.
* How it interacts with the font.
* What happens when the font changes.

This is where properly handling Glyphs and fonts becomes especially important.

---

## A Font Is More Than Just "Pictures of Letters"

A useful way to think about a font is as a large collection of shapes.

It contains the shapes for letters, numbers, punctuation, and many other characters.

When we want to display text, we need to find the correct shape for every character and place it in the correct position.

With Hebrew Nikud, there is even more work involved.

The Nikud marks need to be positioned relative to the letters they belong to.

So it isn't enough to know:

> "There is a Kamatz here."

We also need to know:

> "Where exactly should this Kamatz be placed relative to the letter?"

---

## Extending the PDF Engine for Hebrew and Nikud

In the implementation I use, I extended the PDF engine to better handle the needs of Hebrew documents.

Especially:

**Nikud, fonts, Font Fallback, and Glyphs.**

The goal isn't simply to make Hebrew look good in the browser.

The goal is for the text to remain accurate and consistent when the page becomes a PDF.

---

## The Result We Want

Ultimately, we want this:

**I create a PDF on my computer**

↓

**I send it to someone else**

↓

**They open it on another computer**

↓

**They print it on another printer**

And the result is still the same.

They shouldn't need to install the original font.

We shouldn't have to rely on whatever happens to be installed on their computer.

We shouldn't have to turn the text into an image.

And the PDF shouldn't need to be created on a remote server.

---

## Putting It All Together

The whole idea can be simplified like this:

### HTML

The document we want to turn into a PDF.

↓

### Layout Engine

Calculates where everything belongs.

↓

### Web Fonts

Provide the fonts the document needs.

↓

### Glyphs

Provide the precise shapes of the letters and characters.

↓

### PDF

Stores the result as a document that can be opened and printed.

And all of this can happen:

**Directly inside the browser using WebAssembly.**

---

## So What Is Actually Special About This Approach?

It isn't simply the ability to "download a PDF."

The interesting part is **how the PDF is created**.

Instead of taking a picture of what the browser displays, we rebuild the document.

Instead of relying on fonts installed on the computer, we can provide the information the document needs.

Instead of turning text into an image, we work with the actual shapes of the characters.

And instead of sending the document to a server to do the work, the entire process can happen inside the browser.

When you add proper support for Hebrew and Nikud, the result can be a document where:

> **The PDF created in the browser remains a real, sharp, consistent document - from the screen all the way to the printer.**
