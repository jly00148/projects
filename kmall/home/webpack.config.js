const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")// css单独打包成一个文件,使页面link引入css,而不是用出口js文件在head标签生成style标签
const getHtmlConfig = (name,title)=>({
    template:'./src/views/'+name+'.html',//模板文件
    filename:name+'.html',//输出的文件名
    title:title,//页面标题title
    //inject:'head',//脚本写在那个标签里,默认是true(在body结束后)
    hash:true,//给生成的js/css文件添加一个唯一的hash
    chunks:['common',name]//把common和name文件下的index.js打包
})

module.exports = {
    //指定环境
    mode:'development',
    entry:{
        'index':'./src/pages/index/index.js',
        'common':'./src/pages/common/index.js',
        'list':'./src/pages/list/index.js',
        'user-login':'./src/pages/user-login/index.js',
        'user-register':'./src/pages/user-register/index.js',
        'result':'./src/pages/result/index.js',
        'user-center':'./src/pages/user-center/index.js',
        'user-update-password':'./src/pages/user-update-password/index.js',
        'detail':'./src/pages/detail/index.js',
        'cart':'./src/pages/cart/index.js',
        'order-confirm':'./src/pages/order-confirm/index.js',
        'payment':'./src/pages/payment/index.js',
        'order-list':'./src/pages/order-list/index.js',
        'order-detail':'./src/pages/order-detail/index.js',
    },
    //出口
    output: {
        filename: 'js/[name]-[hash]-bundle.js',
        publicPath:'/',
        path: path.resolve(__dirname, 'dist')
    },
    resolve:{
        alias:{//配制别名
            pages:path.resolve(__dirname,'./src/pages'),
            util:path.resolve(__dirname,'./src/util'),
            api:path.resolve(__dirname,'./src/api'),
            node_modules:path.resolve(__dirname,'./node_modules')
        }
    },    
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                }
              },
              "css-loader"
            ]
          },       
        //处理图片
            {
                test: /\.(png|jpg|gif|eot|svg|ttf|woff2|woff)\??.*$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 400,//小于400会生成base64格式
                            name:'resource/[name].[ext]'//图片地址处理：图片存放在新生成的resource文件夹下(否则图片会生成在dist文件夹下)，打包后在相应的/dist/css文件下引入resource文件内的图片
                        }
                    }
                ]
            },
        //bable
            {   //配制babel
                test:/\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // presets: ['env', 'react'],
                        presets: ['env','es2015','stage-3'],//es6扩展,安装:npm i babel-preset-stage-3 babel-preset-es2015 --save-dev
                    },
                }
            },
       //tpl
            {
                test:/\.tpl$/,
                use: {
                    loader: 'html-loader',
                }
            },            
        ]
    },
    plugins:[
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin(getHtmlConfig('index','首页')),
        new htmlWebpackPlugin(getHtmlConfig('list','列表页')),
        new htmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
        new htmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
        new htmlWebpackPlugin(getHtmlConfig('result','结果提示')),
        new htmlWebpackPlugin(getHtmlConfig('user-center','用户中心')),
        new htmlWebpackPlugin(getHtmlConfig('user-update-password','修改密码')),
        new htmlWebpackPlugin(getHtmlConfig('detail','商品详情')),
        new htmlWebpackPlugin(getHtmlConfig('cart','订单详情')),
        new htmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
        new htmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
        new htmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
        new htmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),
        new MiniCssExtractPlugin({
            filename:'css/[name]-[hash]-bundle.css'//将打包的css放入dist文件夹下的css文件里
        })
    ],
    devServer: {
        contentBase:'./dist',//内容的目录
        host:'127.0.0.1',
        port:3002,//指定服务端口
        proxy: [{
            context: [
                '/sessions',
                '/users',
                '/categories',
                '/ads',
                '/floors',
                '/products',
                '/carts',
                '/orders',
                '/shippings',
                '/payments'
            ],
            target: 'http://127.0.0.1:3000',
        }]
    },                
}