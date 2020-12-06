[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Use component library

You may publish your component library to NPM repository. If you prefer to use/test your component library locally in a client app, you may use `npm link` or [install-local](https://github.com/nicojs/node-install-local).

If your app is not using a bundler, the following is the example of how to use the library in vanilla HTML page. Note that it loads the global and component level CSS, as well as externalized third-party library Moment.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Demo app</title>
    <link rel="stylesheet" href="assets/main.css" />
    <link rel="stylesheet" href="dist/homp.css" />
  </head>
  <body>
    <div id="app">
      <p>Component A: <component-a /></p>
      <p>Component B: <component-b @click="onClick" /></p>
    </div>
  </body>

  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/moment"></script>
  <script src="dist/homp.umd.js"></script>
  <script>
    console.log(window["homp"]);
    var app = new Vue({
      el: "#app",
      methods: {
        onClick(message) {
          alert(message);
        },
      },
    });
  </script>
</html>
```

OR

```
// main.js
import * as homp from "@hezhi/homp";
import "@hezhi/homp/dist/homp.css";

Vue.use(homp);

// in your component
<h-3-d-carousel :images="images" :videos="videos" />
```

### TODO

- [x] 1. OCR 组件
- [ ] 2. 网络拓扑组件
- [ ] 3. 地图组件
- [x] 4. 视频物体识别组件
- [ ] 5. 人脸识别、动作活体组件
