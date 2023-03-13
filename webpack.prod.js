const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const SOURCE_CODE_URL = '<not set>';

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: { properties: true },
          format: {
            preamble: `/* Copyright (c) 2023 PseudoLW - Source code is available at ${SOURCE_CODE_URL} */`,
          }
        }
      }),
    ],
  }
});