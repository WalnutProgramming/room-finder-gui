<template>
  <g @click="$emit('click')">
    <rect
      class="rect"
      :height="rectHeight"
      :width="rectWidth"
      :x="x"
      :y="y"
      :style="{ stroke: selected ? 'blue' : 'black' }"
    ></rect>
    <text
      :x="x + rectWidth / 2"
      :y="y + rectHeight / 2"
      dominant-baseline="middle"
      text-anchor="middle"
      :style="{ fontSize: '0.128em', fontFamily: 'monospace' }"
    >
      {{ name }}
    </text>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    x: Number,
    bottom: { type: Boolean, default: false },
    name: String,
    rectWidth: { type: Number, default: 5 },
    selected: { type: Boolean, default: false },
  },
  computed: {
    rectHeight() {
      return 6.25;
    },
    y() {
      return this.bottom ? 18.75 : 0;
    },
    fontSize() {
      return Math.min(1.2, this.rectWidth / this.name.length);
    },
  },
  inheritAttrs: false,
});
</script>
