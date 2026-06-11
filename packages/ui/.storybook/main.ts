import type { StorybookConfig } from '@storybook/react-vite'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { mergeConfig } from 'vite'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-mcp'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: async (config) =>
    mergeConfig(config, {
      build: {
        chunkSizeWarningLimit: 2500,
        rolldownOptions: {
          checks: {
            pluginTimings: false,
          },
          output: {
            codeSplitting: {
              groups: [
                {
                  name: 'storybook-vendor-react',
                  test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                  priority: 30,
                },
                {
                  name: 'storybook-vendor-storybook',
                  test: /node_modules[\\/](@storybook|storybook)[\\/]/,
                  priority: 25,
                },
                {
                  name: 'storybook-vendor-charts',
                  test: /node_modules[\\/](recharts|d3-[^\\/]+)[\\/]/,
                  priority: 20,
                },
                {
                  name: 'storybook-vendor-ui',
                  test: /node_modules[\\/](lucide-react|@base-ui|@radix-ui|radix-ui)[\\/]/,
                  priority: 15,
                },
                {
                  name: 'storybook-vendor',
                  test: /node_modules[\\/]/,
                  priority: 10,
                  minSize: 50_000,
                },
              ],
            },
          },
        },
      },
    }),
}
export default config
