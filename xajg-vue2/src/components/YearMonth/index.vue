<template>
  <div class="YearMonth">
    <el-date-picker
      ref="year"
      v-model="year"
      type="year"
      format="yyyy年"
      :picker-options="dateButton"
      :clearable="false"
      popper-class="YearMonthPopper"
      :append-to-body="false"
      @change="yearChange"
    />
    <el-date-picker
      ref="month"
      v-model="month"
      :append-to-body="false"
      type="month"
      format="-MM月"
      @change="monthChange"
    />
  </div>
</template>
<script>
export default {
  name: 'YearMonth',
  data() {
    return {
      year: new Date(),
      month: new Date()
    }
  },
  computed: {
    dateButton() {
      const that = this
      return {
        shortcuts: [
          {
            text: '选择月',
            onClick(picker) {
              // picker.visible = false
              that.$refs.year.pickerVisible = false
              that.month = that.year
              that.$refs.month.showPicker()
            }
          },
          {
            text: '确定',
            onClick(picker) {
              that.$refs.year.pickerVisible = false
              that.yearChange(picker.date)
            }
          }
        ]
      }
    }
  },
  methods: {
    /**
     * @description 年分切换
     * @param {Date} date
     */
    yearChange(date) {
      this.year = date
      this.month = ''
      this.$emit('dateChange', String(date.getFullYear()))
    },
    /**
     * @description 月份切换
     * @param {String} date
     */
    monthChange(date) {
      if (date) {
        this.year = date
        this.$emit(
          'dateChange',
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}`
        )
      } else {
        this.month = ''
        this.$emit('dateChange', `${this.year.getFullYear()}`)
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
.YearMonth {
  display: inline-block;
  .el-date-editor--year {
    width: 58px;
    /deep/input {
      padding: 0 0 0 8px;
      border-right: none;
      border-radius: 4px 0 0 4px;
      &:focus {
        border-color: #dcdfe6;
      }
    }
    /deep/.el-input__prefix {
      display: none;
    }
  }

  .el-date-editor--month {
    width: 70px;
    /deep/input {
      padding: 0;
      border-left: none;
      border-radius: 0 4px 4px 0;
      &:focus {
        border-color: #dcdfe6;
      }
    }
    /deep/.el-input__prefix {
      display: none;
    }
  }
}
</style>
<style lang="scss">
.YearMonthPopper {
  width: 322px !important;
  .el-picker-panel__sidebar {
    left: 0;
    right: 0;
    width: 100%;
    bottom: 0;
    height: 38px;
    padding: 4px;
    top: auto;
    border-top: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      display: inline-block;
      width: auto;
      // font-size: 12px;
      height: 100%;
    }
    button:first-child {
      color: #409eff;
    }
    button:last-child {
      color: #fff;
      background-color: #409eff;
      border-color: #409eff;
      margin-left: 10px;
      padding: 7px 15px;
      outline: none;
      vertical-align: middle;
      font-size: 12px;
      border-radius: 3px;
      cursor: pointer;
      font-weight: 500;
      box-sizing: border-box;
      line-height: normal;
    }
  }
  .el-picker-panel__body {
    margin-left: 0;
    margin-bottom: 38px;
  }
}
</style>
  