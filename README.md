### TL;DR 

I forgot that chrome respects prefers-dark-theme and thought I had to enable the flag `chrome://flags/#extensions-on-chrome-urls` and make my own extension to not get flashbanged whenever I tried to look at my history. :facepalm:

So, I spent a couple days learning about css and shadow-roots, and in the process stumbled upon this [darkreader github issue](https://github.com/darkreader/darkreader/issues/2286) which lead to me discovering the [xraystyler](https://github.com/tophf/XRayStyler) repo.

And then I forked xraystyler, explicitly gave my fork permission to modify `chrome://*/*`, and spent way too much time messing around with css and shadow-roots to make a custom dark theme for myself.

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
