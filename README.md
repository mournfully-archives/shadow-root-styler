### TL;DR 

I wanted full dark mode coverage in my (chrome) browser. So, I did all the basic things like getting `DarkReader`, but I soon realized that it wasn't perfect. It would at times mess up a websites colours. More importantly it wasn't able to affect chrome's protected sites (`chrome://*/*`).

So, I found the flag `chrome://flags/#extensions-on-chrome-urls` and went about trying to get an extension to inject dark mode css for me. I tried quite a few extensions which either continued to refuse to affect chrome urls or weren't able to inject css into some elements.

And during that time I learnt about `shadow roots` and managed to stumble upon a [darkreader github issue](https://github.com/darkreader/darkreader/issues/2286) which pointed me towards a proof of concept extension that could affect them called [xraystyler](https://github.com/tophf/XRayStyler).

I then forked that repo, and played with it before giving my fork explicit permission to modify a few `chrome://*/*` urls. And spent way too much time learning about `css`, inspecting the code of `chrome://*/*` sites to try and get a custom dark theme made.

Which was when I remembered that I had seen `chrome://*/*` sites in dark mode before. And realizing that I could've just started chrome with the flag `prefers-dark-theme`. Although, the webstore still holds out as one of the last few places I don't have dark mode yet. Nevertheless, I basically wasted a week of my life.

### Requirements

Chrome 73 or newer.

### How it works

Applies custom CSS to pages built with ShadowDOM (usually based on Polymer and other Web Components frameworks) that cannot be styled anymore in modern Chrome as it [removed Shadow-piercing support from stylesheets](https://www.chromestatus.com/features#deep).

The extension's `content script` adds a `page script` that runs in the page context and intercepts the built-in `attachShadow` and `adoptedStyleSheets` (see [Constructable Stylesheets: seamless reusable styles](https://developers.google.com/web/updates/2019/02/constructable-stylesheets)), the latter helps propagate the preparsed custom user CSS to every shadow root without re-evaluating it. In browsers without this API we would incur a performance penalty for creating a copy of stylesheet element that needs re-parsing inside each shadow (and there could be hundreds on a page), which is why such an extension didn't exist in the past.

The individual shadow roots are targeted using `@shadow` AT-rule:

```css
@shadow * {
  a:visited {
    color: #a88cff;
  }
}
@shadow mr-dropdown.project-selector,
        mr-dropdown[icon="settings"],
        mr-dropdown[\.icon="arrow_drop_down"],
        #searchq ~ mr-dropdown,
        mr-search-bar {
  i.material-icons:not(#\0) {
    color: #6eadd4 !important;
  }
}
```
