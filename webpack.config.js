const { resolve } = require("path");
const { Configuration } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
/**
 * @type {Configuration} -- 使用 jsDoc 用来代码类型提示
 */
const config = {
  mode: "development", // 当前环境模式 development 开发模式
  entry: resolve(__dirname, "./src/index.js"), // 入口文件 利用 path模块里的 resolve 来进行绝对路径
  output: {
    path: resolve(__dirname, "./dist/"), // 输出配置 一般都会输出到 dist 目录下
    filename: "js/chunk-[contenthash].js", // 这样的意思是 js 文件都会放在 js目录下 并且使用 chunk + hash的方式进行命名
    clean: true, // 每次打包前会清除一下之前打包的旧文件防止重复
  },
  // 开发服务器
  devServer: {
    static: {
      // 静态内存资源
      directory: resolve(__dirname, "../dist"),
    },
    // 开启 gzip 压缩
    compress: true,
    // 服务器 端口 9000
    port: 9000,
    // 热更新
    hot: true,
  },
  // 这些选项决定了如何处理项目中的不同类型的模块。
  module: {
    // rules 就是 webpack中所依赖的规则模块数组
    rules: [
      {
        test: /\.(css|scss)$/, // 以 css 或者 scss 为结尾的文件会走此校验
        // use 的方式就是使用多个 loader
        use: [
          // 为每个包含 CSS 的 JS 文件创建一个 CSS 文件
          MiniCssExtractPlugin.loader,
          // css-loader 会对 @import 和 url() 进行处理，就像 js 解析 import/require() 一样。
          "css-loader",
          // 加载 Sass/SCSS 文件并将他们编译为 CSS。
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/, // 匹配找一些后缀的文件
        type: "asset", // 类型为 静态资源
        parser: {
          // 转base64的条件
          dataUrlCondition: {
            maxSize: 50 * 1024, // 50kb  这个从 b开始计算的 所以需要 相乘计算下
          },
        },
        generator: {
          // 打包到 dist/image 文件下
          filename: "images/[contenthash][ext][query]",
        },
      },
      {
        test: /\.js$/, // 匹配js后缀文件
        exclude: /node_modules/, // 除了 node_modules 以外目录
        loader: "babel-loader", // 使用的 loader
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    // html 插件 用于帮我们把打包好的 js 文件自动注入到模板里
    new HtmlWebpackPlugin({
      filename: "index.html", // 打包后文件名称
      template: resolve(__dirname, "./public/index.html"), // 模板地址路径
      inject: "body", // js文件插入 body里
    }),
    new MiniCssExtractPlugin({
      filename: "styles/chunk-[contenthash].css", // 将css代码输出到 输出目录/styles文件夹下 也是以 chunk + hash的方式
      ignoreOrder: true, // 禁用 css order 警告
    }),
    // 配置 vue编译的插件
    new VueLoaderPlugin(),
  ],
};

module.exports = config;
