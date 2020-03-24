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
      <g v-for="(room, index) in rooms">
        <RoomPicture
          :x="roomX(index)"
          :bottom="room.side === 1"
          :name="room.name"
        />
      </g>
      <span />
      <g v-for="index in this.range(rooms.length + 1)">
        <rect
          height="25%"
          y="0%"
          width="0.2%"
          :x="p(lineX(index))"
          style="fill: blue;"
          v-show="mousey > 0 && mousey <= 50 && index === closestLineX"
        />
        <rect
          height="25%"
          y="75%"
          width="0.2%"
          :x="p(lineX(index))"
          style="fill: blue;"
          v-show="mousey > 50 && mousey <= 100 && index === closestLineX"
        />
      </g>
    </svg>
  </div>
</template>

<script>
import Vue from "vue";
import RoomPicture from "@/components/RoomPicture.vue";

export default Vue.extend({
  props: {
    rooms: Array,
  },
  data() {
    return { mousex: -1, mousey: -1 };
  },
  components: { RoomPicture },
  computed: {
    closestLineX() {
      const arr = this.range(this.rooms.length + 1).map((ind) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        Math.abs(this.lineX(ind) - this.mousex)
      );
      return arr.indexOf(Math.min(...arr));
    },
    isLeft() {
      return this.mousey <= 50;
    },
  },
  methods: {
    mousemove(e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const svg = this.$refs.s;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
      this.mousex = (x / svg.getBBox().width) * 100;
      this.mousey = (y / svg.getBBox().height) * 100;
    },
    p(n) {
      return `${n}%`;
    },
    roomX(index) {
      return 3 + 7 * index;
    },
    lineX(index) {
      return 2 + 7 * index - 0.1;
    },
    click() {
      this.$emit("newRoom", this.closestLineX, !this.isLeft);
    },
    range(n) {
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
