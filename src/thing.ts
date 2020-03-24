import { parse, parseExpression } from "@babel/parser";
import generate from "@babel/generator";
import t from "@babel/types";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import prettier from "prettier/standalone";
import prettierTypeScript from "prettier/parser-typescript";
import code from "./code";

const p = parse(code, {
  plugins: ["typescript"],
  sourceType: "unambiguous",
});
const buildingThing = p.program.body.find(
  (thing) =>
    thing.type === "VariableDeclaration" &&
    thing.declarations[0].init?.type === "NewExpression" &&
    thing.declarations[0].init.callee.type === "Identifier" &&
    thing.declarations[0].init.callee.name === "Building"
) as t.VariableDeclaration;
console.log(buildingThing);
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
