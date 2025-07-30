import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    if (config.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': resolve(__dirname, '../src'),
        '@components': resolve(__dirname, '../src/components'),
        '@lib': resolve(__dirname, '../src/lib'),
        '@styles': resolve(__dirname, '../src/styles'),
        '@tests': resolve(__dirname, '../tests'),
        '@contexts': resolve(__dirname, '../src/contexts'),
        '@app': resolve(__dirname, '../src/app'),
        '@types': resolve(__dirname, '../src/types'),
        '@data': resolve(__dirname, '../src/data'),
        '@services': resolve(__dirname, '../src/services'),
        '@utils': resolve(__dirname, '../src/utils'),
      };
    }
    return config;
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
