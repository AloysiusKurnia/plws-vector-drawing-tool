const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const SOURCE_CODE_URL = '<not set>'

module.exports = {
  entry: './src/ts/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        type: 'asset/source',
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
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
  },
};