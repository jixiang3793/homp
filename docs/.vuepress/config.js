const { resolve } = require("path");

module.exports = {
  base: "/",
  title: "hezhi vue",
  description: "Just commonly used conponent",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Components", link: "/components/" },
      {
        text: "Github",
        link: "https://github.com/jixiang255/hezhi-vue-comps.git"
      }
    ],
    sidebar: [
      {
        title: "Introduction",
        collapsable: false,
        children: ["introduction/guide"]
      },
      {
        title: "Components",
        collapsable: false,
        children: [
          "components/H3DCarousel",
          "components/SlideCode",
          "components/SkuItems",
          "components/CropImage",
          "components/IdiomCode"
        ]
      }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        homp: resolve(__dirname, "../../src")
      }
    }
  }
};
