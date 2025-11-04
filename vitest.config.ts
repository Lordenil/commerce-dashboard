import { mergeConfig, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";
import type { UserConfig } from "vite";

const config = viteConfig as UserConfig;

export default mergeConfig(
  config,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./vitest.setup.js",
      reporters: ["default"],
      coverage: {
        enabled: true,
        provider: "istanbul",
        exclude: [
          "**/node_modules/**",
          "**/dist/**",
          "**/cypress/**",
          "**/.{idea,git,cache,output,temp}/**",
          "**/*.{test,spec}.?(c|m)[jt]s?(x)",
          "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
          "e2e/**",
          "src/main.tsx",
          "src/**/index.ts",
          "src/App.tsx",
          "src/**/redux.ts",
          "src/config/**",
          "**/public/**",
          "test/**",
        ],
        reportsDirectory: "./coverage",
        reporter: ["text", "lcov"],
      },
    },
  })
);
