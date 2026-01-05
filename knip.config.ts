import type { KnipConfig } from "knip";

/**
 * Knip configuration.
 * @see https://knip.dev/overview/configuration
 */
const knipConfig: KnipConfig = {
  entry: ["src/routes/**/*.tsx", "src/router.tsx"],
  project: ["src/**/*.{ts,tsx,css}"],
  ignore: ["src/sw.ts", "src/routeTree.gen.ts"],
  ignoreDependencies: ["serwist"],
  ignoreExportsUsedInFile: true,
  tags: ["-knipignore"],
};

export default knipConfig;
