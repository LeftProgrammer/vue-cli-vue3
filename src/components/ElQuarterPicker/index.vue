<template>
  <div class="el-quarter-picker">
    <el-popover
      v-model:visible="visible"
      :disabled="!canPopover"
      :tabindex="null"
      placement="bottom-start"
      transition="el-zoom-in-top"
      trigger="click"
    >
      <div class="el-date-picker">
        <div class="el-picker-panel__body">
          <div
            class="el-date-picker__header el-date-picker__header--bordered"
            style="margin: 0px; line-height: 30px"
          >
            <button
              type="button"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
              aria-label="前一年"
              @click="clickLast"
            />
            <span role="button" class="el-date-picker__header-label" @click="clickYear">{{ title }}</span>
            <button
              type="button"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
              aria-label="后一年"
              @click="clickNext"
            />
          </div>
          <div class="el-picker-panel__content" style="margin: 0px; width: 100%">
            <table class="el-month-table">
              <tbody>
                <tr v-for="line in lineCount" :key="line">
                  <td
                    v-for="index in line * 4 <= viewList.length ? 4 : viewList.length - (line - 1) * 4"
                    :key="index"
                    :class="{
                      today: viewList[(line - 1) * 4 + index - 1].current,
                      current: viewList[(line - 1) * 4 + index - 1].active,
                    }"
                  >
                    <div>
                      <a class="cell" @click="clickItem(viewList[(line - 1) * 4 + index - 1])">
                        {{ viewList[(line - 1) * 4 + index - 1].label }}
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <template #reference>
        <el-input
          v-model="text"
          :placeholder="placeholder"
          :size="size"
          :readonly="!canEdit"
          :disabled="disabled"
          @change="changeText"
          @mouseenter="mouseEnter"
          @mouseleave="mouseLeave"
        >
          <template #prefix>
            <i class="el-input__icon el-icon-date" />
          </template>
        </el-input>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "ElQuarterPicker",
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: "yyyy年第Q季度",
    },
    valueFormat: {
      type: String,
      default: "yyyy-qq",
    },
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: undefined,
    },
  },
  emits: ["change", "update:modelValue"],
  data() {
    return {
      visible: false,
      showClear: false,
      canEdit: true,
      canPopover: true,
      text: "",
      viewType: 1,
      viewYear: 0,
      viewList: [],
      lineCount: 0,
      title: "",
      data: [0, 0],
    };
  },
  watch: {
    value(val) {
      if (this.modelValue !== undefined) {
        return;
      }
      this.changeValue(val);
    },
    modelValue(val) {
      if (val === undefined) {
        return;
      }
      this.changeValue(val);
    },
    readonly(val) {
      this.canEdit = !val && this.editable;
      this.canPopover = !this.disabled && !val;
    },
    editable(val) {
      this.canEdit = !this.readonly && val;
    },
    disabled(val) {
      this.canPopover = !val && !this.readonly;
    },
  },
  mounted() {
    const initial = this.modelValue !== undefined ? this.modelValue : this.value;
    this.changeValue(initial);

    this.canEdit = !this.readonly && this.editable;
    this.canPopover = !this.disabled && !this.readonly;

    this.__onKeyDown__ = (event) => {
      if (!this.visible) {
        return;
      }

      const data = [this.data[0], this.data[1]];
      if (data[0] < 1 || data[1] < 1) {
        const curDate = new Date();
        data[0] = curDate.getFullYear();
        data[1] = Math.floor(curDate.getMonth() / 3) + 1;
      }

      if (event.code === "ArrowLeft") {
        if (data[1] === 1) {
          data[0] = data[0] - 1;
          data[1] = 4;
        } else {
          data[1] = data[1] - 1;
        }
      } else if (event.code === "ArrowRight") {
        if (data[1] === 4) {
          data[0] = data[0] + 1;
          data[1] = 1;
        } else {
          data[1] = data[1] + 1;
        }
      } else if (event.code === "ArrowUp") {
        data[0] = data[0] - 1;
      } else if (event.code === "ArrowDown") {
        data[0] = data[0] + 1;
      } else {
        return;
      }

      if (data[0] < 1000 || data[0] > 9999) {
        return;
      }

      this.data = data;
      this.viewType = 1;
      this.viewYear = data[0];
      const out = this.formatTo(data, this.valueFormat);
      this.$emit("change", out);
      this.$emit("update:modelValue", out);
    };

    document.addEventListener("keydown", this.__onKeyDown__);
  },
  unmounted() {
    if (this.__onKeyDown__) {
      document.removeEventListener("keydown", this.__onKeyDown__);
      this.__onKeyDown__ = null;
    }
  },
  methods: {
    changeText() {
      if (this.checkFormat(this.format, this.text)) {
        this.formatFrom(this.text, this.format);
        const out = this.formatTo(this.data, this.valueFormat);
        this.$emit("change", out);
        this.$emit("update:modelValue", out);
      } else {
        if (this.data[0] < 1 || this.data[1] < 1) {
          this.text = "";
        } else {
          this.text = this.formatTo(this.data, this.format);
        }
      }
      this.visible = false;
    },
    mouseEnter() {
      if (!this.disabled && !this.readonly && this.clearable && this.text !== "") {
        this.showClear = true;
      }
    },
    mouseLeave() {
      if (!this.disabled && this.clearable) {
        this.showClear = false;
      }
    },
    clear() {
      this.showClear = false;
      this.visible = false;
      this.$emit("change", "");
      this.$emit("update:modelValue", "");
    },
    changeValue(val) {
      this.viewType = 1;
      if (val) {
        this.formatFrom(val, this.valueFormat);
        this.text = this.formatTo(this.data, this.format);
        this.viewYear = this.data[0];
      } else {
        this.text = "";
        this.data = [0, 0];
        this.viewYear = new Date().getFullYear();
      }
      this.initView();
    },
    initView() {
      const list = [];
      const curDate = new Date();
      const curYear = curDate.getFullYear();
      const curQuarter = Math.floor(curDate.getMonth() / 3) + 1;

      if (this.viewType === 1) {
        let index = 0;
        for (const i of "一二三四") {
          index++;
          const item = {
            label: "第" + i + "季度",
            year: this.viewYear,
            quarter: index,
            current: false,
            active: false,
          };
          if (this.viewYear === curYear && index === curQuarter) {
            item.current = true;
          } else if (this.viewYear === this.data[0] && index === this.data[1]) {
            item.active = true;
          }
          list.push(item);
        }
        this.title = this.viewYear + " 年";
      } else {
        const start = Math.floor(this.viewYear / 10) * 10;
        this.viewYear = start;
        for (let i = 0; i < 10; i++) {
          const year = start + i;
          const item = {
            label: year + "",
            year,
            current: false,
            active: false,
          };
          if (year === curYear) {
            item.current = true;
          } else if (year === this.data[0]) {
            item.active = true;
          }
          list.push(item);
        }
        this.title = start + " 年 - " + (start + 9) + " 年";
      }

      this.viewList = list;
      this.lineCount = Math.floor(list.length / 4);
      if (list.length % 4 > 0) {
        this.lineCount++;
      }
    },
    checkFormat(pattern, val) {
      let text = "";
      for (const char of pattern) {
        const dict = "\\^$.+?*[]{}!";
        if (dict.indexOf(char) === -1) {
          text += char;
        } else {
          text += "\\" + char;
        }
      }
      text = text.replace("yyyy", "[1-9]\\d{3}");
      text = text.replace("qq", "0[1-4]");
      text = text.replace("q", "[1-4]");
      text = text.replace("Q", "[一二三四]");
      text = "^" + text + "$";
      const patt = new RegExp(text);
      return patt.test(val);
    },
    formatTo(data, pattern) {
      let text = pattern.replace("yyyy", "" + data[0]);
      text = text.replace("qq", "0" + data[1]);
      text = text.replace("q", "" + data[1]);
      text = text.replace("Q", "一二三四".substr(data[1] - 1, 1));
      return text;
    },
    formatFrom(str, pattern) {
      const year = this.findText(str, pattern, "yyyy");
      const quarter = this.findText(str, pattern, ["qq", "q", "Q"]);
      this.data = [year, quarter];
    },
    findText(str, pattern, find) {
      if (find instanceof Array) {
        for (const f of find) {
          const val = this.findText(str, pattern, f);
          if (val !== -1) {
            return val;
          }
        }
        return -1;
      }
      const index = pattern.indexOf(find);
      if (index === -1) {
        return index;
      }
      const val = str.substr(index, find.length);
      if (find === "Q") {
        return "一二三四".indexOf(val) + 1;
      }
      return parseInt(val);
    },
    clickYear() {
      if (this.viewType !== 1) {
        return;
      }
      this.viewType = 2;
      this.initView();
    },
    clickItem(item) {
      if (this.viewType === 1) {
        const out = this.formatTo([item.year, item.quarter], this.valueFormat);
        this.$emit("change", out);
        this.$emit("update:modelValue", out);
        this.visible = false;
      } else {
        this.viewType = 1;
        this.viewYear = item.year;
        this.initView();
      }
    },
    clickLast() {
      if (this.viewYear > 1000) {
        if (this.viewType === 1) {
          this.viewYear--;
        } else {
          this.viewYear = this.viewYear - 10;
        }
        this.initView();
      }
    },
    clickNext() {
      if (this.viewYear < 9999) {
        if (this.viewType === 1) {
          this.viewYear++;
        } else {
          this.viewYear = this.viewYear + 10;
        }
        this.initView();
      }
    },
  },
};
</script>

<style>
.el-quarter-picker {
  width: 220px;
  display: inline-block;
}
</style>
