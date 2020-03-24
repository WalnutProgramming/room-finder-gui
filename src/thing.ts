import { parse, parseExpression } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import prettier from "prettier/standalone";
import prettierTypeScript from "prettier/parser-typescript";
import code from "./code";
import traverse from "@babel/traverse";

const opts: { plugins: ["typescript"]; sourceType: "unambiguous" } = {
  plugins: ["typescript"],
  sourceType: "unambiguous",
};

const p = parse(code, opts);
// const buildingThing = p.program.body.find(
//   (thing): thing is t.VariableDeclaration =>
//     t.isVariableDeclaration(thing) &&
//     t.isNewExpression(thing.declarations[0].init) &&
//     t.isIdentifier(thing.declarations[0].init.callee, { name: "Building" })
// );
// console.log(buildingThing);
// traverse(p, {
//   VariableDeclaration(path) {
//     if (
//       t.isNewExpression(path.node.declarations[0].init) &&
//       t.isIdentifier(path.node.declarations[0].init.callee, {
//         name: "Building",
//       })
//     ) {
//       console.log("hi");
//       console.log(path.node);
//     }
//   },
// });
traverse(p, {
  NewExpression(path) {
    console.log(path.node);
    if (
      t.isIdentifier(path.node.callee, { name: "Hallway" }) &&
      path.node.loc?.start.line === 53
    ) {
      path.node.callee.name = "sdf";
    }
  },
});
const newExpr = parseExpression("new Room('a')");
console.log(newExpr);
// buildingThing.declarations[0].init
const generated = generate(p, {
  retainLines: true,
  retainFunctionParens: true,
}).code;
const formatted = prettier.format(generated, {
  parser: "typescript",
  plugins: [prettierTypeScript],
});

console.log(p);
console.log(formatted);
