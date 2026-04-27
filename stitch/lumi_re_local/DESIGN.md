# Design System Strategy: The Curated Urbanist

## 1. Overview & Creative North Star
The vision for this design system is **"The Curated Urbanist."** 

Unlike traditional local service platforms that overwhelm users with dense grids and loud "sale" banners, this system treats city life as a curated editorial experience. We are moving away from the "utility-first" clutter of standard apps toward a "hospitality-first" digital environment. 

The aesthetic is defined by **Soft Minimalism**: a high-contrast typographic scale paired with a warm, sun-drenched palette. We break the rigid, boxed-in feel of mobile apps through intentional asymmetry, overlapping elements (typography bleeding over imagery), and a heavy reliance on tonal depth rather than structural lines. The goal is to make a food delivery or spa booking feel as premium as browsing a luxury lifestyle magazine.

---

## 2. Colors: The Chromatic Narrative
The color palette moves away from cold "tech" blues and whites into a sophisticated, warm spectrum of corals, terracottas, and creams.

*   **Primary (`#b02604`):** Our "Sanguine" signature. Use this sparingly for high-impact CTAs and critical brand moments.
*   **Surface & Background (`#fff4f3`):** This is not a "stark white" app. The warm background provides a tactile, paper-like quality that reduces eye strain and feels more "boutique."
*   **Tertiary (`#803f9e`):** A deep plum used for "Premium" or "VIP" service tiers to provide a sophisticated counterpoint to the warm primary tone.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Traditional dividers are a sign of lazy hierarchy. Instead, boundaries must be defined through:
1.  **Background Shifts:** Place a `surface-container-low` card on a `surface` background.
2.  **Negative Space:** Use the Spacing Scale to create "breathing rooms" that naturally separate concepts.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine stationery.
*   **Base:** `surface` (`#fff4f3`).
*   **Secondary Sections:** `surface-container-low` (`#ffedec`).
*   **Elevated Cards:** `surface-container-lowest` (`#ffffff`) to create a "pop" against the warm background.

### The Glass & Gradient Rule
To prevent the UI from feeling flat, use **Glassmorphism** for floating elements (like bottom navigation bars or sticky headers). Apply `surface` at 80% opacity with a 20px backdrop blur. 
**Signature Texture:** For primary CTAs, use a subtle linear gradient from `primary` (`#b02604`) to `primary-container` (`#ff7859`) at a 135-degree angle. This adds "soul" and a sense of light source that flat fills lack.

---

## 3. Typography: Editorial Authority
We use two distinct typefaces to create a sophisticated dialogue between "Impact" and "Utility."

*   **Display & Headlines (Plus Jakarta Sans):** A modern, geometric sans-serif with a premium weight. 
    *   Use `display-lg` (3.5rem) for hero titles, often with negative letter-spacing (-0.02em) to feel tighter and more "editorial."
    *   **The Overlap:** Encourage headlines to slightly overlap image containers to create a 3D, layered effect.
*   **Body & Labels (Manrope):** A high-performance sans-serif designed for legibility.
    *   Use `body-lg` (1rem) for descriptions with generous line-height (1.6) to maintain the minimalist feel.
    *   `label-md` should be used for secondary metadata, always in `on-surface-variant` (`#834c4d`) to reduce visual noise.

---

## 4. Elevation & Depth: Tonal Layering
We reject the heavy, "muddy" drop shadows of 2010s design. Depth in this system is achieved through light and tone.

*   **The Layering Principle:** Hierarchy is a stack. Place a `surface-container-lowest` element on top of a `surface-container` background. The subtle shift in hex code creates a natural lift.
*   **Ambient Shadows:** If a component must "float" (e.g., a floating action button), use a shadow with a 40px blur, 0px spread, and 6% opacity. The shadow color must be `on-surface` (`#4e2123`), never pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use `outline-variant` (`#df9c9c`) at 20% opacity. It should be felt, not seen.
*   **Roundedness:** We use a generous scale to evoke "Softness."
    *   **Standard Cards:** `DEFAULT` (1rem).
    *   **Imagery & Major Containers:** `lg` (2rem) or `xl` (3rem) to mimic high-end architectural curves.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `full`. Gradient fill (`primary` to `primary-container`). White text (`on-primary`). No shadow unless floating.
*   **Secondary:** `surface-container-highest` background with `primary` text. No border.
*   **Tertiary:** Transparent background, `primary` text, bold `label-md` styling.

### Cards & Discovery Modules
*   **The "No-Divider" Rule:** Cards must never use a separator line between header and body. Use a shift from `surface-container-lowest` to `surface-container-low` to distinguish the footer of a card.
*   **Image Treatment:** Every image should have a subtle `inner-shadow` or a 10% black overlay at the bottom to ensure `title-sm` white typography remains legible when placed directly on the image.

### Input Fields
*   **Style:** Minimalist. No bottom line or full box. Use `surface-container-low` as a subtle filled background with `xl` (3rem) corner radius.
*   **States:** On focus, the background shifts to `surface-container-highest` with a `primary` "Ghost Border" (20% opacity).

### Signature Component: The "Service Carousel"
Instead of a standard 4-column grid for services (Food, Hotel, etc.), use an asymmetrical carousel where the first item is 2x larger than the others, using a high-quality lifestyle photo as the background and `display-sm` typography.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a functional tool. If a screen feels "empty," it’s likely working.
*   **DO** use "True Imagery." Only use high-resolution photography with natural lighting. Avoid "stock-photo" smiles.
*   **DO** align text to a sophisticated editorial grid—don't be afraid of large left margins (e.g., 24px or 32px) to create a "gutter" feel.

### Don't:
*   **DON'T** use 1px dividers. If you feel the need for a line, increase the padding or change the background tone instead.
*   **DON'T** use pure black `#000000` for text. Use `on-surface` (`#4e2123`) to maintain the warm, premium vibe.
*   **DON'T** use tight corner radiuses. Anything less than `sm` (0.5rem) will feel too "technical" and break the "Curated Urbanist" softness.