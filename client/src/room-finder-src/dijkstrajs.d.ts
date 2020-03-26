declare module "dijkstrajs" {
  type Graph = { [key: string]: { [key: string]: number } };

  // eslint-disable-next-line @typescript-eslint/camelcase
  function find_path(graph: Graph, s: string, d: string): string[];
}
