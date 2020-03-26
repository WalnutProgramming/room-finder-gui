<template>
  <div class="input-group">
    <label :for="schemaPart.model">{{ schemaPart.label }}</label>
    <input
      :name="schemaPart.model"
      :id="schemaPart.model"
      v-model.number="inputValue"
      type="number"
      step="any"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: { schemaPart: Object },
  computed: {
    inputValue: {
      get(): string {
        return this.$store.getters.currentRoom[this.schemaPart.model];
      },
      set(newVal: string): void {
        this.$store.commit("setRoomField", {
          fieldName: this.schemaPart.model,
          newVal: newVal,
        });
      },
    },
  },
});
</script>
