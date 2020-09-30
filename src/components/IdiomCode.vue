<template>
  <div style="text-align: center;">
    <button @click="genCode('canvas-raw-pic')">重新生成</button>
    <div style="position: relative;display: inline-block;">
      <canvas
        style="border: 1px #eee solid;"
        id="canvas-raw-pic"
        width="400"
        height="400"
        @click="canvasClick($event)"
      ></canvas>
      <div
        v-for="(point, index) in clickPoint"
        :key="index"
        style="position: absolute;width: 14px;height: 20px;background-color: #eee;"
        :style="{ left: point.x - 7 + 'px', top: point.y - 10 + 'px' }"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.genCode("canvas-raw-pic");
  },
  data: () => ({
    idioms: [
      "哀而不伤",
      "哀兵必胜",
      "爱屋及乌",
      "爱莫能助",
      "安土重迁",
      "安危相易",
      "安时处顺",
      "按部就班",
      "白驹过隙",
      "百身何赎",
      "百年树人"
    ],
    target: {
      idiom: null,
      points: []
    },
    image: {
      width: 400,
      height: 400
    },
    clickCount: 0,
    clickPoint: []
  }),
  methods: {
    genCode(canvasId) {
      this.target.points = [];
      this.clickCount = 0;
      this.clickPoint = [];
      const canvas = document.getElementById(canvasId);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, this.image.width, this.image.height);
      ctx.font = "24px serif";
      ctx.textBaseline = "top";
      this.target.idiom = this.getRandomIdiom();
      for (const char of this.target.idiom) {
        const point = this.getRandomPoint();
        ctx.fillText(char, point.x, point.y);
        this.target.points.push(point);
      }
    },
    getRandomIdiom() {
      const min = 0;
      const max = this.idioms.length;
      const random = Math.random() * (max - min) + min;
      return this.idioms[parseInt(random)];
    },
    getRandomPoint() {
      const min = 14 / 2;
      const max = this.image.width - min;
      return {
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min
      };
    },
    canvasClick(e) {
      const canvas = document.getElementById("canvas-raw-pic");
      const rect = canvas.getBoundingClientRect();
      this.clickPoint.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      this.clickCount++;
      if (this.clickCount === this.target.idiom.length) {
        if (this.validCode()) {
          alert("验证成功！");
        } else {
          alert("验证失败！请重试...");
          this.clickCount = 0;
          this.clickPoint = [];
        }
      }
      console.log("canvasClick is {}", e, rect);
    },
    validCode() {
      return this.clickPoint.every((point, index) => {
        const result =
          this.target.points[index].x < point.x &&
          point.x < this.target.points[index].x + 24 &&
          this.target.points[index].y < point.y &&
          point.y < this.target.points[index].y + 30;
        return result;
      });
    }
  }
};
</script>

<style></style>
