<template>
  <div
    class="w-100 pos-rel"
    :style="{ height: imgWidth * options.ratio + 50 + 'px' }"
    ref="container"
  >
    <button
      @click="prev"
      class="pos-abs"
      :style="{
        left: 'calc(50% - ' + imgWidth / 2 + 'px)',
        top: 'calc(50% - 10px)',
        transform: calcBtnTrans()
      }"
    >
      上一步
    </button>
    <button
      @click="next"
      class="pos-abs"
      :style="{
        left: 'calc(50% + ' + (imgWidth / 2 - 56) + 'px)',
        top: 'calc(50% - 10px)',
        transform: calcBtnTrans()
      }"
    >
      下一步
    </button>
    <div
      class="h-carousel-item"
      v-for="(item, index) in videos"
      :key="index"
      :style="{
        backgroundImage: 'url(' + images[index] + ')',
        width: imgWidth + 'px',
        height: imgWidth * options.ratio + 'px',
        left: 'calc(50% - ' + imgWidth / 2 + 'px)',
        top: 'calc(50% - ' + (imgWidth * options.ratio) / 2 + 'px)',
        transform: calcTrans(index)
      }"
    >
      <button @click="play = true">播放</button>
      <video
        v-show="pos === index && play"
        :src="item"
        controls="controls"
        width="100%"
        height="100%"
      >
        您的浏览器不支持 video 标签。
      </video>
    </div>
  </div>
</template>

<script>
/**
 * showNum取值范围1，3，5
 * 图片宽度随显示数量动态变化，算法如下：
 * x + (showNum - 1)*y = width
 * x = 2y
 * showNum = 1时，照片宽度x = width
 * showNum = 3时，照片宽度x = width/2,偏移量y = width/4
 * 以此类推
 */
export default {
  name: "h-3d-carousel",
  props: {
    images: {
      type: Array,
      default: () => [
        "/school2.jpg",
        "/school2.jpg",
        "/school2.jpg",
        "/school2.jpg",
        "/school2.jpg"
      ]
    },
    videos: {
      type: Array,
      default: () => [
        "/sintel.mp4",
        "/sintel.mp4",
        "/sintel.mp4",
        "/sintel.mp4",
        "/sintel.mp4"
      ]
    },
    options: {
      type: Object,
      default: () => ({
        autoplay: false,
        showArrows: true,
        showNum: 3,
        ratio: 3 / 4
      })
    }
  },
  computed: {},
  mounted() {
    if (this.$refs.container) {
      this.imgWidth =
        (this.$refs.container.getBoundingClientRect().width /
          (this.options.showNum + 1)) *
        2;
    }
  },
  data() {
    return {
      colors: [
        "aliceblue",
        "antiquewhite",
        "aqua",
        "aquamarine",
        "black",
        "blue",
        "red",
        "green"
      ],
      pos: 0,
      imgWidth: 400,
      play: false
    };
  },
  methods: {
    prev() {
      this.play = false;
      this.pos = (this.pos - 1 + this.videos.length) % this.videos.length;
    },
    next() {
      this.play = false;
      this.pos = (this.pos + 1 + this.videos.length) % this.videos.length;
    },
    calcBtnTrans() {
      if (this.options.showNum === 1) {
        return "translateZ(11px)";
      } else {
        return "translateZ(151px)";
      }
    },
    calcTrans(index) {
      if (this.pos === index) {
        if (this.options.showNum === 1) {
          return "translateZ(10px)";
        } else {
          return "translateZ(150px)";
        }
      }

      let result = index - this.pos;

      if (result > 0) {
        if (result <= (this.options.showNum - 1) / 2) {
          return `translateX(${(this.imgWidth / 2) *
            Math.abs(result)}px) translateZ(100px) rotateY(-30deg)`;
        } else {
          result = Math.abs(result - this.videos.length);
          if (result <= (this.options.showNum - 1) / 2) {
            return `translateX(-${(this.imgWidth / 2) *
              Math.abs(result)}px) translateZ(100px) rotateY(30deg)`;
          } else {
            return null;
          }
        }
      } else {
        if (-((this.options.showNum - 1) / 2) <= result) {
          return `translateX(-${(this.imgWidth / 2) *
            Math.abs(result)}px) translateZ(100px) rotateY(30deg)`;
        } else {
          result = Math.abs(result + this.videos.length);
          if (result <= (this.options.showNum - 1) / 2) {
            return `translateX(${(this.imgWidth / 2) *
              Math.abs(result)}px) translateZ(100px) rotateY(-30deg)`;
          } else {
            return null;
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
.pos-rel {
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}
.pos-abs {
  position: absolute;
}
.h-carousel-item {
  position: absolute;
  border-radius: 7px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  transition: 0.8s ease-in-out;
}
</style>
