import shortid from "shortid";
import {
  Room,
  Direction,
  reverseConnection,
  Fork,
  Stairs,
  onFloor,
  Turn,
  Hallway,
  Building,
} from "./room-finder-src";

type SchemaPart = { model: string; label: string } & (
  | { type: "string"; defaultVal: string }
  | { type: "option"; options: string[] }
  | { type: "array"; defaultVal: string[] }
  | { type: "checkbox"; defaultVal: boolean }
  | { type: "number"; defaultVal: number }
);

type Schema = {
  type: string;
  parts: SchemaPart[];
  toHallwayElement: (obj: any) => any;
};

export const schemas: Schema[] = [
  {
    type: "Room",
    parts: [
      {
        model: "name",
        label: "Room name",
        type: "string",
        defaultVal: "",
      },
      {
        model: "side",
        label: "Side of hallway",
        type: "option",
        options: ["Left", "Right"],
      },
      {
        model: "prefix",
        label: 'Room name prefix (e.g. "the", "room")',
        type: "string",
        defaultVal: "room",
      },
      {
        model: "aliases",
        label: "Aliases (other names) for this room",
        type: "array",
        defaultVal: [],
      },
    ],
    toHallwayElement({
      name,
      side,
      prefix,
      aliases,
    }: {
      name: string;
      side: string;
      prefix: string;
      aliases: string[];
    }) {
      return new Room(
        name === "" ? null : name,
        side === "Left" ? Direction.LEFT : Direction.RIGHT,
        {
          prefix,
          aliases,
        }
      );
    },
  },
  {
    type: "RoomWithNode",
    parts: [
      {
        model: "name",
        label: "Room name",
        type: "string",
        defaultVal: "",
      },
      {
        model: "side",
        label: "Side of hallway",
        type: "option",
        options: ["Left", "Right"],
      },
      {
        model: "prefix",
        label: 'Room name prefix (e.g. "the", "room")',
        type: "string",
        defaultVal: "room",
      },
      {
        model: "aliases",
        label: "Aliases (other names) for this room",
        type: "array",
        defaultVal: [],
      },
      {
        model: "nodeId",
        label: "Node ID",
        type: "string",
        defaultVal: "",
      },
      {
        model: "isReverseConnection",
        label: "Is this a reversed connection?",
        type: "checkbox",
        defaultVal: false,
      },
      {
        model: "edgeLengthFromPreviousNodeInHallway",
        label: "Edge length from previous node in this hallway",
        type: "number",
        defaultVal: 1,
      },
    ],
    toHallwayElement({
      name,
      side,
      prefix,
      aliases,
      nodeId,
      isReverseConnection,
      edgeLengthFromPreviousNodeInHallway,
    }: {
      name: string;
      side: string;
      prefix: string;
      aliases: string[];
      nodeId: string;
      isReverseConnection: boolean;
      edgeLengthFromPreviousNodeInHallway: number;
    }) {
      return new Room(
        name === "" ? null : name,
        side === "Left" ? Direction.LEFT : Direction.RIGHT,
        {
          prefix,
          aliases,
          nodeId: isReverseConnection ? reverseConnection(nodeId) : nodeId,
          edgeLengthFromPreviousNodeInHallway,
        }
      );
    },
  },
  {
    type: "Fork",
    parts: [
      {
        model: "side",
        label: "Side of hallway",
        type: "option",
        options: ["Left", "Right"],
      },
      {
        model: "destinationName",
        label: "Destination name",
        type: "string",
        defaultVal: "",
      },
      {
        model: "nodeId",
        label: "Node ID",
        type: "string",
        defaultVal: "",
      },
      {
        model: "isReverseConnection",
        label: "Is this a reversed connection?",
        type: "checkbox",
        defaultVal: false,
      },
      {
        model: "edgeLengthFromPreviousNodeInHallway",
        label: "Edge length from previous node in this hallway",
        type: "number",
        defaultVal: 1,
      },
    ],
    toHallwayElement({
      side,
      destinationName,
      nodeId,
      isReverseConnection,
      edgeLengthFromPreviousNodeInHallway,
    }: {
      side: string;
      destinationName: string;
      nodeId: string;
      isReverseConnection: boolean;
      edgeLengthFromPreviousNodeInHallway: number;
    }) {
      return new Fork(
        side === "Left" ? Direction.LEFT : Direction.RIGHT,
        isReverseConnection ? reverseConnection(nodeId) : nodeId,
        destinationName,
        edgeLengthFromPreviousNodeInHallway
      );
    },
  },
  {
    type: "Stairs",
    parts: [
      {
        model: "side",
        label: "Side of hallway",
        type: "option",
        options: ["Left", "Right"],
      },
      {
        model: "stairName",
        label: "Name of stairs",
        type: "string",
        defaultVal: "",
      },
      {
        model: "nodeId",
        label: "Node ID",
        type: "string",
        defaultVal: "",
      },
      {
        model: "floor",
        label: "Floor number",
        type: "number",
        defaultVal: 1,
      },
      {
        model: "edgeLengthFromPreviousNodeInHallway",
        label: "Edge length from previous node in this hallway",
        type: "number",
        defaultVal: 1,
      },
    ],
    toHallwayElement({
      side,
      stairName,
      nodeId,
      floor,
      edgeLengthFromPreviousNodeInHallway,
    }: {
      side: string;
      stairName: string;
      nodeId: string;
      floor: number;
      edgeLengthFromPreviousNodeInHallway: number;
    }) {
      return new Stairs(
        side === "Left" ? Direction.LEFT : Direction.RIGHT,
        onFloor(nodeId, floor),
        stairName,
        edgeLengthFromPreviousNodeInHallway
      );
    },
  },
  {
    type: "Turn",
    parts: [
      {
        model: "side",
        label: "Direction of turn",
        type: "option",
        options: ["Left", "Right"],
      },
    ],
    toHallwayElement({ side }: { side: string }) {
      return new Turn(side === "Left" ? Direction.LEFT : Direction.RIGHT);
    },
  },
];

type HallwaySchema = {
  type: string;
  toHallway: (
    rooms: (Room<string> | Stairs<string> | Turn)[]
  ) => Hallway<string, string>;
};

const hallwaySchemas: HallwaySchema[] = [
  {
    type: "Hallway",
    toHallway(rooms: (Room<string> | Stairs<string> | Turn)[]) {
      return new Hallway(rooms);
    },
  },
];

function getInitialModelFromParts(parts: SchemaPart[]) {
  const ret: { [key: string]: any } = {};
  for (const part of parts) {
    if (part.type === "option") {
      ret[part.model] = part.options[0];
    } else {
      ret[part.model] = part.defaultVal;
    }
  }
  return ret;
}

export function getInitialModel(type: string) {
  return {
    ...getInitialModelFromParts(schemas.find((s) => s.type === type)!.parts),
    type,
    id: shortid.generate(),
  };
}

function getRoomSchema({ type }: { type: string }) {
  return schemas.find((s) => s.type === type)!;
}

function getHallwaySchema({ type }: { type: string }) {
  return hallwaySchemas.find((s) => s.type === type)!;
}

export function getBuilding({ hallways }: any): Building | null {
  let b: Building | null;
  b = new Building(
    hallways.map((h: any) => {
      const f = getHallwaySchema(h).toHallway;
      const rooms = h.parts.map((r: any) => {
        const fRoom = getRoomSchema(r).toHallwayElement;
        return fRoom(r);
      });
      return f(rooms);
    })
  );
  return b;
}
