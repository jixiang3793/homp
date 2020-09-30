module.exports = {
  chainWebpack: config => {
    config.externals({
      moment: "moment"
    });
  },
  productionSourceMap: false
};
