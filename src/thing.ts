import { parse, parseExpression } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import prettier from "prettier/standalone";
import prettierTypeScript from "prettier/parser-typescript";
import code from "./code";
import traverse, { NodePath } from "@babel/traverse";

const opts: { plugins: ["typescript"]; sourceType: "unambiguous" } = {
  plugins: ["typescript"],
  sourceType: "unambiguous",
};

const p = parse(code, opts);
let myRoomArray: NodePath<t.ArrayExpression> | undefined = undefined;
export function findHallwayWithLineNumber(lineNumber: number) {
  traverse(p, {
    NewExpression(path) {
      // // console.log(path.node);
      if (
        t.isIdentifier(path.node.callee, { name: "Hallway" }) &&
        path.node.loc?.start.line === lineNumber &&
        path.node.arguments.length > 0 &&
        t.isArrayExpression(path.node.arguments[0]) &&
        path.node.arguments[0].elements.every((a): a is t.NewExpression =>
          t.isNewExpression(a)
        )
      ) {
        path.node.callee.name = "sdf";
        myRoomArray = path.get("arguments.0") as NodePath<t.ArrayExpression>;
      }
    },
  });
}
findHallwayWithLineNumber(53);
function insertRoom(n: number) {
  if (myRoomArray != null) {
    // console.log("a");
    // console.log(myRoomArray);
    // console.log(myRoomArray.get("elements"));
    // console.log(myRoomArray.get(`elements.${n}`));
    // console.log("b");
    // (myRoomArray.get(`elements[${n - 1}]`) as NodePath<
    //   t.NewExpression
    // >).insertAfter(parseExpression("new Room('a')"));
    myRoomArray.node.elements.splice(n, 0, parseExpression("new Room('z')"));
    // console.log(myRoomArray.node);
    // console.log("c");
    // console.log(p.program);
  }
}
insertRoom(2);
// console.log(myRoomArray);
// buildingThing.declarations[0].init
const generated = generate(p, {
  retainLines: true,
  retainFunctionParens: true,
}).code;
const formatted = prettier.format(generated, {
  parser: "typescript",
  plugins: [prettierTypeScript],
});

// console.log(p);
console.log(formatted);
