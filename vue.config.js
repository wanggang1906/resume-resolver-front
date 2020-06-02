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
        overlay: {
            warnings: false,
            errors: false
        },
        before: app => { }
    }
}
