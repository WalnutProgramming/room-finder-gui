<template>
  <div id="app">
    <Picture :rooms="rooms" />
    <p>Hi</p>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from "vue";
import Picture from "@/components/ThePicture.vue";
import { Room, Direction } from "room-finder";
import "./thing";

const { LEFT, RIGHT } = Direction;

export default Vue.extend({
  components: { Picture },
  computed: {
    rooms() {
      return [
        new Room("ajfk"),
        new Room("a", RIGHT),
        new Room("c", LEFT),
        new Room("djfaksjkdsfjaks"),
      ];
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
