const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (env) {
    env = env || {};

    return {
        entry: {
            'script': './src/index.js',
            'styles': './src/scss/default.scss'
        },

        output: {
            filename     : 'js/query-builder.[name].js',
            path         : path.resolve(__dirname, 'dist'),
            library      : 'jquery-querybuilder',
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

        devtool: env.production ? 'hidden-source-map' : 'cheap-module-source-map',

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
                                    minimize : !!env.production
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
                                minimize: !!env.production
                            }
                        }
                    ]
                }
            ]
        },

        plugins: (function () {
            let plugins = [
                new ExtractTextPlugin({
                    filename: 'css/query-builder.default.css'
                })
            ];

            if (env.production) {
                plugins.push(
                    new webpack.optimize.UglifyJsPlugin({
                        comments : false,
                        sourceMap: true
                    })
                );
            }

            return plugins;
        }())
    };
};
