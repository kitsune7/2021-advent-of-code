import { DayFunction } from "../utilities";

const dayFunction: DayFunction = (input: string[]) => {
  const nodes: Record<string, string[]> = {};

  input.forEach((line) => {
    const [nodeA, nodeB] = line.split("-");
    if (!nodes?.[nodeA]) nodes[nodeA] = [];
    if (!nodes?.[nodeB]) nodes[nodeB] = [];

    if (!nodes[nodeA].includes(nodeB)) nodes[nodeA].push(nodeB);
    if (!nodes[nodeB].includes(nodeA)) nodes[nodeB].push(nodeA);
  });

  const paths = new Set();

  let stack = ["start"];
  const visited = new Set();

  findPath("start");
  function findPath(currentNode: string) {
    if (currentNode === "end") {
      paths.add(stack.join(","));
      return;
    }

    visited.clear();
    stack.forEach((node) => visited.add(node));
    const visitableNodes = nodes[currentNode].filter(
      (node) => !visited.has(node) || node === node.toUpperCase()
    );

    visitableNodes.forEach((node) => {
      stack.push(node);
      findPath(node);
      stack.pop();
    });
  }

  console.log("PATHS:");
  paths.forEach((path) => console.log(path));

  return paths.size;
};

export default dayFunction;
