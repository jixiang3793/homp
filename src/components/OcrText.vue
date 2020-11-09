<template>
  <div style="display: flex;align-items: center;">
    <div class="ocrtext-panel-left">
      <div>
        <button type="button" @click="panel = 'paste'">粘贴图片</button>
        <button type="button" @click="panel = 'choose'">选择图片</button>
      </div>
      <div v-if="panel === 'paste'">
        <div autofocus="autofocus" class="ocrtext-input-img" @paste="paste">
          <div v-show="!pasteImg">
            图片
          </div>
          <img :src="pasteImg" alt="" />
        </div>
      </div>
      <div v-if="panel === 'choose'">
        <crop-image />
      </div>
    </div>
    <div style="padding: 10px">
      <button type="button" @click="ocr">ocr</button>
      <div>{{ progress }}</div>
    </div>
    <div class="ocrtext-panel-right ocrtext-input-img">
      <div v-show="!resultText">
        ocr结果
      </div>
      <div class="ocrtext-panel-result">{{ resultText }}</div>
    </div>
  </div>
</template>

<script>
import { createWorker } from "tesseract.js";

export default {
  data: () => ({
    panel: "paste",
    pasteImg: null,
    worker: null,
    resultText: "",
    progress: 0
  }),
  mounted() {
    // this.calc();
    this.worker = createWorker({
      workerPath: "/tesseract/worker.min.js",
      langPath: "/lang-data",
      corePath: "/tesseract/tesseract-core.wasm.js",
      logger: m => {
        console.log(m);
        this.progress = m.progress.toFixed(4) * 100 + "%";
      }
    });
  },
  methods: {
    paste(evt) {
      console.log(
        evt,
        evt.clipboardData.files.length,
        evt.clipboardData.items.length,
        evt.clipboardData.types.length
      );
      if (evt.clipboardData.files.length) {
        this.pasteImg = URL.createObjectURL(evt.clipboardData.files.item(0));
      }
    },
    ocr() {
      (async () => {
        await this.worker.load();
        await this.worker.loadLanguage("eng+chi_sim");
        await this.worker.initialize("eng+chi_sim");
        const {
          data: { text }
        } = await this.worker.recognize(this.pasteImg);
        this.resultText = text;
        await this.worker.terminate();
      })();
    }
  }
};
</script>

<style scoped>
.ocrtext-input-img {
  width: 300px;
  height: 200px;
  border: 1px #eee solid;
  color: #aaa;
  text-align: center;
}
</style>
