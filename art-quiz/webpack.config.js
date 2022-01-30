const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 9000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: '[name].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/images/[contenthash].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[contenthash].[ext]'
        }
      },
      {
        test: /\.html$/i,
        use: 'html-loader'
      },
      {
        test: /\.mp3$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/audio/[contenthash].[ext]'
        }
      },
      {
        test: /\.(css)$/,
        include: [
          path.resolve(__dirname, '/src/styles'),
          path.resolve(__dirname, '/node_modules')
        ],
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(css)$/,
        exclude: [
          path.resolve(__dirname, '/src/styles'),
          path.resolve(__dirname, '/node_modules')
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]'
              }
            }
          }
        ]
      }
    ]
  }
};
