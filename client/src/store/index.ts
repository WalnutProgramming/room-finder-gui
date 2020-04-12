import Vue from "vue";
import Vuex from "vuex";
import { schemas, getInitialModel, getBuilding } from "@/schemas";
import axios from "axios";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    building: {
      type: "Building",
      hallways: [
        {
          type: "Hallway",
          parts: [
            { ...getInitialModel("Room"), name: "a", side: "Left" },
            { ...getInitialModel("Room"), name: "b", side: "Right" },
            { ...getInitialModel("Room"), name: "c", side: "Right" },
          ],
        },
        {
          type: "Hallway",
          parts: [
            { ...getInitialModel("Room"), name: "d", side: "Left" },
            { ...getInitialModel("Room"), name: "e", side: "Right" },
            { ...getInitialModel("Room"), name: "f", side: "Right" },
          ],
        },
      ],
    },
    currentHallwayIndex: 0,
    currentRoomIndex: 0,
    addingRoom: false,
    failingToConnect: false,
    draggedRoom: getInitialModel("Room") as any,
    positionOfRoomBeingDragged: null as null | {
      hallwayIndex: number;
      roomIndex: number;
    },
    allowPanning: true,
  },
  strict: process.env.NODE_ENV !== "production",
  getters: {
    currentHallway: ({ building: { hallways }, currentHallwayIndex }) =>
      hallways[currentHallwayIndex],
    currentRooms: (_, { currentHallway }) => currentHallway.parts,
    currentRoom: ({ currentRoomIndex }, { currentRooms }) =>
      currentRooms[currentRoomIndex],
    currentSchema: (_, { currentRoom: { type } }) =>
      schemas.find((s) => s.type === type),
    canDeleteRoom: (_, { currentRooms }) => currentRooms.length > 1,
    roomFinderBuilding: ({ building }) => getBuilding(building),
  },
  mutations: {
    insertRoom(
      { building: { hallways }, draggedRoom },
      {
        position,
        onRight,
        hallwayIndex,
      }: { position: number; onRight: boolean; hallwayIndex: number }
    ) {
      draggedRoom.side = onRight ? "Right" : "Left";
      hallways[hallwayIndex].parts.splice(position, 0, draggedRoom);
    },
    generateNewRoom(state) {
      state.draggedRoom = getInitialModel("Room") as any;
    },
    setDraggedRoom(state, newVal) {
      state.draggedRoom = newVal;
    },
    positionOfRoomBeingDragged(state, newVal) {
      state.positionOfRoomBeingDragged = newVal;
    },
    allowPanning(state, newVal) {
      state.allowPanning = newVal;
    },
    switchCurrentRoomIndex(
      state,
      { hallwayIndex, roomIndex }: { hallwayIndex: number; roomIndex: number }
    ) {
      state.currentHallwayIndex = hallwayIndex;
      state.currentRoomIndex = roomIndex;
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
    adjustCurrentIndexAfterDelete(state) {
      if (
        state.currentRoomIndex ===
        state.building.hallways[state.currentHallwayIndex].parts.length
      ) {
        state.currentRoomIndex -= 1;
      }
    },
    replaceBuilding(state, newBuilding) {
      state.building = newBuilding;
    },
    setFailingToConnect(state, isFailing) {
      state.failingToConnect = isFailing;
    },
  },
  actions: {
    newRoom(
      { commit, state },
      {
        position,
        onRight,
        hallwayIndex,
      }: { position: number; onRight: boolean; hallwayIndex: number }
    ) {
      if (state.addingRoom) {
        commit("insertRoom", { position, onRight, hallwayIndex });
        commit("switchCurrentRoomIndex", { hallwayIndex, roomIndex: position });
        commit("addingRoom", false);
        commit("positionOfRoomBeingDragged", null);
        commit("generateNewRoom");
        commit("allowPanning", true);
      }
    },
    startDraggingRoom(
      { commit, state: { building } },
      { hallwayIndex, roomIndex }
    ) {
      commit(
        "setDraggedRoom",
        building.hallways[hallwayIndex].parts[roomIndex]
      );
      commit("addingRoom", true);
      commit("switchCurrentRoomIndex", { hallwayIndex, roomIndex });
      commit("deleteCurrentRoom");
      commit("adjustCurrentIndexAfterDelete");
      commit("positionOfRoomBeingDragged", { hallwayIndex, roomIndex });
    },
    draggedOntoNothing({ state, dispatch }) {
      if (state.positionOfRoomBeingDragged != null) {
        dispatch("newRoom", {
          hallwayIndex: state.positionOfRoomBeingDragged.hallwayIndex,
          position: state.positionOfRoomBeingDragged.roomIndex,
          onRight: state.draggedRoom.side === "Right",
        });
      }
    },
    clickedRoom(
      { commit, state },
      { hallwayIndex, roomIndex }: { roomIndex: number; hallwayIndex: number }
    ) {
      if (!state.addingRoom) {
        commit("switchCurrentRoomIndex", { hallwayIndex, roomIndex });
      }
    },
    changeRoomType({ commit, getters }, { newRoomType }) {
      const oldModel = getters.currentRoom;
      if (oldModel.type !== newRoomType) {
        const initialModel = getInitialModel(newRoomType);
        for (const [k, v] of Object.entries(oldModel)) {
          if (k !== "type" && Object.keys(initialModel).includes(k)) {
            (initialModel as any)[k] = v;
          }
        }
        commit("replaceCurrentRoom", initialModel);
      }
    },
    deleteCurrentRoom({ commit, getters }) {
      if (getters.canDeleteRoom) {
        commit("deleteCurrentRoom");
        commit("adjustCurrentIndexAfterDelete");
      }
    },
    getBuilding({ commit }) {
      axios
        .get("/building.json", { timeout: 1000 })
        .then(({ data }) => {
          commit("replaceBuilding", data);
          commit("setFailingToConnect", false);
        })
        .catch(() => {
          commit("setFailingToConnect", true);
          // setTimeout(() => dispatch("getBuilding"), 500);
        });
    },
    setBuilding({ state, commit }) {
      axios
        .post("/setbuilding", state.building, { timeout: 1000 })
        .then(() => {
          commit("setFailingToConnect", false);
        })
        .catch(() => {
          commit("setFailingToConnect", true);
          // setTimeout(() => dispatch("setBuilding"), 500);
        });
    },
  },
  modules: {},
});

store.dispatch("getBuilding");

export default store;
