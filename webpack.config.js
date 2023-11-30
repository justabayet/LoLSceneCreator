const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/empty.ts',
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets", to: "public/assets" },
                { from: "lib", to: "public/lib" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 9000,
      hot: true,
    }
};
