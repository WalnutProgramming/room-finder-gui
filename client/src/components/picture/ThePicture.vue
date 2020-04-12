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
    >
      <HallwayPicture
        v-for="(h, ind) in $store.state.building.hallways"
        :key="ind"
        :origmousex="mousex"
        :origmousey="mousey"
        :x="0"
        :y="ind * 30"
        :index="ind"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HallwayPicture from "./HallwayPicture.vue";

export default Vue.extend({
  data() {
    return {
      mousex: -1,
      mousey: -1,
      viewBoxOffset: { x: -3.125, y: -12.5 },
      dragging: false,
    };
  },
  methods: {
    mousemove(e: MouseEvent): void {
      const svg = this.$refs.s as SVGSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      if (pt.x != null && pt.y != null) {
        const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        if (this.dragging) {
          this.viewBoxOffset.x += this.mousex - x;
          this.viewBoxOffset.y += this.mousey - y;
        } else {
          this.mousex = x;
          this.mousey = y;
        }
      }
    },
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
