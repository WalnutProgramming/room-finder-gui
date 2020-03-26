<template>
  <div>
    <div id="app">
      <Picture />
      <p v-show="addingRoom">Click where you want to add a room</p>
      <button v-if="!addingRoom" @click="$store.commit('addingRoom', true)">
        Add room
      </button>
      <button v-else @click="$store.commit('addingRoom', false)">Cancel</button>
      <RoomEditor />
      <p v-if="failingToConnect">
        Failing to send/receive data from server!
      </p>

      <div style="margin-top: 4em">
        <h4>Directions preview</h4>
        <div><label>From: </label><input v-model="from" /></div>
        <div><label>To: </label><input v-model="to" /></div>
        <pre>{{ directions }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ThePicture from "@/components/ThePicture.vue";
import RoomEditor from "@/components/RoomEditor.vue";
import { mapState } from "vuex";
import { Building } from "./room-finder-src";
export default Vue.extend({
  components: { Picture: ThePicture, RoomEditor },
  data() {
    return { from: "", to: "" };
  },
  computed: {
    ...mapState(["building", "failingToConnect", "addingRoom"]),
    directions(): string {
      const b: Building = this.$store.getters.roomFinderBuilding;
      return b.getDirections(this.from, this.to) ?? "invalid";
    },
  },
  watch: {
    building: {
      handler() {
        this.$store.dispatch("setBuilding");
      },
      deep: true,
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
