var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	entry: {
            App: path.resolve(__dirname, './src/js/App.jsx'),
	},
	output: {
		path: __dirname + "/build",
    filename: "[name].[hash].js",
    publicPath: '/'
	},

	resolve: {
		extensions: ['', '.js', '.jsx']
	},

	module: {
		loaders: [{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel'
			}, 
			{
				test:/\.html$/,
				loader:'html-loader'
			},
			{
				test:/\.tpl$/,
				loader:'ejs-loader'
			},
			{ 
				test: /\.less$/, 
				loader: 'style!css!postcss!less' },
      { 
      	test: /\.css$/, 
      	loader: 'style!css!postcss' }, 
      {
				test: /\.(png|gif|jpg|jpeg|bmp)$/i,
				loader: 'url-loader?limit=5000&name=img/[name].[ext]'
			}, // 限制大小5kb
			{
				test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
				loader: 'url-loader?limit=5000&name=fonts/[name].[ext]'
			} // 限制大小小于5k
		]
	},

	postcss: [
		require('autoprefixer') //调用autoprefixer插件，例如 display: flex
	],

	plugins: [
		new webpack.ProvidePlugin({
			$:"jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
		// html 模板插件
		new HtmlWebpackPlugin({
			filename:'index.html',
			template:'index.html',
			inject:'body',
			chunks:['App']
		}),
	  // 热加载插件
        new webpack.HotModuleReplacementPlugin(),
           // 打开浏览器
        new OpenBrowserPlugin({
          url: 'http://localhost:8080'
        })

	]
}
