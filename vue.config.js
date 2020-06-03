module.exports = {
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        disableHostCheck:true,
        hotOnly: false,
        proxy: { // 配置跨域
            '/api': {
                //target: 'http://172.19.235.128:3000/mock/15',
                //target: 'http://192.168.31.98:8085',
                target: 'http://127.0.0.1:8085',
                ws: true,
                disableHostCheck:true,
                changOrigin: true,
            }
        },
        // 覆盖
        overlay: {
            warnings: false,
            errors: false
        },
        before: app => { }
    },
/*    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,

        // 源码映射
        // 可取值source-map，inline-source-map，inline-cheap-source-map，inline-cheap-module-source-map等等；这里使用source-map
        devtool: 'source-map'

    }*/
}
