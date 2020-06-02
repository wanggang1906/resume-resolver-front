<template>
    <el-container class="main-container" style="height: 500px;" v-cloak>
        <SideBar ref="sideBar"></SideBar>
        <el-container class="is-vertical">
            <HeadNav :is-collapse="isCollapse"></HeadNav>
            <el-main>
                <el-breadcrumb separator="/" class="main-breadcrumb">
                    <template v-for="breadItem in breadcrumbs">
                        <el-breadcrumb-item :key="breadItem">{{ breadItem }}</el-breadcrumb-item>
                    </template>
                </el-breadcrumb>
                <transition @after-enter="afterEnter">
                    <router-view></router-view>
                </transition>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import SideBar from '../components/SideBar';
    import HeadNav from '../components/HeadNav';

    export default {
        name: 'Home',
        components: {
            HeadNav,
            SideBar
        },
        computed:{
            breadcrumbs(){
                return this.$store.getters.breadcrumbs;
            },
            isCollapse(){
                return this.$store.getters.isCollapse;
            },
        },
        created() {
            let isCollapse = false;
            if(localStorage.hasOwnProperty('isCollapse')){
                isCollapse = JSON.parse(localStorage.isCollapse===undefined?'false':localStorage.isCollapse);
            }
            this.$store.dispatch("setIsCollapse", isCollapse);
            let sideBarMenus = JSON.parse(localStorage.getItem("sideBarMenus"));
            if(!sideBarMenus){
                sideBarMenus = [];
            }
            this.$store.dispatch("setSideBarMenus", sideBarMenus);

            if (localStorage.flowToken) {
                const username = localStorage.getItem("username");
                this.$store.dispatch("setUser", {'username':username});
            }
        },
        methods: {
            isEmpty(value) {
                return (
                    value === undefined ||
                    value === null ||
                    (typeof value === "object" && Object.keys(value).length === 0) ||
                    (typeof value === "string" && value.trim().length === 0)
                );
            },
            handleError:function(data, vm){
                let errCode = data.errCode;
                if(errCode){

                    switch (errCode) {
                        case 401:
                            vm.$alert('session超时，请重新登录', '错误提示', {
                                showClose:false,
                                confirmButtonText: '确定',
                                callback: () => {
                                    window.location.href = '/login/?next='+data['next'];
                                }
                            });
                            break;
                        case 403:
                            vm.$alert(data['msg'], '错误提示', {
                                showClose:false,
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });
                            break;
                        case 404:
                            vm.$alert(data['msg'], '错误提示', {
                                showClose:false,
                                confirmButtonText: '确定',
                                callback: action => {

                                }
                            });

                            break;
                        default:
                            vm.$message.error('服务器异常请稍后重试');
                    }
                }else if(data.errCode!==0){
                    if(data['msg']){
                        vm.$message.error(data['msg']);
                    }else{
                        vm.$message.error('服务器异常请稍后重试');
                    }
                }
            },
            afterEnter(){
                this.$refs.sideBar.initLocalUserMenus()
            }
        }
    }
</script>

<style lang="scss">
    .main-container{
        height: 100%;
        min-height: 100%;
    }
    .main-breadcrumb{
        font-size: 12px;
    }
    .main-content{
        .space-card .el-card__body{
            padding:12px;
        }
    }
</style>
