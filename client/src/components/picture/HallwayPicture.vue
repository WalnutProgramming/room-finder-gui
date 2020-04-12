<template>
  <g
    :transform="`translate(${x} ${y})`"
    @mouseenter="mouseInThisHallway = true"
    @mousemove="mouseInThisHallway = true"
    @mouseleave="mouseInThisHallway = false"
    @mouseup="click"
  >
    <!-- only purpose of this rect is to make it part of the click area -->
    <rect
      style="stroke: white; fill: white"
      :width="tweenedHallwayLength + 2"
      :height="12.5 + 6.25 * 2 + 2"
      x="-1"
      y="-1"
    ></rect>
    <rect
      v-draw
      class="rect"
      :width="tweenedHallwayLength"
      height="12.5"
      x="0"
      y="6.25"
    ></rect>
    <g
      v-for="({ id, x, bottom, name, rectWidth }, roomIndex) in roomInfo"
      :key="id"
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
          mouseDownOnRoom = false;
        "
        @mousedown="
          mouseDownOnRoom = true;
          $store.commit('allowPanning', false);
        "
        @mousemove="
          if (mouseDownOnRoom) {
            $store.dispatch('startDraggingRoom', {
              hallwayIndex: index,
              roomIndex,
            });
            mouseDownOnRoom = false;
          }
        "
        @mouseleave="
          mouseDownOnRoom = false;
          $store.commit('allowPanning', true);
        "
      />
    </g>
    <span />
    <g
      v-for="index in range(rooms.length + 1)"
      :key="index"
      v-show="addingRoom && mouseInThisHallway"
    >
      <rect
        height="6.25"
        y="0"
        width="0.2"
        :x="lineX(index)"
        style="fill: blue;"
        v-show="isLeft && index === closestLineX"
      />
      <rect
        height="6.25"
        y="18.75"
        width="0.2"
        :x="lineX(index)"
        style="fill: blue;"
        v-show="!isLeft && index === closestLineX"
      />
    </g>
  </g>
</template>

<script lang="ts">
import RoomPicture from "./RoomPicture.vue";
import { defineComponent, computed, Ref, ref } from "@vue/composition-api";
import { useState, useActions } from "vuex-composition-helpers";
import { useTweened, range } from "../../composition";
import { draw } from "@/directives";

export default defineComponent({
  directives: { draw },
  components: { RoomPicture },
  props: {
    origmouse: {
      type: Object as () => { x: number; y: number } | null,
    },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    index: { type: Number, required: true },
  },
  setup(props) {
    const mousePos = computed(() =>
      props.origmouse == null
        ? null
        : {
            x: props.origmouse.x - props.x,
            y: props.origmouse.y - props.y,
          }
    );
    const mouseInThisHallway = ref(false);
    const mouseDownOnRoom = ref(false);

    const { addingRoom, building, currentHallwayIndex } = useState([
      "addingRoom",
      "building",
      "currentHallwayIndex",
    ]) as {
      addingRoom: Ref<boolean>;
      building: Ref<any>;
      currentHallwayIndex: Ref<number>;
    };
    const rooms = computed(() => building.value.hallways[props.index].parts);
    const isCurrentHallway = computed(
      () => props.index === currentHallwayIndex.value
    );
    const roomInfo = computed(() => {
      const ret: {
        name: string;
        x: number;
        bottom: boolean;
        id: string;
        rectWidth: number;
      }[] = [];
      let x = 2.2;
      for (const room of rooms.value as any) {
        const name = "name" in room ? room.name.trim() : "";
        const bottom =
          ("side" in room && room.side === "Right") ||
          ("direction" in room && room.direction === "Right");
        const id = room.id;
        ret.push({ name, x, bottom, id, rectWidth: 4 + name.length });
        x += 7 + name.length - 1;
      }
      return ret;
    });
    const hallwayLength = computed(() => {
      const { x, rectWidth } = roomInfo.value[roomInfo.value.length - 1];
      return x + rectWidth + 2;
    });
    function lineX(index: number): number {
      return index === roomInfo.value.length
        ? hallwayLength.value - 1.1
        : roomInfo.value[index].x - 1.1;
    }
    const closestLineX = computed(() => {
      if (mousePos.value == null) return null;
      const arr = range(rooms.value.length + 1).map((ind) =>
        Math.abs(lineX(ind) - mousePos.value!.x)
      );
      return arr.indexOf(Math.min(...arr));
    });
    const isLeft = computed(() =>
      mousePos.value == null ? true : mousePos.value.y <= 12.5
    );

    const dispatch = useActions(["newRoom"]);
    function click(): void {
      dispatch.newRoom({
        position: closestLineX.value,
        onRight: !isLeft.value,
        hallwayIndex: props.index,
      });
    }
    return {
      tweenedHallwayLength: useTweened(hallwayLength),
      click,
      roomInfo,
      isCurrentHallway,
      range,
      rooms,
      lineX,
      addingRoom,
      closestLineX,
      isLeft,
      mouseInThisHallway,
      mouseDownOnRoom,
    };
  },
});
</script>
