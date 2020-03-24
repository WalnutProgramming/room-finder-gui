<template>
  <div id="app">
    <Picture :rooms="rooms" />
    <p>Hi</p>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Picture from "@/components/ThePicture.vue";
import "./thing";
import code from "./code";
import { parse } from "@babel/parser";

export default Vue.extend({
  components: { Picture },
  data() {
    return {
      theCode: code,
    };
  },
  computed: {
    ast() {
      const opts = {
        plugins: ["typescript"],
        sourceType: "unambiguous",
      };
      return parse(this.theCode, opts);
    },
  },
});

// console.log(parser.parsers);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
