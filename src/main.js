import Vue from 'vue';//引入vue模块
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/element-custom.scss';
import './styles/base.scss';
import store from './store';
import router from './router';//引入路由配置文件
import axios from './http';
import App from './App.vue';//引入vue组件
import 'font-awesome/css/font-awesome.min.css';
import i18n from './i18n/i18n'


Vue.use(ElementUI,{ size: 'mini', zIndex: 3000});
Vue.prototype.$axios = axios;

Vue.prototype.initUserMenus = function (){
  this.$axios.post('/api/menu/user/menus').then(res=>{
    if(res.data.errCode===0){
      this.$store.dispatch('setSideBarMenus',res.data.data);
      localStorage.setItem("sideBarMenus", JSON.stringify(res.data.data));
      // 更新defaultActive
    }else {
      // this.handleError(res, this);
    }
  });
};


Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
});

