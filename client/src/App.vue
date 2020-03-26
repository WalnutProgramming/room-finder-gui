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
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ThePicture from "@/components/ThePicture.vue";
import RoomEditor from "@/components/RoomEditor.vue";
import { mapState } from "vuex";
export default Vue.extend({
  components: { Picture: ThePicture, RoomEditor },
  computed: {
    ...mapState(["building", "failingToConnect", "addingRoom"]),
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
