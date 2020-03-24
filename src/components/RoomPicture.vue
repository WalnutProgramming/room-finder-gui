<template>
  <g width="100%" height="100%">
    <rect
      class="rect"
      :height="p(rectHeight)"
      :width="p(rectWidth)"
      :x="p(x)"
      :y="p(y)"
    ></rect>
    <text
      :x="p(x + rectWidth / 2)"
      :y="p(y + rectHeight / 2)"
      :textLength="p((5.5 * rectWidth) / 5)"
      dominant-baseline="middle"
      text-anchor="middle"
      :style="{ fontSize: '' + fontSize + 'em' }"
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
  },
  computed: {
    rectHeight() {
      return 25;
    },
    y() {
      return this.bottom ? 75 : 0;
    },
    fontSize() {
      return Math.min(1.2, this.rectWidth / this.name.length);
    },
  },
  methods: {
    // percent
    p(n: number) {
      return `${n}%`;
    },
  },
  inheritAttrs: false,
});
</script>
