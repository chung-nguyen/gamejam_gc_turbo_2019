var path = require('path');
var webpack = require('webpack');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

console.log(process.env.NODE_ENV);

module.exports = {
    entry: './source/app.js',
    output: {
        path: __dirname,
        filename: "_dist/bundle.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ["es2015"],
                    plugins: ["babel-plugin-syntax-flow", "babel-plugin-transform-flow-strip-types", 'transform-class-properties', 'transform-runtime']
                }
            }
        ]
    },
    resolve: {
        alias: {
            config: path.join(__dirname, 'source', 'config', process.env.NODE_ENV)
        }
    },
    devtool: 'source-map',
    watch: !!process.env.NODE_ENV.match(/development/i)
};
