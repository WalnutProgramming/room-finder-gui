<template>
  <div>
    <svg
      @mousemove="mousemove"
      ref="s"
      @click="click"
      :viewBox="`${viewBoxOffset.x} ${viewBoxOffset.y} 0.1 50`"
      preserveAspectRatio="xMinYMid meet"
      @mousedown="dragging = true"
      @mouseup="dragging = false"
      @mouseleave="dragging = false"
    >
      <rect
        class="rect"
        :width="hallwayLength"
        height="12.5"
        x="0"
        y="6.25"
      ></rect>
      <g
        v-for="({ id, x, bottom, name, rectWidth }, index) in roomInfo"
        :key="id"
      >
        <RoomPicture
          :x="x"
          :bottom="bottom"
          :name="name"
          :selected="index === $store.state.currentRoomIndex"
          :rectWidth="rectWidth"
          @click="$store.dispatch('clickedRoom', { index })"
        />
      </g>
      <span />
      <g v-for="index in this.range(rooms.length + 1)" :key="index">
        <rect
          height="6.25"
          y="0"
          width="0.2"
          :x="lineX(index)"
          style="fill: blue;"
          v-show="addingRoom && mousey <= 12.5 && index === closestLineX"
        />
        <rect
          height="6.25"
          y="18.75"
          width="0.2"
          :x="lineX(index)"
          style="fill: blue;"
          v-show="addingRoom && mousey > 12.5 && index === closestLineX"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RoomPicture from "./RoomPicture.vue";
import { mapGetters, mapState } from "vuex";

export default Vue.extend({
  data() {
    return {
      mousex: -1,
      mousey: -1,
      viewBoxOffset: { x: -3.125, y: -12.5 },
      dragging: false,
    };
  },
  components: { RoomPicture },
  computed: {
    ...mapState(["addingRoom"]),
    ...mapGetters(["rooms"]),
    closestLineX(): number {
      const arr = this.range(this.rooms.length + 1).map((ind) =>
        Math.abs(this.lineX(ind) - this.mousex)
      );
      return arr.indexOf(Math.min(...arr));
    },
    isLeft(): boolean {
      return this.mousey <= 12.5;
    },
    roomInfo() {
      const ret: {
        name: string;
        x: number;
        bottom: boolean;
        id: string;
        rectWidth: number;
      }[] = [];
      let x = 2.2;
      for (const room of this.rooms) {
        const name = "name" in room ? room.name.trim() : "";
        const bottom =
          ("side" in room && room.side === "Right") ||
          ("direction" in room && room.direction === "Right");
        const id = room.id;
        ret.push({ name, x, bottom, id, rectWidth: 4 + name.length });
        x += 7 + name.length - 1;
      }
      return ret;
    },
    hallwayLength(): number {
      const { x, rectWidth } = this.roomInfo[this.roomInfo.length - 1];
      console.log({ x, rectWidth });
      return x + rectWidth + 2;
    },
  },
  methods: {
    mousemove(e: MouseEvent): void {
      const svg = this.$refs.s as SVGSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      if (this.dragging) {
        this.viewBoxOffset.x += this.mousex - x;
        this.viewBoxOffset.y += this.mousey - y;
      } else {
        this.mousex = x;
        this.mousey = y;
      }
    },
    lineX(index: number): number {
      if (index === this.roomInfo.length) {
        return this.hallwayLength - 1.1;
      } else {
        return this.roomInfo[index].x - 1.1;
      }
      // 3 + 7i
      // 1.9 + 7i
      // return 2 + 7 * index - 0.1;
      //1 => 8.9
      //2 => 15.9
    },
    click(): void {
      // this.$emit("newRoom", this.closestLineX, !this.isLeft);
      this.$store.dispatch("newRoom", {
        position: this.closestLineX,
        onRight: !this.isLeft,
      });
    },
    range(n: number): number[] {
      return [...Array(n).keys()];
    },
  },
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
</style>
