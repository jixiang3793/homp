<template>
  <div>
    <!-- 原图、缺图、小块图、随机按钮 -->
    <div class="gen-code-panel">
      <h1>滑动验证码生成器</h1>
      <div style="display: none;">
        <div class="canvas-panel">
          <canvas id="canvas-raw-pic"></canvas>
        </div>
        <div class="canvas-panel">
          <canvas id="canvas-small-pic"></canvas>
        </div>
      </div>
    </div>

    <!-- 缺图、小块图合一，滑动操作 -->
    <div class="slide-code-panel">
      <div class="slide-code-container">
        <img :src="missImg" alt="底图" />
        <button @click="genCode()">重新生成</button>
        <img
          :src="squareImg"
          :style="{
            position: 'absolute',
            top: getSquareHeight() + 'px',
            left: greyBackWidth + 'px'
          }"
          alt="小方块"
        />
      </div>
      <div class="slide-code-oper">
        <div
          style="position: relative;height: 40px;width: 400px;"
          @mousemove="mousemove($event)"
        >
          <div
            style="margin: auto auto;height: 4px;border-radius: 2px;top: 18px;position: absolute;border: 1px #eee solid;"
          >
            <div
              style="background-color: grey;height: 4px;"
              :style="{ width: greyBackWidth + 'px' }"
            ></div>
            <div
              style="background-color: white;height: 4px;"
              :style="{ width: whiteBackWidth + 'px' }"
            ></div>
          </div>
          <button
            @mousedown="mousedown($event)"
            @mouseup="mouseup($event)"
            style="position: absolute;left: 62px;width: 84px;top: 5px;
                    height: 30px;"
            :style="{ left: greyBackWidth + 'px' }"
            nz-button
          >
            拖动
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as StackBlur from "stackblur-canvas";
export default {
  props: {
    image: {
      type: String,
      default: "/school2.jpg"
    }
  },

  mounted() {
    this.loadImageToCanvas(this.image, "canvas-raw-pic");
  },
  data: () => ({
    square: {
      width: 84,
      height: 84
    },
    rawImg: null,
    pos: null,
    missImg: null,
    squareImg: null,
    startPos: 0,
    isDrag: false,
    greyBackWidth: 0,
    whiteBackWidth: 316
  }),
  methods: {
    getSquareHeight() {
      if (this.rawImg) {
        return this.rawImg.height / 2 - this.square.height / 2;
      }
      return 0;
    },
    crop() {
      let canvas = document.getElementById("canvas-small-pic");
      let ctx = canvas.getContext("2d");
      canvas.width = this.square.width;
      canvas.height = this.square.height;
      ctx.drawImage(
        this.rawImg,
        this.pos - this.square.width / 2,
        this.rawImg.height / 2 - this.square.height / 2,
        this.square.width,
        this.square.height,
        0,
        0,
        this.square.width,
        this.square.height
      );
    },
    genCode() {
      // 获取小方块
      this.pos = this.getRandomPos();
      this.crop();

      StackBlur.canvasRGB(
        document.getElementById("canvas-raw-pic"),
        this.pos - this.square.width / 2,
        this.rawImg.height / 2 - this.square.height / 2,
        this.square.width,
        this.square.height,
        30
      );

      this.missImg = this.getUrlFromCanvas("canvas-raw-pic");
      this.squareImg = this.getUrlFromCanvas("canvas-small-pic");
    },
    getRandomPos() {
      const min = this.square.width / 2;
      const max = this.rawImg.width - min;
      return Math.random() * (max - min) + min;
    },
    loadImageToCanvas(url, cavansId) {
      let canvas = document.getElementById(cavansId);
      let ctx = canvas.getContext("2d");
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        this.whiteBackWidth = img.width;
        this.rawImg = img;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        this.genCode();
      };
      img.src = url;
    },
    getUrlFromCanvas(cavansId) {
      let canvas = document.getElementById(cavansId);
      return canvas.toDataURL();
    },
    mousedown(e) {
      // console.log("mousedown is {}", e);
      this.startPos = e.clientX;
      this.isDrag = true;
    },
    mouseup(e) {
      console.log(
        "mouseup is {}",
        e,
        this.startPos,
        this.pos,
        this.greyBackWidth
      );
      this.isDrag = false;
      if (
        this.greyBackWidth - 2 < parseInt(this.pos - this.square.width / 2) &&
        parseInt(this.pos - this.square.width / 2) < this.greyBackWidth + 2
      ) {
        alert("验证成功！");
        this.greyBackWidth = 0;
        this.whiteBackWidth = this.rawImg.width;
      } else {
        alert("验证失败！请重试...");
        this.greyBackWidth = 0;
        this.whiteBackWidth = this.rawImg.width;
      }
    },
    mousemove(e) {
      if (this.isDrag) {
        const dis = e.clientX - this.startPos;
        if (dis >= 0) {
          this.greyBackWidth = dis;
          this.whiteBackWidth = this.rawImg.width - this.greyBackWidth;
        }
      }
    }
  }
};
</script>

<style scoped>
.canvas-panel {
  display: inline-block;
}

.slide-code-container {
  position: relative;
}
</style>
