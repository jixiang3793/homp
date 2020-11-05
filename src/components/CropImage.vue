<template>
  <div>
    <div>
      <div>
        <div id="container"></div>
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
        <a
          type="button"
          :download="cropImageName"
          :href="cropImageUrl"
          @click="download"
          >download</a
        >
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
import Konva from "konva";

export default {
  data: () => ({
    file: null,
    imgSrc: null,
    points: [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: -200 },
      { x: 0, y: -200 }
    ],
    stage: null,
    layer: null,
    groupClip: null,
    cropImageName: "crop.png",
    cropImageUrl: ""
  }),
  mounted() {
    // this.calc();
    this.stage = new Konva.stage({
      container: "container",
      width: 600,
      height: 800
    });
    this.layer = new Konva.layer();
    this.stage.add(this.layer);
  },
  methods: {
    pointsFactory(type) {
      const points = [];
      if (type === "rect") {
        points.push({ x: 10, y: 10 });
        points.push({ x: 210, y: 10 });
        points.push({ x: 210, y: 210 });
        points.push({ x: 10, y: 210 });
      }
      return points;
    },
    fileChange(e) {
      if (e && e.target && e.target.files && e.target.files[0]) {
        this.file = e.target.files[0];
        this.imgSrc = URL.createObjectURL(this.file);
        this.layer.destroyChildren();
        Konva.Image.fromURL(this.imgSrc, function(darthNode) {
          var group = new Konva.Group({
            x: 0,
            y: 0,
            opacity: 1,
            fill: "#fff",
            draggable: true
          });

          this.points = this.pointsFactory("rect");

          this.points.forEach((it, index) => {
            var rect = new Konva.Rect({
              id: index,
              name: "rect",
              x: it.x,
              y: it.y,
              width: 4,
              height: 4,
              stroke: "blue",
              strokeWidth: 1,
              draggable: true
            });
            rect.on("dragstart", function(e) {
              console.log("rect e is {} ...", e);

              // var pointId = e.target.attrs.id;
              // var spoints = this.layer.find(`.rect`);
              // // var node = this.layer.findOne(`#${pointId}`);
              // spoints[pointId].x(this.points[pointId].x);
              // spoints[pointId].y(this.points[pointId].y);
              // this.points[pointId].x = e.target.attrs.x;
              // this.points[pointId].y = e.target.attrs.y;
            });
            rect.on("dragend", function(e) {
              console.log("rect e is {} ...", e);
              e.evt.cancelBubble = true;
              var pointId = e.target.attrs.id;
              this.points[pointId].x = e.target.attrs.x;
              this.points[pointId].y = e.target.attrs.y;
              var next = (pointId + 1) % this.points.length;
              var prev =
                (pointId - 1 + this.points.length) % this.points.length;
              var node1 = this.layer.findOne(`#point${pointId}_point${next}`);
              var node2 = this.layer.findOne(`#point${prev}_point${pointId}`);
              // setTimeout(() => {

              node1.this.points([
                this.points[pointId].x,
                this.points[pointId].y,
                this.points[next].x,
                this.points[next].y
              ]);
              node2.this.points([
                this.points[prev].x,
                this.points[prev].y,
                this.points[pointId].x,
                this.points[pointId].y
              ]);
              this.groupClip.draw();
              this.layer.draw();
              // node2.draw();
              // }, 0);
              console.log(node1, node2);
            });
            var line = new Konva.Line({
              id: `point${index}_point${(index + 1) % this.points.length}`,
              points: [
                it.x,
                it.y,
                this.points[(index + 1) % this.points.length].x,
                this.points[(index + 1) % this.points.length].y
              ],
              stroke: "blue",
              strokeWidth: 2
            });

            group.add(line);
            group.add(rect);
          });
          var groupBg = new Konva.Group({
            x: 0,
            y: 0,
            opacity: 0.5
            // draggable: true,
          });
          group.on("dragend", function(e) {
            console.log("group e is {} ...", e);
            this.groupClip.draw();
            this.layer.draw();
          });
          this.groupClip = new Konva.Group({
            x: 0,
            y: 0,
            clipFunc: function(ctx) {
              ctx.beginPath();
              // var spoints = this.layer.find(`.rect`);
              for (var i = 0; i < this.points.length; i++) {
                var x = this.points[i].x + group.x();
                var y = this.points[i].y + group.y();
                if (i == 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }

              ctx.closePath();
            }
            // draggable: true,
          });
          group.on("mouseover", function() {
            document.body.style.cursor = "move";
          });
          group.on("mouseout", function() {
            document.body.style.cursor = "default";
          });
          darthNode.setAttrs({
            x: 0,
            y: 0
          });
          groupBg.add(darthNode.clone());
          this.groupClip.add(darthNode);

          this.layer.add(groupBg);
          this.layer.add(this.groupClip);
          this.layer.add(group);

          this.layer.batchDraw();
        });
      }
      console.log("fileChange ....", this.file);
    },
    choose() {
      if (this.$refs && this.$refs.file) {
        this.$refs.file.click();
      }
    },
    download() {
      // 两点间距离最长的
      var pointsDis = [];
      var start = this.points[0];
      for (let index = 1; index < this.points.length; index++) {
        pointsDis.push(
          Math.sqrt(
            Math.pow(start.x - this.points[index].x, 2) +
              Math.pow(start.x - this.points[index].y, 2)
          )
        );
      }
      var max = Math.max(...pointsDis);
      var crop = new Konva.stage({
        container: "crop",
        width: max,
        height: max
      });
      var croplayer = new Konva.layer();
      croplayer.add(this.groupClip.clone());
      crop.add(croplayer);
      this.cropImageUrl = crop.toDataURL();
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
