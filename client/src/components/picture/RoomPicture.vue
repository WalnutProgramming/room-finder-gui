<template>
  <g
    @click="$emit('click')"
    @mousedown="$emit('mousedown')"
    @mousemove="$emit('mousemove')"
    @mouseleave="$emit('mouseleave')"
  >
    <rect
      v-draw
      class="rect"
      :height="rectHeight"
      :width="tweenedRectWidth"
      :x="tweenedX"
      :y="y"
      :style="{ stroke: selected ? 'blue' : 'black' }"
    ></rect>
    <text
      :x="tweenedX + rectWidth / 2"
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
import { defineComponent, computed, toRefs } from "@vue/composition-api";
import { useTweened } from "@/composition";
import { draw } from "@/directives";

export default defineComponent({
  directives: { draw },
  props: {
    x: { type: Number, required: true },
    bottom: { type: Boolean, default: false },
    name: { String, default: "" },
    rectWidth: { type: Number, default: 5 },
    selected: { type: Boolean, default: false },
  },
  setup(props) {
    const rectHeight = computed(() => 6.25);
    const y = computed(() => (props.bottom ? 18.75 : 0));
    const fontSize = computed(() =>
      Math.min(1.2, props.rectWidth / props.name.length)
    );

    const { x, rectWidth } = toRefs(props);
    return {
      tweenedX: useTweened(x),
      tweenedRectWidth: useTweened(rectWidth),
      rectHeight,
      y,
      fontSize,
    };
  },
});
</script>
