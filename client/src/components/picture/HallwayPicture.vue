<template>
  <g :transform="`translate(${x} ${y})`">
    <!-- only purpose of this rect is for @click -->
    <rect
      style="stroke: white; fill: white"
      :width="tweenedHallwayLength + 2"
      :height="12.5 + 6.25 * 2 + 2"
      x="-1"
      y="-1"
      @click="click"
    ></rect>
    <rect
      class="rect"
      :width="tweenedHallwayLength"
      height="12.5"
      x="0"
      y="6.25"
      @click="click"
    ></rect>
    <g
      v-for="({ id, x, bottom, name, rectWidth }, roomIndex) in roomInfo"
      :key="id"
      @click="click"
    >
      <RoomPicture
        :x="x"
        :bottom="bottom"
        :name="name"
        :selected="
          isCurrentHallway && roomIndex === $store.state.currentRoomIndex
        "
        :rectWidth="rectWidth"
        @click="
          $store.dispatch('clickedRoom', { hallwayIndex: index, roomIndex });
          click();
        "
      />
    </g>
    <span />
    <g v-for="index in range(rooms.length + 1)" :key="index">
      <rect
        height="6.25"
        y="0"
        width="0.2"
        :x="lineX(index)"
        style="fill: blue;"
        v-show="addingRoom && mousePos.y <= 12.5 && index === closestLineX"
        @click="click"
      />
      <rect
        height="6.25"
        y="18.75"
        width="0.2"
        :x="lineX(index)"
        style="fill: blue;"
        v-show="addingRoom && mousePos.y > 12.5 && index === closestLineX"
        @click="click"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import RoomPicture from "./RoomPicture.vue";
import { mapState } from "vuex";
import { gsap } from "gsap";

export default Vue.extend({
  components: { RoomPicture },
  props: {
    origmousex: Number,
    origmousey: Number,
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    index: Number,
  },
  data() {
    return { tweenedHallwayLength: 0 };
  },
  created() {
    this.tweenedHallwayLength = this.hallwayLength;
  },
  computed: {
    ...mapState(["addingRoom"]),
    rooms(): any[] {
      return this.$store.state.building.hallways[this.index].parts;
    },
    isCurrentHallway(): boolean {
      return this.index === this.$store.state.currentHallwayIndex;
    },
    mousePos(): { x: number; y: number } {
      return { x: this.origmousex - this.x, y: this.origmousey - this.y };
    },
    closestLineX(): number {
      const arr = this.range(this.rooms.length + 1).map((ind) =>
        Math.abs(this.lineX(ind) - this.mousePos.x)
      );
      return arr.indexOf(Math.min(...arr));
    },
    isLeft(): boolean {
      return this.mousePos.y <= 12.5;
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
      return x + rectWidth + 2;
    },
  },
  methods: {
    lineX(index: number): number {
      if (index === this.roomInfo.length) {
        return this.hallwayLength - 1.1;
      } else {
        return this.roomInfo[index].x - 1.1;
      }
    },
    click(): void {
      this.$store.dispatch("newRoom", {
        position: this.closestLineX,
        onRight: !this.isLeft,
        hallwayIndex: this.index,
      });
    },
    range(n: number): number[] {
      return [...Array(n).keys()];
    },
  },
  watch: {
    hallwayLength(newVal) {
      gsap.to(this.$data, { duration: 0.2, tweenedHallwayLength: newVal });
    },
  },
});
</script>
