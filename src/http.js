import axios from "axios";
import {Message} from "element-ui";
import router from './router';

// 请求拦截
axios.interceptors.request.use(
    config => {
        // 加载动画
        // startLoading();
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken){
            config.headers.Authorization = 'Bearer'+accessToken;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截
axios.interceptors.response.use(
    response => {
        // endLoading();
        return response;
    },
    error => {
        // endLoading();
        // 获取错误状态码
        if(error.response){
            const status_code = error.response.status;
            if(status_code === 401){
                // 提示token失效
                Message.error('token失效，请重新登录!');
                // 清除token
                localStorage.removeItem('accessToken');
                localStorage.removeItem("username");
                // 跳转到login页面
                // router.push({path:'/login',query: {redirect: error.response.fullPath}});
                router.push({path:'/login'});
                return true;
            }else{
                return Promise.reject(error);
            }
        }else {
            return Promise.reject(error);
        }
    }
);
export default axios;
