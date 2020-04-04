<template>
  <div class="input-group">
    <input
      type="checkbox"
      :name="schemaPart.model"
      :id="schemaPart.model"
      v-model="inputValue"
    />
    <label :for="schemaPart.model">{{ schemaPart.label }}</label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: { schemaPart: Object },
  computed: {
    inputValue: {
      get(): boolean {
        return this.$store.getters.currentRoom[this.schemaPart.model];
      },
      set(newVal: boolean): void {
        this.$store.commit("setRoomField", {
          fieldName: this.schemaPart.model,
          newVal: newVal,
        });
      },
    },
  },
});
</script>
