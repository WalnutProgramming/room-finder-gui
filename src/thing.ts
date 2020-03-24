import { parseExpression, parse } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import prettier from "prettier/standalone";
import prettierTypeScript from "prettier/parser-typescript";
import traverse, { NodePath } from "@babel/traverse";

export function getAst(code: string) {
  return parse(code, {
    plugins: ["typescript"],
    sourceType: "unambiguous",
  });
}

export function findHallwayWithLineNumber(
  p: t.File,
  lineNumber: number
): NodePath<t.ArrayExpression> | null {
  let ret: NodePath<t.ArrayExpression> | null = null;
  console.log(p);
  console.log(lineNumber);
  traverse(p, {
    NewExpression(path) {
      if (
        t.isIdentifier(path.node.callee, { name: "Hallway" }) &&
        path.node.loc?.start.line === lineNumber &&
        path.node.arguments.length > 0 &&
        t.isArrayExpression(path.node.arguments[0])
      ) {
        ret = path.get("arguments.0") as NodePath<t.ArrayExpression>;
      }
    },
  });
  return ret;
}

export function insertRoom(
  myRoomArray: NodePath<t.ArrayExpression>,
  n: number,
  isRight: boolean
) {
  myRoomArray.node.elements.splice(
    n,
    0,
    parseExpression(`new Room('z', ${isRight ? "RIGHT" : ""})`)
  );
}

export function getRoomsFromHallway(
  myRoomArray: NodePath<t.ArrayExpression>
): ({ side: number; name: string } | null)[] {
  return myRoomArray.node.elements.map((r) => {
    if (t.isNewExpression(r) && t.isIdentifier(r.callee, { name: "Room" })) {
      let side = -1;
      if (r.arguments.length >= 2) {
        if (
          t.isIdentifier(r.arguments[1], { name: "RIGHT" }) ||
          t.isIdentifier(r.arguments[1], { name: "Direction.RIGHT" })
        )
          side = 1;
        else if (
          !(
            t.isIdentifier(r.arguments[1], { name: "LEFT" }) ||
            t.isIdentifier(r.arguments[1], { name: "Direction.LEFT" })
          )
        )
          return null;
      }
      if (r.arguments.length > 0 && t.isStringLiteral(r.arguments[0])) {
        return { side, name: r.arguments[0].value };
      } else {
        return null;
      }
    }
    return null;
  });
}

export function getCode(p: t.File) {
  const generated = generate(p, {
    retainLines: true,
    retainFunctionParens: true,
  }).code;
  return prettier.format(generated, {
    parser: "typescript",
    plugins: [prettierTypeScript],
  });
}
