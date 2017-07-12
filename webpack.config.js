const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'script' : './src/index.plugins.js',
        'default': './src/scss/default.plugins.scss',
        'dark'   : './src/scss/dark.plugins.scss'
    },

    output: {
        filename     : 'js/query-builder.[name].js',
        path         : path.resolve(__dirname, 'dist'),
        library      : 'jQuery-QueryBuilder',
        libraryTarget: 'umd'
    },

    externals: {
        'jquery'          : {
            commonjs : 'jquery',
            commonjs2: 'jquery',
            amd      : 'jquery',
            root     : 'jQuery'
        },
        'jquery-extendext': {
            commonjs : 'jquery-extendext',
            commonjs2: 'jquery-extendext',
            amd      : 'jquery-extendext',
            root     : 'jQuery'
        },
        'dot/doT'         : {
            commonjs : 'dot/doT',
            commonjs2: 'dot/doT',
            amd      : 'dot/doT',
            root     : 'doT'
        }
    },

    devtool: 'cheap-module-source-map',

    module: {
        rules: [
            {
                test: /\.scss$/,
                use : ExtractTextPlugin.extract({
                    use     : [
                        {
                            loader : 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize : true
                            }
                        },
                        {
                            loader : 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    // use style-loader in development
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.html$/,
                use : [
                    {
                        loader : 'html-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'css/query-builder.[name].css'
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments : false,
            sourceMap: true
        })
    ]
};
