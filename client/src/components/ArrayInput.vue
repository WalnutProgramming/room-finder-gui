<template>
  <div class="input-group">
    <label :for="schemaPart.model">{{
      schemaPart.label + " (separate with 2 semicolons (;;))"
    }}</label>
    <input
      :name="schemaPart.model"
      :id="schemaPart.model"
      v-model="inputValue"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: { schemaPart: Object },
  computed: {
    inputValue: {
      get(): string[] {
        return this.$store.getters.currentRoom[this.schemaPart.model].join(
          ";;"
        );
      },
      set(newVal: string): void {
        const splitted = newVal.split(";;");
        this.$store.commit("setRoomField", {
          fieldName: this.schemaPart.model,
          newVal: splitted.length === 1 && splitted[0] === "" ? [] : splitted,
        });
      },
    },
  },
});
</script>
