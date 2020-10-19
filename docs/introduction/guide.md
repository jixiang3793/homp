# Quick Started

A short guide to help user get started in using the library.

You may also describe the features or design of the library briefly.

## Install

If you are using module bundlers such as Webpack, you can directly include package into your project via:

NPM:

```bash
$ npm install homp --save
```

or Yarn:

```bash
$ yarn add homp
```

Then register `homp` components and directives all at once in your app's entry:

```js
// main.js
import Vue from "vue";
import * as mylib from "homp";

Vue.use(mylib);
```

## i18n

How to configure the library to use different language.
