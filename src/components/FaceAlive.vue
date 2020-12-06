<template>
  <div style="text-align: center;">
    <div>
      <button @click="detectVideo">启用</button>
      <button @click="playOrPause">
        {{ videoStatus === "play" ? "pause" : "play" }}
      </button>
      <button @click="startAlive">
        开启活体
      </button>
      <button @click="detect">
        检测
      </button>
    </div>

    <div
      class="face-detect-main"
      :style="{ width: devices.iphone6.width + 'px' }"
    >
      <div class="face-mask-text-light">请保证光线充足，正视摄像头</div>
      <div class="face-mask-circle"></div>
      <div class="face-mask-circle-border">
        <svg
          id="svgelem"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style="width: 300px;height: 300px;"
        >
          <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#05a"></stop>
              <stop offset="50%" stop-color="#a55"></stop>
              <stop offset="100%" stop-color="#0a5"></stop>
            </linearGradient>
          </defs>
          <circle
            cx="150"
            cy="150"
            r="148"
            stroke="url(#linear)"
            stroke-width="5"
            fill="none"
          ></circle>
        </svg>
      </div>
      <div class="face-mask-stepper" v-show="loadingAlive">
        正在加载活体...
      </div>
      <div class="face-mask-stepper" v-show="alive && !loadingAlive">
        <div class="face-mask-stepper-text">
          {{
            currentIndicator > aliveIndicator.length
              ? "已完成活体校验"
              : aliveIndicator[currentIndicator - 1].text
          }}
        </div>
        <div class="face-mask-stepper-indicator">
          <template v-for="(item, index) in aliveIndicator">
            <div class="face-mask-stepper-index" :key="index">
              {{ currentIndicator - 1 > index ? "✓" : index + 1 }}
            </div>
          </template>
        </div>
      </div>
      <div id="media" style="display: flex">
        <video id="video" playsinline class="video"></video>
      </div>
    </div>

    <div style="display: inline-block">
      <canvas id="canvas" class="canvas"></canvas>
    </div>
  </div>
</template>

<script>
// if (window.global === undefined) {
//   window.global = window;
// }
// import Human from "@vladmandic/this.human";
import { config as userConfig } from "./faceConfig";
// import draw from "./draw.js";
// let this.human = null;

