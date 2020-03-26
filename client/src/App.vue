<template>
  <div>
    <div id="app">
      <Picture />
      <button @click="$store.commit('addingRoom', true)">Add room</button>
      <RoomEditor />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ThePicture from "@/components/ThePicture.vue";
import RoomEditor from "@/components/RoomEditor.vue";
export default Vue.extend({
  components: { Picture: ThePicture, RoomEditor },
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
