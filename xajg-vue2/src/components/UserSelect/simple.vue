<template>
  <div>
    <el-input
      v-model="formData.applyUser"
      placeholder="请选择申请人"
      readonly
      @click.native="showPerson()"
    >
      <i
        slot="suffix"
        class="el-icon-circle-close pointer"
        @click.stop="clearEvt('person')"
      />
    </el-input>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
