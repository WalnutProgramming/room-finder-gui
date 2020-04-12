<template>
  <g @click="$emit('click')">
    <rect
      class="rect"
      :height="rectHeight"
      :width="rectWidth"
      :x="tweenedX"
      :y="tweenedY"
      :style="{ stroke: selected ? 'blue' : 'black' }"
    ></rect>
    <text
      :x="tweenedX + rectWidth / 2"
      :y="tweenedY + rectHeight / 2"
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
import { gsap } from "gsap";
export default Vue.extend({
  props: {
    x: Number,
    bottom: { type: Boolean, default: false },
    name: String,
    rectWidth: { type: Number, default: 5 },
    selected: { type: Boolean, default: false },
  },
  data() {
    return { tweenedX: this.x, tweenedY: this.bottom ? 18.75 : 0 };
  },
  computed: {
    rectHeight(): number {
      return 6.25;
    },
    y(): number {
      return this.bottom ? 18.75 : 0;
    },
    fontSize(): number {
      return Math.min(1.2, this.rectWidth / this.name.length);
    },
  },
  watch: {
    x(newVal: number): void {
      gsap.to(this.$data, { duration: 0.2, tweenedX: newVal });
    },
    y(newVal: number): void {
      gsap.to(this.$data, { duration: 0.2, tweenedY: newVal });
    },
  },
  inheritAttrs: false,
});
</script>
