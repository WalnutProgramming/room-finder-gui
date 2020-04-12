<template>
  <div>
    <svg
      @mousemove="mousemove"
      ref="s"
      :viewBox="`${viewBoxOffset.x} ${viewBoxOffset.y} 0.1 50`"
      preserveAspectRatio="xMinYMid meet"
      @mousedown="dragging = true"
      @mouseup="dragging = false"
      @mouseleave="dragging = false"
      @keypress="$store.commit('addingRoom', false)"
    >
      <HallwayPicture
        v-for="(h, ind) in $store.state.building.hallways"
        :key="ind"
        :origmouse="mouse"
        :x="0"
        :y="ind * 30"
        :index="ind"
      />
      <rect
        v-if="$store.state.addingRoom && mouse != null"
        :x="mouse.x + 1"
        :y="mouse.y + 1"
        width="4"
        height="6.25"
        class="rect"
        :style="{ opacity: 0.5 }"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import HallwayPicture from "./HallwayPicture.vue";
import { defineComponent, ref, Ref } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const mouse: Ref<{ x: number; y: number } | null> = ref(null);
    const viewBoxOffset = ref({ x: -3.125, y: -12.5 });
    const dragging = ref(false);

    const s: Ref<null | SVGGraphicsElement> = ref(null);
    function mousemove(e: MouseEvent): void {
      const svg = s.value as SVGSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      if (pt.x != null && pt.y != null) {
        const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        if (dragging.value && mouse.value != null) {
          viewBoxOffset.value.x += mouse.value.x - x;
          viewBoxOffset.value.y += mouse.value.y - y;
        } else {
          mouse.value = { x, y };
        }
      }
    }

    return { mouse, viewBoxOffset, dragging, s, mousemove };
  },
  components: { HallwayPicture },
});
</script>

<style>
.rect {
  stroke: black;
  stroke-width: 0.1;
  fill: white;
}
text {
  text-align: center;
}
svg {
  /* width: 100;
  height: 20; */
  border: 1px solid black;
  height: 50vh;
  width: 100%;
  /* transform: scale(1, 0.5); */
}
svg text {
  user-select: none;
}
</style>
