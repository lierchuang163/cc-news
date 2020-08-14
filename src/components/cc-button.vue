<template>
  <div class="cc-btn" @click="handleClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style>
.cc-btn {
  text-align: center;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-radius: 25px;
  background-color: #cc3300;
  font-size: 20px;
  color: #f8e4dd;
}
</style>
