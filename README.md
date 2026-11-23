# HayGallery

A responsive photo gallery built with plain HTML, CSS and JavaScript. Visitors can filter photos by category and open any image in a full-screen lightbox. No frameworks and no build step.

Dark theme with wine accents.

## Features

- Category filters: All, Nature, Architecture and People
- Full-screen lightbox with previous and next controls
- Keyboard support: Tab to a photo, then Enter or Space to open it
- Lightbox shortcuts: `Esc` closes, `Left` and `Right` arrows navigate
- Swipe left and right in the lightbox on touch screens
- Focus is trapped inside the lightbox and returned to the photo when it closes
- Layout adapts from desktop to tablet to small phones
- Lazy-loaded images, with high-resolution versions loaded only in the lightbox
- Cards with a broken image path hide themselves instead of showing an empty box
- Respects the `prefers-reduced-motion` setting

## Project structure

```
HayGallery/
├── index.html
├── style.css
├── script.js
└── Images/
    ├── profile.jpg
    ├── poundz.jpg
    ├── cutie.jpg
    └── lumba.jpg
```

## Running locally

1. Download or clone the project.
2. Put your local photos in the `Images/` folder (see the names above).
3. Open `index.html` in a browser.

To use a local server instead, run one of these from the project folder:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve
```

Then visit `http://localhost:8000`.

## Customizing

### Change the colors

All colors are CSS variables at the top of `style.css`:

```css
:root {
    --secondary-color: #9e2f45;   /* wine, used for buttons and fills */
    --secondary-hover: #7d2236;   /* wine on hover */
    --accent-color: #e0677c;      /* lighter wine, used for small text */
    --background-color: #000000;
}
```

### Add a photo

Copy an existing `gallery-item` block in `index.html` and edit it. `data-category` must be `nature`, `architecture` or `people` to match the filter buttons.

```html
<div class="gallery-item" data-category="nature">
    <img
        src="Images/my-photo.jpg"
        alt="Describe the photo"
        loading="lazy"
    >
    <div class="image-overlay">
        <h3>Photo Title</h3>
        <p>Nature</p>
    </div>
</div>
```

For a remote image, add a `data-full` attribute with a larger version. The lightbox uses it when present and falls back to `src` otherwise.

### Add a category

1. Add a button in `index.html` with a new `data-filter` value.
2. Use the same value in `data-category` on the matching photos.

No JavaScript changes are needed.

## Image notes

- Use forward slashes and avoid spaces in file names (`Images/cole-palmer.jpg`, not `Images\Cole Palmer.jpg`). Backslashes and spaces break on most web hosts.
- Match the folder and file name casing exactly. Hosts such as GitHub Pages and Netlify are case-sensitive.
- Compress large photos before adding them. Images from a phone camera can be several megabytes each.
- Only publish photos you own or have permission to use. This applies especially to photos of real people.
- Nature and architecture photos are loaded from [Unsplash](https://unsplash.com). Confirm each link still works.

## Deploying

The site is static, so any static host works. GitHub Pages, Netlify and Vercel all work with no configuration. Upload the whole folder with `index.html` at the root.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari. The layout uses CSS Grid, `inset` and `backdrop-filter`.
