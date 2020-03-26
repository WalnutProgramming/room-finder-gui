<template>
  <div>
    <svg
      width="100%"
      height="50%"
      @mousemove="mousemove"
      ref="s"
      @click="click"
    >
      <rect class="rect" width="100%" height="50%" x="0%" y="25%"></rect>
      <g v-for="(room, index) in rooms" :key="room.id">
        <RoomPicture
          :x="roomX(index)"
          :bottom="
            ('side' in room && room.side === 'Right') ||
              ('direction' in room && room.direction === 'Right')
          "
          :name="'name' in room ? room.name : ''"
          :selected="index === $store.state.currentRoomIndex"
          @click="$store.dispatch('clickedRoom', { index })"
        />
      </g>
      <span />
      <g v-for="index in this.range(rooms.length + 1)" :key="index">
        <rect
          height="25%"
          y="0%"
          width="0.2%"
          :x="p(lineX(index))"
          style="fill: blue;"
          v-show="
            addingRoom && mousex >= 0 && mousey <= 50 && index === closestLineX
          "
        />
        <rect
          height="25%"
          y="75%"
          width="0.2%"
          :x="p(lineX(index))"
          style="fill: blue;"
          v-show="addingRoom && mousey > 50 && index === closestLineX"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RoomPicture from "@/components/RoomPicture.vue";
import { mapGetters, mapState } from "vuex";

export default Vue.extend({
  data() {
    return { mousex: -1, mousey: -1 };
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
      return this.mousey <= 50;
    },
  },
  methods: {
    mousemove(e: MouseEvent): void {
      const svg = this.$refs.s as SVGSVGElement;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
      this.mousex = (x / svg.getBBox().width) * 100;
      this.mousey = (y / svg.getBBox().height) * 100;
    },
    p(n: number): string {
      return `${n}%`;
    },
    roomX(index: number): number {
      return 3 + 7 * index;
    },
    lineX(index: number): number {
      return 2 + 7 * index - 0.1;
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
  stroke-width: 5;
  fill: white;
}
text {
  text-align: center;
}
svg {
  /* width: 100%;
  height: 20%; */
  border: 1px solid black;
}
</style>
