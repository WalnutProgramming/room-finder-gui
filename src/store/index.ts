import Vue from "vue";
import Vuex from "vuex";
import { schemas, getInitialModel } from "@/schemas";

Vue.use(Vuex);

const initialRoom = getInitialModel("Room") as any;
console.log(initialRoom);

export default new Vuex.Store({
  state: {
    building: {
      type: "Building",
      hallways: [
        {
          type: "Hallway",
          parts: [
            { ...(getInitialModel("Room") as any), name: "a", side: "Left" },
            { ...(getInitialModel("Room") as any), name: "b", side: "Right" },
            { ...(getInitialModel("Room") as any), name: "c", side: "Right" },
          ],
        },
      ],
    },
    currentHallwayIndex: 0,
    currentRoomIndex: 0,
    addingRoom: false,
  },
  strict: process.env.NODE_ENV !== "production",
  getters: {
    currentHallway: ({ building: { hallways }, currentHallwayIndex }) =>
      hallways[currentHallwayIndex],
    rooms: (_, { currentHallway }) => currentHallway.parts,
    currentRoom: ({ currentRoomIndex }, { rooms }) => rooms[currentRoomIndex],
    currentSchema: (_, { currentRoom: { type } }) =>
      schemas.find((s) => s.type === type),
    canDeleteRoom: (_, { rooms }) => rooms.length > 1,
  },
  mutations: {
    insertRoom(
      { building: { hallways }, currentHallwayIndex },
      { position, onRight }: { position: number; onRight: boolean }
    ) {
      const newRoom = getInitialModel("Room") as any;
      newRoom.side = onRight ? "Right" : "Left";
      console.log(newRoom);
      hallways[currentHallwayIndex].parts.splice(position, 0, newRoom);
    },
    switchCurrentRoomIndex(state, { newIndex }: { newIndex: number }) {
      state.currentRoomIndex = newIndex;
    },
    setRoomField(
      { building: { hallways }, currentHallwayIndex, currentRoomIndex },
      { fieldName, newVal }: { fieldName: string; newVal: any }
    ) {
      Vue.set(
        hallways[currentHallwayIndex].parts[currentRoomIndex] as any,
        fieldName,
        newVal
      );
    },
    addingRoom(state, newVal) {
      state.addingRoom = newVal;
    },
    replaceCurrentRoom(
      { building: { hallways }, currentHallwayIndex, currentRoomIndex },
      newVal
    ) {
      Vue.set(hallways[currentHallwayIndex].parts, currentRoomIndex, newVal);
    },
    deleteCurrentRoom({
      building: { hallways },
      currentHallwayIndex,
      currentRoomIndex,
    }) {
      hallways[currentHallwayIndex].parts.splice(currentRoomIndex, 1);
    },
  },
  actions: {
    newRoom(
      { commit, state },
      { position, onRight }: { position: number; onRight: boolean }
    ) {
      if (state.addingRoom) {
        commit("insertRoom", { position, onRight });
        commit("switchCurrentRoomIndex", { newIndex: position });
        commit("addingRoom", false);
      }
    },
    clickedRoom({ commit, state }, { index }: { index: number }) {
      if (!state.addingRoom) {
        commit("switchCurrentRoomIndex", { newIndex: index });
      }
    },
    changeRoomType({ commit, getters }, { newRoomType }) {
      const oldModel = getters.currentRoom;
      if (oldModel.type !== newRoomType) {
        const initialModel = getInitialModel(newRoomType);
        for (const [k, v] of Object.entries(oldModel)) {
          if (k in Object.keys(initialModel)) {
            (initialModel as any)[k] = v;
          }
        }
        commit("replaceCurrentRoom", initialModel);
      }
    },
    deleteCurrentRoom({ commit, getters }) {
      if (getters.canDeleteRoom) {
        commit("deleteCurrentRoom");
      }
    },
  },
  modules: {},
});
