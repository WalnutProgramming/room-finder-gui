<template>
  <div style="margin-top: 1em;">
    <div class="input-group">
      <label for="hallwayPartType">Type of this hallway element</label>
      <select name="hallwayPartType" @input="changeRoomType">
        <option v-for="type in schemaTypes" :value="type" :key="type">{{
          type
        }}</option>
      </select>
    </div>
    <SchemaPartInput
      v-for="schemaPart in currentSchema.parts"
      :key="schemaPart.model"
      :schemaPart="schemaPart"
    />
    <button
      @click="deleteCurrentRoom"
      :disabled="!canDeleteRoom"
      class="input-group"
    >
      {{
        canDeleteRoom
          ? "Delete this room"
          : "(Only room in a hallway can't be deleted)"
      }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SchemaPartInput from "./SchemaPartInput.vue";
import { mapGetters, mapActions } from "vuex";
import { schemas } from "@/schemas";

export default Vue.extend({
  components: { SchemaPartInput },
  props: {
    roomIndex: Number,
  },
  computed: {
    ...mapGetters(["currentSchema", "canDeleteRoom"]),
    schemaTypes() {
      return schemas.map((s) => s.type);
    },
  },
  methods: {
    ...mapActions(["deleteCurrentRoom"]),
    changeRoomType(e: InputEvent) {
      this.$store.dispatch("changeRoomType", {
        newRoomType: (e.target as HTMLSelectElement).value,
      });
      this.$forceUpdate();
    },
  },
});
</script>

<style>
.input-group {
  margin-top: 1em;
}
</style>
