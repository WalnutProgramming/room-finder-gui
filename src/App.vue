<template>
  <div>
    <div id="app">
      <Picture :rooms="rooms" @newRoom="insert" />
      <p>Hi</p>
      <button @click="insert(2)">insert 2</button>
    </div>
    <pre>{{ codeSample }}</pre>
  </div>
</template>

<script>
import Vue from "vue";
import Picture from "@/components/ThePicture.vue";
import {
  findHallwayWithLineNumber,
  insertRoom,
  getCode,
  getRoomsFromHallway,
  getAst,
} from "./thing";
import oldCode from "./code";

export default Vue.extend({
  components: { Picture },
  data() {
    return {
      ast: getAst(oldCode),
      lineNum: 53,
    };
  },
  computed: {
    theCode() {
      return getCode(this.ast);
    },
    hallway() {
      return findHallwayWithLineNumber(this.ast, this.lineNum);
    },
    rooms() {
      console.log(this.hallway);
      return getRoomsFromHallway(this.hallway);
    },
    codeSample() {
      const arr = this.theCode.split("\n");
      return arr.slice(arr.length - 15).join("\n");
    },
  },
  methods: {
    insert(n, isRight = false) {
      insertRoom(this.hallway, n, isRight);
    },
  },
});
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
