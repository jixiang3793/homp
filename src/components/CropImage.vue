<template>
  <div>
    <div>
      <div>
        <button type="button">rotateLeft</button>
        <button type="button">rotateRight</button>
        <button type="button">copy(base64)</button>
        <button type="button">download</button>
      </div>
      <div style="position: relative;">
        <div
          style="
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0.6;
"
        ></div>
        <img :src="imgSrc" alt="" srcset="" ref="img" />
        <div></div>
        <canvas ref="imgcanvas"></canvas>
        <canvas ref="cropcanvas"></canvas>
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
/*
大体思路：
1. 放四个点响应各自拖动点事件
2. imgcanvas用来绘制路径，剪切图片
3. cropcanvas用来显示剪切图片，并且响应整体拖动事件
4.
*/

export default {
  data: () => ({
    file: null,
    imgSrc: null,
    points: [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: -200 },
      { x: 0, y: -200 }
    ]
  }),
  mounted() {
    // this.calc();
    this.$refs.img.onload = () => {
      console.log("img src loaded ...");
    };
  },
  methods: {
    fileChange(e) {
      if (e && e.target && e.target.files && e.target.files[0]) {
        this.file = e.target.files[0];
        this.imgSrc = URL.createObjectURL(this.file);
      }
      console.log("fileChange ....", this.file);
    },
    choose() {
      if (this.$refs && this.$refs.file) {
        this.$refs.file.click();
      }
    }
  }
};
</script>

<style scoped>
.my-2 {
  margin: 16px 0;
}

.mx-1 {
  margin: 0 8px;
}
.red-selected-item {
  background-color: red;
  color: white;
  border-color: red;
  border-style: solid;
}
.green-selected-item {
  background-color: green;
  color: white;
  border-color: green;
  border-style: solid;
}
.blue-selected-item {
  background-color: blue;
  color: white;
  border-color: blue;
  border-style: solid;
}
</style>