export default {
  mounted() {
    // this.genCode("canvas-raw-pic");
    this.loadLib();
    // this.load();
  },
  data: () => ({
    devices: {
      iphone6p: {
        width: 414,
        height: 736
      },
      iphone6: {
        width: 375,
        height: 667
      }
    },
    currentIndicator: 2,
    aliveIndicator: [
      {
        text: "请向左看",
        rule: "facing right"
      },
      {
        text: "请向右看",
        rule: "facing left"
      },
      {
        text: "请抬头",
        rule: "head up"
      },
      {
        text: "请低下头",
        rule: "head down"
      },
      {
        text: "请张嘴下",
        rule: "mouth"
      },
      {
        text: "请眨眨眼",
        rule: "blink"
      }
    ],
    lastFaceBox: null,
    ui: {
      baseColor: "rgba(173, 216, 230, 0.3)", // 'lightblue' with light alpha channel
      baseBackground: "rgba(50, 50, 50, 1)", // 'grey'
      baseLabel: "rgba(173, 216, 230, 1)", // 'lightblue' with dark alpha channel
      baseFontProto: 'small-caps {size} "Segoe UI"',
      baseLineWidth: 12,
      crop: true,
      columns: 2,
      busy: false,
      facing: true,
      useWorker: false,
      worker: "demo/worker.js",
      drawBoxes: false,
      drawText: false,
      drawPoints: false,
      drawPolygons: false,
      fillPolygons: false,
      useDepth: false,
      console: true,
      maxFPSframes: 10,
      modelsPreload: true,
      modelsWarmup: true,
      menuWidth: 0,
      menuHeight: 0,
      camera: {},
      detectFPS: [],
      drawFPS: [],
      buffered: false,
      drawThread: null,
      detectThread: null,
      framesDraw: 0,
      framesDetect: 0,
      bench: false
    },
    videoStatus: "play",
    video: null,
    alive: false,
    loadingAlive: false,
    canvas: null
  }),
  methods: {
    async startAlive() {
      // console.log("startAlive ...", this.human.models);
      this.loadingAlive = true;
      this.alive = true;
      const facemesh = this.human.models.facemesh;
      this.human.models.facemesh = null;
      userConfig.face.mesh.enabled = true;
      userConfig.face.iris.enabled = true;
      await this.human.load(userConfig);
      // await this.preload();
      this.human.models.facemesh.pipeline.boundingBoxDetector =
        facemesh.pipeline.boundingBoxDetector;
      await this.human.warmup(userConfig);
      // setTimeout(() => {
      this.loadingAlive = false;
      // }, 1000);
    },
    detect() {
      console.log("detect ...");
      const time1 = Date.now();
      // const res = await this.human.detect(this.video);
      this.human.detect(this.video).then(res => {
        const time2 = Date.now();
        console.log("res spend time is ...", res, (time2 - time1) / 1000);
      });
    },
    loadLib() {
      var script = document.createElement("script");
      script.src = "/human.js";
      // script.type = "module";
      script.onload = () => {
        // eslint-disable-next-line no-undef
        this.human = new Human.default(userConfig);
        this.preload();
      };
      document.head.appendChild(script);
    },
    playOrPause() {
      if (this.videoStatus === "play") {
        this.video.pause();
        this.videoStatus = "pause";
      } else if (this.videoStatus === "pause") {
        this.video.play();
        this.runHumanDetect(this.video, this.canvas);
        this.videoStatus = "play";
      }
    },
    async preload() {
      await this.human.load(userConfig);
      await this.human.warmup(userConfig);
    },
    // main processing function when input is webcam, can use direct invocation or web worker
    // eslint-disable-next-line no-unused-vars
    runHumanDetect(input, canvas, timestamp) {
      // if live video
      const live =
        input.srcObject &&
        input.srcObject.getVideoTracks()[0].readyState === "live" &&
        input.readyState > 2 &&
        !input.paused;
      if (!live && input.srcObject && this.loadingAlive) {
        return;
      }
      // console.log("runHumanDetect ...", userConfig);
      this.human.detect(input, userConfig).then(result => {
        let curFace = null;
        if (result.face && result.face.length) {
          curFace = result.face[0].box;
        }
        // 绘制人脸图像 如果此次没有人脸，会一直返回上次的结果
        if (
          (!this.lastFaceBox && curFace) ||
          (curFace &&
            this.lastFaceBox[0] != curFace[0] &&
            this.lastFaceBox[1] != curFace[1] &&
            this.lastFaceBox[2] != curFace[2] &&
            this.lastFaceBox[3] != curFace[3])
        ) {
          const width = curFace[2] - curFace[0];
          const height = curFace[3] - curFace[1];
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(
            input,
            curFace[0],
            curFace[1],
            width,
            height,
            0,
            0,
            width,
            height
          );
          this.lastFaceBox = curFace;
          console.log("draw result ...", curFace);
        }
        // 是否有活体动作
        if (this.alive && result.gesture && result.gesture.length) {
          for (let i = 0; i < result.gesture.length; i++) {
            const [where, what] = Object.entries(result.gesture[i]);
            if (what.length > 1 && what[1].length > 0) {
              const person = where[1] > 0 ? `#${where[1]}` : "";
              const label = `${where[0]} ${person}: ${what[1]}`;
              console.log("drawGesture label", label);
              if (this.currentIndicator <= this.aliveIndicator.length) {
                if (
                  label.indexOf(
                    this.aliveIndicator[this.currentIndicator - 1].rule
                  ) > -1
                ) {
                  this.currentIndicator += 1;
                }
              }
            }
          }
        }

        // if (!this.ui.drawThread)
        // this.drawResults(input);
        this.ui.detectThread = requestAnimationFrame(now =>
          this.runHumanDetect(input, canvas, now)
        );
        // }
      });
    },
    // setup webcam
    async setupCamera() {
      this.ui.busy = true;
      const video = document.getElementById("video");
      this.video = video;
      const canvas = document.getElementById("canvas");
      this.canvas = canvas;
      let msg = "";
      // status("setting up camera");
      // setup webcam. note that navigator.mediaDevices requires that page is accessed via https
      if (!navigator.mediaDevices) {
        msg = "camera access not supported";
        // output.innerText += `\n${msg}`;
        // log(msg);
        // status(msg);
        // this.ui.busy = false;
        return msg;
      }
      let stream;
      const constraints = {
        audio: false,
        video: {
          facingMode: this.ui.facing ? "user" : "environment",
          resizeMode: this.ui.crop ? "crop-and-scale" : "none",
          width: { ideal: this.devices.iphone6.width },
          height: { ideal: this.devices.iphone6.height }
        }
      };
      // if (window.innerWidth > window.innerHeight)
      //   constraints.video.width = { ideal: window.innerWidth };
      // else
      //   constraints.video.height = {
      //     ideal:
      //       window.innerHeight - document.getElementById("menubar").offsetHeight
      //   };
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        if (
          err.name === "PermissionDeniedError" ||
          err.name === "NotAllowedError"
        )
          msg = "camera permission denied";
        else if (err.name === "SourceUnavailableError")
          msg = "camera not available";
        else msg = `camera error: ${err.message || err}`;
        // output.innerText += `\n${msg}`;
        // status(msg);
        // log("camera error:", err);
        // this.ui.busy = false;
        return msg;
      }
      if (stream) video.srcObject = stream;
      else {
        this.ui.busy = false;
        return "camera stream empty";
      }
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      console.log("camera settings is ...", settings);
      return new Promise(resolve => {
        video.onloadeddata = async () => {
          video.width = video.videoWidth;
          video.height = video.videoHeight;
          // canvas.width = video.width;
          // canvas.height = video.height;
          // canvas.style.width = canvas.width > canvas.height ? "100vw" : "";
          // canvas.style.height = canvas.width > canvas.height ? "" : "100vh";
          resolve();
        };
      });
    },
    async detectVideo() {
      console.log("detectVideo ...");
      userConfig.videoOptimized = true;
      // document.getElementById("samples-container").style.display = "none";
      // document.getElementById("canvas").style.display = "block";
      const video = document.getElementById("video");
      const canvas = document.getElementById("canvas");
      if (video.srcObject !== null && !video.paused) {
        // document.getElementById("play").style.display = "block";
        // document.getElementById("btnStart").className = "button button-start";
        // document.getElementById("btnStart").innerHTML = "start<br>video";
        // status("paused");
        video.pause();
      } else {
        const cameraError = await this.setupCamera();
        if (!cameraError) {
          // document.getElementById("play").style.display = "none";
          // // for (const m of Object.values(menu)) m.hide();
          // status("");
          // document.getElementById("btnStart").className = "button button-stop";
          // document.getElementById("btnStart").innerHTML = "pause<br>video";
          video.play();
          this.runHumanDetect(video, canvas);
        } else {
          status(cameraError);
        }
      }
    }
  }
};
</script>

<style>
.face-detect-main {
  display: inline-block;
  position: relative;
  overflow: hidden;
}
.face-mask-text-light {
  color: white;
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 20px;
  z-index: 1;
  top: 80px;
}
.face-mask-circle {
  width: 300px;
  height: 300px;
  position: absolute;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 0 300px #0000004d;
  top: 120px;
}
.face-mask-circle-border {
  width: 300px;
  height: 300px;
  position: absolute;
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
  /* box-shadow: 0 0 0 300px #0000004d; */
  top: 120px;
}

.face-mask-stepper {
  color: white;
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 20px;
  z-index: 1;
  top: 430px;
}
.face-mask-stepper-text {
  font-size: 16px;
  padding: 10px;
}
.face-mask-stepper-indicator {
  display: flex;
  justify-content: center;
}
.face-mask-stepper-index {
  margin: 0 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  border: 2px #37f359 solid;
  color: #37f359;
}
#svgelem {
  animation: circle 2s linear 0s infinite normal;
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
