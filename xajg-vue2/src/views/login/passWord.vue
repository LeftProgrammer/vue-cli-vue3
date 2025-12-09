<template>
  <div class="pw_input_cp el-input flex">
    <input
      class="el-input__inner custem-input pl-20"
      placeholder="请输入密码"
      ref="input"
      @input="handleInput"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />
  </div>
</template>

<script>
//自定义密码输入框
//input元素光标操作
class CursorPosition {
  constructor(_inputEl) {
    this._inputEl = _inputEl;
  }
  //获取光标的位置 前，后，以及中间字符
  get() {
    var rangeData = { text: "", start: 0, end: 0 };
    if (this._inputEl.setSelectionRange) {
      // W3C
      this._inputEl.focus();
      rangeData.start = this._inputEl.selectionStart;
      rangeData.end = this._inputEl.selectionEnd;
      rangeData.text =
        rangeData.start != rangeData.end
          ? this._inputEl.value.substring(rangeData.start, rangeData.end)
          : "";
    } else if (document.selection) {
      // IE
      this._inputEl.focus();
      var i;
      var oS = document.selection.createRange();
      var oR = document.body.createTextRange();
      oR.moveToElementText(this._inputEl);
      rangeData.text = oS.text;
      rangeData.bookmark = oS.getBookmark();
      for (
        i = 0;
        oR.compareEndPoints("StartToStart", oS) < 0 &&
        oS.moveStart("character", -1) !== 0;
        i++
      ) {
        if (this._inputEl.value.charAt(i) == "\r") {
          i++;
        }
      }
      rangeData.start = i;
      rangeData.end = rangeData.text.length + rangeData.start;
    }

    return rangeData;
  }
  //写入光标的位置
  set(rangeData) {
    var oR;
    if (!rangeData) {
      alert("You must get cursor position first.");
    }
    this._inputEl.focus();
    if (this._inputEl.setSelectionRange) {
      // W3C
      this._inputEl.setSelectionRange(rangeData.start, rangeData.end);
    } else if (this._inputEl.createTextRange) {
      // IE
      oR = this._inputEl.createTextRange();
      if (this._inputEl.value.length === rangeData.start) {
        oR.collapse(false);
        oR.select();
      } else {
        oR.moveToBookmark(rangeData.bookmark);
        oR.select();
      }
    }
  }
}

export default {
  name: "Pw_input_cp",
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      symbol: "●", //自定义的密码符号
      pwd: "", //密码明文数据
      inputEl: null, //input元素
      isComposing: false //输入框是否还在输入（记录输入框输入的是虚拟文本还是已确定文本）
    };
  },
  mounted() {
    this.inputEl = this.$refs.input;
    if (this.value) {
      this.pwd = this.value;
      this.inputDataConversion(this.pwd);
    }
  },
  watch: {
    value() {
      this.pwd = this.value;
      this.inputDataConversion(this.pwd);
    }
  },
  methods: {
    inputDataConversion(value) {
      //输入框里的数据转换，将123转为●●●
      if (!value) return;
      let data = "";
      for (let i = 0; i < value.length; i++) {
        data += this.symbol;
      }
      this.inputEl.value = data;
    },
    pwdSetData(positionIndex, value) {
      //写入原始数据
      let _pwd = value.split(this.symbol).join("");
      if (_pwd) {
        let index = this.pwd.length - (value.length - positionIndex.end);
        this.pwd =
          this.pwd.slice(0, positionIndex.end - _pwd.length) +
          _pwd +
          this.pwd.slice(index);
      } else {
        this.pwd =
          this.pwd.slice(0, positionIndex.end) +
          this.pwd.slice(positionIndex.end + this.pwd.length - value.length);
      }
    },
    handleInput(e) {
      //输入值变化后执行
      //撰写期间不应发出输入
      if (this.isComposing) return;
      let cursorPosition = new CursorPosition(this.inputEl);
      let positionIndex = cursorPosition.get();
      let value = e.target.value; //整个输入框的值
      this.pwdSetData(positionIndex, value);
      this.inputDataConversion(value);
      cursorPosition.set(positionIndex, this.inputEl);
      this.$emit("input", this.pwd);
    },
    handleCompositionStart() {
      //表示正在写
      this.isComposing = true;
    },
    handleCompositionEnd(e) {
      if (this.isComposing) {
        this.isComposing = false;
        //handleCompositionEnd比handleInput后执行，避免isComposing还为true时handleInput无法执行正确逻辑
        this.handleInput(e);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.pw_input_cp {
  width: 100%;
}

.custem-input {
  padding-left: 57px !important;
}
.pw_input_cp::before {
  content: "";
  position: absolute;
  left: 27px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 20px;
  background: url("./lock.png") no-repeat center;
  background-size: 100% 100%;
}
</style>
