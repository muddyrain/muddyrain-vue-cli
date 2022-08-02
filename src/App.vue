<script setup>
import { ref } from "vue";

const msg = ref("我是message11111 -> 我来自 vue的ref");
</script>

<template>
  {{ msg }}
</template>

<style lang="scss">
body {
  background-image: url("./1.jpg");
}
</style>
