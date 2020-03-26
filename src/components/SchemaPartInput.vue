<template>
  <div>
    <component :is="componentType" :schemaPart="schemaPart" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import StringInput from "./StringInput.vue";
import OptionInput from "./OptionInput.vue";
import ArrayInput from "./ArrayInput.vue";
import CheckboxInput from "./CheckboxInput.vue";
import NumberInput from "./NumberInput.vue";

export default Vue.extend({
  components: {
    StringInput,
    OptionInput,
    ArrayInput,
    CheckboxInput,
    NumberInput,
  },
  props: { schemaPart: Object },
  computed: {
    componentType(): string {
      console.log(this.schemaPart.type);
      switch (this.schemaPart.type) {
        case "string":
          return "StringInput";
        case "option":
          return "OptionInput";
        case "array":
          return "ArrayInput";
        case "number":
          return "NumberInput";
        default:
          return "CheckboxInput";
      }
    },
  },
});
</script>
