<template>
  <div class="input-group">
    <label :for="schemaPart.model">{{ schemaPart.label }}</label>
    <select
      :name="schemaPart.model"
      :id="schemaPart.model"
      v-model="inputValue"
    >
      <option
        v-for="option in schemaPart.options"
        :value="option"
        :key="option"
        >{{ option }}</option
      >
    </select>
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
