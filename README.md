[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/marionettejs/marionette.inspector?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Marionette Inspector

![](http://f.cl.ly/items/0c2j1N123b3w2E2g1n3d/Image%202014-10-25%20at%2011.54.48%20AM.png)

### Download it now!
[Chrome Web Store](https://chrome.google.com/webstore/detail/marionette-inspector/fbgfjlockdhidoaempmjcddibjklhpka?hl=en)

### A tool for good

The Inspector complements the console, elements, and sources tab as a trusty companion as you build out your Marionette Apps.

You can use the Inspector to see what's going on under the hood with your **ui**, **data**, **messages**, and **network**.


Of course, there's also a helpful :mag: as well.

### Watch the video

[![screen shot 2014-12-18 at 10 31 32 pm](https://cloud.githubusercontent.com/assets/952783/5499855/ad455b4e-8705-11e4-86cb-fd47868e0cc8.png)](https://www.youtube.com/watch?v=jbGm3mJXh_s)

---
### Getting Started

The inspector should work out of the box with most setups.

##### Using webpack
If you're using [webpack](http://webpack.github.io/) you have to expose the modules Backbone and Marionette to the global context (so they are available in `window`):

1. Install [expose loader for webpack](https://github.com/webpack/expose-loader)

```sh
npm install expose-loader
```

2. Change your `require` calls to

```js
require('expose?Backbone!backbone');
```

and

```js
require('expose?Marionette!marionette');
```



##### Misc
If you're not setting Backbone and Marionette on the window or using `define`, you'll need to start the inspector manually.

Add this line before your Marionette Application is instantiated.
```js
window.__agent &&  window.__agent.start(Backbone, Marionette);
```

---
### Developing Locally
[Install Guide](docs/developing_locally.md)


---
### Special Thanks

**Etsy** - The Inspector has largely been built as an open-source project at Etsy.

**Backbone-Debugger** - The Inspector is built on top of the [Backbone Debugger](https://github.com/Maluen/Backbone-Debugger) core, written in large part by @Maluen.
