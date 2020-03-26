import shortid from "shortid";

type SchemaPart = { model: string; label: string } & (
  | { type: "string"; defaultVal: string }
  | { type: "option"; options: string[] }
  | { type: "array"; defaultVal: string[] }
  | { type: "checkbox"; defaultVal: boolean }
  | { type: "number"; defaultVal: number }
);

type Schema = { type: string; parts: SchemaPart[] };

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
        label: "node ID",
        type: "string",
        defaultVal: "",
      },
      {
        model: "edgeLengthFromPreviousNodeInHallway",
        label: "Edge length from previous node in this hallway",
        type: "number",
        defaultVal: 1,
      },
    ],
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
        label: "node ID",
        type: "string",
        defaultVal: "",
      },
      {
        model: "edgeLengthFromPreviousNodeInHallway",
        label: "Edge length from previous node in this hallway",
        type: "number",
        defaultVal: 1,
      },
    ],
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
        label: "node ID",
        type: "string",
        defaultVal: "",
      },
      {
        model: "edgeLengthFromPreviousNodeInHallway",
        label: "Edge length from previous node in this hallway",
        type: "number",
        defaultVal: 1,
      },
    ],
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
