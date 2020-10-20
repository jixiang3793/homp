<template>
  <div>
    库存：{{ restDesc }}
    <div v-for="(value, key) in product" :key="key">
      <div class="my-2">
        {{ value.name }}
        <button
          class="mx-1"
          v-for="(item, i) in value.list"
          :class="calcClasses(key, item.code)"
          type="button"
          :key="i"
          @click="click(key, item.code)"
          :disabled="item.disabled"
        >
          {{ item.name }}
        </button>
        <!-- {{select[key]}} -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    rest: ["111", "121", "231", "321", "212", "213", "223"],
    restDesc: [
      "版本1内存8G硬盘256G",
      "版本1内存16G硬盘256G",
      "版本2内存32G硬盘256G",
      "版本3内存16G硬盘256G",
      "版本2内存8G硬盘512G",
      "版本2内存8G硬盘1T",
      "版本2内存16G硬盘1T"
    ],
    classes: {
      version: "red-selected-item",
      mem: "green-selected-item",
      disk: "blue-selected-item"
    },
    select: {
      version: null,
      mem: null,
      disk: null
    },
    product: {
      version: {
        name: "版本",
        list: [
          {
            name: "版本1",
            disabled: false,
            code: "1"
          },
          {
            name: "版本2",
            disabled: false,
            code: "2"
          },
          {
            name: "版本3",
            disabled: false,
            code: "3"
          }
        ]
      },
      mem: {
        name: "内存",
        list: [
          {
            name: "8G",
            disabled: false,
            code: "1"
          },
          {
            name: "16G",
            disabled: false,
            code: "2"
          },
          {
            name: "32G",
            disabled: false,
            code: "3"
          }
        ]
      },
      disk: {
        name: "硬盘",
        list: [
          {
            name: "256G",
            disabled: false,
            code: "1"
          },
          {
            name: "512G",
            disabled: false,
            code: "2"
          },
          {
            name: "1T",
            disabled: false,
            code: "3"
          }
        ]
      }
    }
  }),
  mounted() {
    this.calc();
  },
  methods: {
    click(type, code) {
      if (this.select[type]) {
        if (this.select[type] === code) {
          this.select[type] = null;
        } else {
          this.select[type] = code;
        }
      } else {
        this.select[type] = code;
      }
      this.calc();
    },
    calcClasses(key, code) {
      const styles = {};
      styles[this.classes[key]] = this.select[key] === code;
      return styles;
    },
    calc() {
      let j = 0;
      for (const ptype in this.product) {
        if (Object.prototype.hasOwnProperty.call(this.product, ptype)) {
          const datas = this.product[ptype].list;
          datas.forEach(it => {
            let restList = this.rest.filter(re => re[j] === it.code);
            Object.keys(this.select).forEach((type, i) => {
              if (ptype !== type && this.select[type]) {
                restList = restList.filter(re => re[i] === this.select[type]);
              }
            });

            if (restList.length > 0) {
              it.disabled = false;
            } else {
              it.disabled = true;
            }
          });
        }
        j++;
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
