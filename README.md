# 11ty-starter
Starter template for 11ty projects, with Sass support, JS bundling with modern/legacy builds, PWA checklist items, and localization patterns. A major goal of this project is prioritizing convention over configuration so you can get started writing the code that matters as quickly as possible without futzing over .config files. As such, it is opinionated, and your mileage may vary.

The goal of this project is to fill in the gap between developer experience and user experience. The major JS frameworks all have fancy starter templates that make it easy to get started building in React, Vue, or Angular. Too easy. These tools all have a place, but it's overkill for a simple blog, and the tendency to reach for highly engineered, well-vetted, solve-every-problem-that-could-exist solutions is precisely why the amount of JavaScript being sent over the wire these days keeps ballooning. That will probably get worse as 5G comes into play. The more we can justify adding JavaScript, the more we'll do it, and the more the average user will suffer for it.

This project is JAMStack to the core, and it believes that rendering markup should be left to HTML, and styling that markup should be left to CSS. JS should be sprinkled in as needed - the last tool you reach for in the box, should you need it. Whenever possible, write less code.

## Getting Started
Clone this project, `npm install`, then `npm run dev` to run the application in development mode with watchers on Sass, JS, and templates picked up by 11ty.

`npm run build` generates a minified, production-ready version of the site, with both modern and legacy builds for JS files.

### 11ty
This starter template uses 11ty as its static site generator, but it intentionally ignores front-matter, instead opting for nunjucks style layout inheritance. This may or may not work for your needs. The goal is to have a layout with defaults that can be overridden by individual pages for things like title, description, styles, and scripts.

```html
<!-- _includes/layouts/default.njk -->
{% block title %}
  <title>11ty Starter</title>
{% endblock %}
```

```html
<!-- index.njk -->
{% block title %}
  <title>Home Page</title>
{% endblock %}
```

```html
<!-- final output, index.html -->
<title>Home Page</title>
```

### Sass/SCSS Support
Sass should work out of the box, following the convention that the only entrypoint is `styles/styles.scss`. If you need multiple entrypoints, you may need to tweak the npm scripts that include 'styles' in their names. (You probably don't need multiple entrypoints if you keep your CSS small and take advantage of the cascade, though.)

### Dark Mode
The stock CSS includes basic dark mode support using CSS custom properties, but another aspect worth noting is the favicon. A light mode icon and a dark mode icon are both included, along with a small inline script that changes the favicon accordingly. If your favicon doesn't need a dark mode version, you can delete that script. Otherwise, make sure the file names are updated there as well as in the `<link rel="shortcut icon" ...>` tag.

### JS Bundling, Minification, and Transpiling
These were my goals for the ideal JS setup:
1. Must favor convention over configuration (i.e. adding a new entrypoint doesn't require any additional config)
2. Must be able to write modern code (ES6 imports, arrow functions, etc.)
3. Must produce a legacy build for older browsers (mainly IE11), and a modern build for newer browsers (both minified)

Rollup works quite well for Point 1. By using the file system to loop through scripts, new entrypoints are automatically picked up and dropped into the output folder by convention. Any `.js` file in the scripts folder (but not subfolders) is treated as an entrypoint and is bundled and dropped into `_site/scripts/bundled`. Combine that with tree-shaking and smaller, more readable bundles compared to webpack, and it's pretty well suited for basic needs.

That would be good enough for most modern browsers, but if you need to support IE11 or you have a more global audience, Babel is included to handle Points 2 and 3. It runs only on production builds, after Rollup has bundled the files. The output from that is put into `_site/scripts/legacy`, following the same naming conventions. To handle serving the right files to the right browsers, follow this pattern:

```html
<script src="/scripts/bundled/home.js" type="module"></script>
<script src="/scripts/legacy/home.js" nomodule></script>
```

No polyfills are included out of the box, so be sure to provide them if needed for older browsers.

Optionally, you can choose not to serve bundled code to modern browsers. To do this, use `.mjs` instead of `.js` for your file extensions, and reference `/scripts/[filename].mjs` instead of the bundled file's path. This is really only a good option over HTTP/2, and even so, it may still be more performant to serve the bundled script. If you use dynamic imports to handle code-splitting, this may also work out better, but you should definitely test both scenarios and see which is best for your use case.

### PWA Support
It's mostly icons and setting the right meta tags. Be sure to change those as applicable for your project. A basic service worker is provided, and should cover general cases pretty well, but it will most likely require customization depending on your needs.

### Localization
There are multiple approaches that can work with this setup. One is to write bespoke pages for each language that is supported, which might work just fine for a blog-type site, but is less ideal for something more interactive. To do that, you would just create your duplicate page under the appropriate subfolder ("es" or "fr" in the base example).

For an approach with less duplication, you can take advantage of 11ty's global and local data conventions. In the `_data` folder, you can use the `site.js` and `locale.json` files to set the default language and define strings to be used for each language. For example:

```js
// _data/locale.json
"en"

// _data/site.js
module.exports = {
  en: {
    projectName: '11ty Starter',
    home: 'Home',
    h2Label: 'This is an h2 tag.',
    favoriteColor(color) {
      return `${color.charAt(0).toUpperCase() + color.slice(1)} is my favorite color.`;
    },
  },
  es: {
    projectName: '11ty Proyecto de Inicio',
    home: 'Casa',
    h2Label: 'Esta es una etiqueta h2.',
    favoriteColor(color) {
      return `Prefiero el color ${color}.`;
    },
  },
  fr: {
    projectName: '11ty Projet de démarrage',
    home: 'Domicile',
    h2Label: 'Ceci est une balise h2.',
    favoriteColor(color) {
      return `Ma couleur préférée est ${color}.`;
    },
  },
};
```

Note that you can use simple strings or define functions that return a result. This can be useful for other internationalization requirements, such as formatting numbers or dates.

In each language's folder, you can add a `[lang].json` file that specifies the locale. For example:

```js
// es/es.json
{
  "locale": "es"
}
```

This will set the `locale` variable, accessible in your templates, allowing you to access the appropriate values for your locale.

```html
<!-- es/index.njk -->
<title>{{ site[locale].home }} | {{ site[locale].projectName }}</title>

<!-- output: es/index.html -->
<title>Casa | 11ty Proyecto de Inicio</title>
```

To further reduce duplication, I recommend using an `_includes/pages` folder to set up your pages, and then simply including the page for each language you support.

```html
<!-- _includes/pages/home.njk -->
{% extends 'layouts/default.njk' %}

{% block title %}
  <title>{{ site[locale].home }} | {{ site[locale].projectName }}</title>
{% endblock %}

{% block content %}
  <div class="stack">
    <h2>{{ site[locale].h2Label }}</h2>
    <h3>{{ site[locale].favoriteColor('blue') }}</h3>
    <h4>This is an h4 tag.</h4>
    <h5>This is an h5 tag.</h5>
    <h6>This is an h6 tag.</h6>
    <p>This is a p tag.</p>
  </div>
{% endblock %}

{% block scripts %}
  <script src="/scripts/home.js" type="module"></script>
  <script src="/scripts/legacy/home.js" nomodule></script>
{% endblock %}
```

```html
<!-- index.njk, es/index.njk, fr/index.njk -->
{% include 'pages/home.njk' %}
```
