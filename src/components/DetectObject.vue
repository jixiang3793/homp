<template>
  <div>
    <div>
      <div style="display: none">
        <canvas id="canvasInput"></canvas>
        <canvas id="canvasOutput"></canvas>
      </div>
      <div class="detect-result-layout">
        <img :src="imgInput" />
        <img :src="imgOutput" />
      </div>
      <div>
        <button type="button" @click="choose">选择图片</button>
        <input
          type="file"
          accept="image/*"
          hidden
          ref="file"
          @change="fileChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
// https://stackoverflow.com/questions/27213413/canvas-cropping-images-in-different-shapes
// https://github.com/zoltan-dulac/polyClip
// window.global = window;
// import cv from '../assets/opencv.js';
export default {
  data: () => ({
    file: null,
    points: [],
    imgInput: '',
    imgOutput: '',
  }),
  mounted() {
    this.loadOpencv();
  },
  methods: {
    loadOpencv() {
      var script = document.createElement('script');
      script.src = '/opencv.js';
      // script.crossOrigin = 'anonymous';
      // script.integrity = 'sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=';
      document.head.appendChild(script);
    },
    drawObject() {
      let srcSource = window.cv.imread('canvasInput');
      let src = srcSource.clone();
      window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0);
      window.cv.threshold(src, src, 50, 200, window.cv.THRESH_BINARY);
      // window.cv.adaptiveThreshold(src, src, 200, window.cv.ADAPTIVE_THRESH_GAUSSIAN_C, window.cv.THRESH_BINARY, 3, 2);
      // window.cv.threshold(src, src, 0, 255, window.cv.THRESH_BINARY_INV + window.cv.THRESH_OTSU);
      // window.cv.Canny(src, src, 50, 100, 3, false);
      let contours = new window.cv.MatVector();
      let hierarchy = new window.cv.Mat();
      let poly = new window.cv.MatVector();
      let lens = [];
      window.cv.findContours(
        src,
        contours,
        hierarchy,
        window.cv.RETR_CCOMP,
        window.cv.CHAIN_APPROX_SIMPLE
      );
      // approximates each contour to polygon
      for (let i = 0; i < contours.size(); ++i) {
        let tmp = new window.cv.Mat();
        let cnt = contours.get(i);
        // You can try more different parameters
        window.cv.approxPolyDP(cnt, tmp, 50, true);
        lens.push(window.cv.arcLength(cnt, false));
        poly.push_back(tmp);
        cnt.delete();
        tmp.delete();
      }
      let max = Math.max(...lens);
      let pos = lens.indexOf(max);
      // draw contours with random Scalar
      // for (let i = 0; i < contours.size(); ++i) {
      let color = new window.cv.Scalar(
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255)
      );
      this.cropImage(poly.get(pos).data32S, srcSource);
      window.cv.drawContours(srcSource, poly, pos, color, 1, 8, hierarchy, 0);
      // }
      // poly.get(pos).data32S
      window.cv.imshow('canvasInput', srcSource);
      src.delete();
      hierarchy.delete();
      contours.delete();
      poly.delete();

      this.showImg();
    },
    showImg() {
      let canvas = document.getElementById('canvasInput');
      this.imgInput = canvas.toDataURL('image/jpg');
      canvas = document.getElementById('canvasOutput');
      this.imgOutput = canvas.toDataURL('image/jpg');
    },
    formatPoints(points) {
      const ps = [];
      for (let i = 0; i < points.length; i += 2) {
        ps.push({ x: points[i], y: points[i + 1] });
      }
      // x排序再y排序，得到左上顶点
      // ps.sort((a, b) => a.x + a.y - (b.x + b.y));
      return ps;
    },
    cropImage(points, imgMat) {
      // 找出最小x、y坐标，最大x、y坐标
      this.points = this.formatPoints(points);
      const xmin = Math.min(...this.points.map((it) => it.x));
      const ymin = Math.min(...this.points.map((it) => it.y));
      const xmax = Math.max(...this.points.map((it) => it.x));
      const ymax = Math.max(...this.points.map((it) => it.y));

      var start = { x: xmin, y: ymin };
      let rect = new window.cv.Rect(start.x, start.y, xmax - xmin, ymax - ymin);
      window.cv.imshow('canvasOutput', imgMat.roi(rect));
    },
    fileChange(e) {
      if (e && e.target && e.target.files && e.target.files[0]) {
        this.file = e.target.files[0];
        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById('canvasInput');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          this.drawObject();
        };
        img.src = URL.createObjectURL(this.file);
        // });
      }
      // console.log('fileChange ....', this.file);
    },
    choose() {
      if (this.$refs && this.$refs.file) {
        this.$refs.file.click();
      }
    },
  },
};
</script>

<style scoped>
.detect-result-layout img {
  width: 45%;
}
</style>
