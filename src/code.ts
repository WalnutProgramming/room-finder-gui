const code = `
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import {
  Direction,
  Room,
  Turn,
  Hallway,
  Stairs,
  Fork,
  SimpleHallway,
  Building,
  onFloor,
  reverseConnection,
} from "room-finder";

const { LEFT, RIGHT, FRONT } = Direction;

type StairNodeId =
  | "a"
  | "b"
  | "c"
  | "d"
  | "f"
  | "science a"
  | "music entrance to 1"
  | "music entrance to 2"
  | "arts a"
  | "arts b";

type ConnectionNodeId =
  | "1108 & 1105 to 1100s"
  | "1300s to 1600s"
  | "2300s to 2600s"
  | "2600s to arcade"
  | "2700s to arcade"
  | "music entrance to arcade"
  | "music 1 to music little corner"
  | "lobby to 2200s"
  | "lobby to 2240"
  | "alumni hall to 2200s"
  | "alumni hall to arcade"
  | "2500s to alumni hall"
  | "2500s to 2600s"
  | "2600s to 2600s little hallway"
  | "3500s corner to 3500s"
  | "2500s corner to 2500s"
  | "enter 2216"
  | "enter 2215"
  | "2100s to 2401"
  | "2404 to 2100s";

const b: Building = new Building<StairNodeId, ConnectionsNodeId>([
  new Hallway([
    new Room('a'),
    new Room("b", LEFT),
    // This is a comment
    new Room("c", RIGHT)
  ])
])
`;

export default code;
