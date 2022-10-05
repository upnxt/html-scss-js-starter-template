const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const paths = require("./paths");
const site = require("./site");

module.exports = {
    mode: "production",
    target: "web",
    devtool: false,
    entry: [paths.src + "/index.js"],
    output: {
        path: paths.build,
        publicPath: "/",
        filename: "js/[name].bundle.[contenthash].js",
    },
    module: {
        rules: [
            { test: /\.js$/, use: ["babel-loader"] },
            { test: /\.(?:gif|png|jpg|jpeg|svg|)$/i, type: "asset/images" },
            { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: "asset/fonts" },
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false,
                        },
                    },
                    "postcss-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.src + "/assets",
                    to: "assets",
                    globOptions: {
                        ignore: ["*.DS_Store"],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            inject: true,
            title: site.title,
            template: paths.src + "/template.html",
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "styles/[name].css",
            chunkFilename: "[id].css",
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), "..."],
        runtimeChunk: {
            name: "runtime",
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
