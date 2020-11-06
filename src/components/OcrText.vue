<template>
  <div style="display: flex;">
    <div class="ocrtext-panel-left">
      <div>
        <button type="button" @click="panel = 'paste'">粘贴图片</button>
        <button type="button" @click="panel = 'choose'">选择图片</button>
      </div>
      <div v-if="panel === 'paste'">
        <div autofocus="autofocus" class="ocrtext-input-img" @paste="paste">
          <img :src="pasteImg" alt="" />
        </div>
      </div>
      <div v-if="panel === 'choose'">
        <crop-image />
      </div>
    </div>
    <div>
      <button type="button" @click="ocr">ocr</button>
    </div>
    <div class="ocrtext-panel-right">
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
    resultText: ""
  }),
  mounted() {
    // this.calc();
    this.worker = createWorker({
      langPath: "/lang-data",
      logger: m => console.log(m)
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
}
</style>
