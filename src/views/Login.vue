<template>
    <div class="user-login">
        <div class="login-box">
            <div class="user-login-header">
                <h2>RESUME-RESOLVER</h2>
                <p>简历解析系统</p>
            </div>
            <el-form id="loginForm" auto-complete="off" :model="user"
                     ref="loginForm" label-position="left" label-width="0px" class="card-box login-form" method="post">
                <el-form-item prop="username">
                    <el-input name="username" type="text" v-model="user.username" auto-complete="off" placeholder="用户名" autofocus="true">
                        <i slot="prefix" class="fa fa-user"></i>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" type="password" v-model="user.password" auto-complete="off" placeholder="密码" @keyup.enter.native="submitForm('loginForm')">
                        <i slot="prefix" class="fa fa-lock"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%;" @click="submitForm('loginForm')" :loading="loading" :disabled="loginDisabled">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="login-footer">
            <p>© 2019 华钦信息科技股份有限公司</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data: function() {
            return {
                loading:false,
                loginDisabled:false,
                user: {
                    username: '',
                    password: ''
                },
                loginRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: ['blur','change'] }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: ['blur','change'] },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: ['blur','change'] }
                    ]
                }
            }
        },
        methods:{
            isEmpty(value) {
                return (
                    value === undefined ||
                    value === null ||
                    (typeof value === "object" && Object.keys(value).length === 0) ||
                    (typeof value === "string" && value.trim().length === 0)
                );
            },
            submitForm:function(formName) {
                var $this = this;
                this.$refs[formName].validate(function(valid){
                    var user = {
                        username:$this.user.username,
                        password:$this.user.password
                    };
                    if (valid) {
                        $this.loading = true;
                        $this.loginDisabled = true;
                        $this.$axios.post('/api/login', user).then(res =>{
                            if(res.data.errCode===0){
                                // 登录成功
                                const token = res.data.data['access_token'];

                                localStorage.setItem("flowToken", token);

                                // 存储数据
                                const user = res.data.feature;
                                $this.$store.dispatch("setIsAutnenticated", true);
                                localStorage.setItem("name", user.name);
                                $this.$store.dispatch("setUser", {'name':user.name});

                                // 页面跳转
                                let redirect = decodeURIComponent($this.$route.query.redirect || '/index');
                                $this.$router.push({path: redirect});
                            }else{
                                $this.$message.error(res.data.errMsg);
                            }
                            $this.loading = false;
                            $this.loginDisabled = false;
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .user-login{
        height: 100%;
    }
    .user-login{
        position: relative;
        left: 0;
        top: 0;
        padding: 110px 0;
        min-height: 100%;
        box-sizing: border-box;
        .el-form-item{
            margin-bottom: 22px;
        }
    }
    .user-login-header{
        text-align: center;
        padding: 20px;
    }
    .user-login-header h2{
        margin-bottom: 10px;
        font-weight: 300;
        font-size: 30px;
        color: #000;
    }
    .user-login-header p{
        font-weight: 300;
        color: #999;
    }
    .login-box{
        width: 375px;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .login-form{
        padding: 20px;
    }
    .el-input__prefix {
        padding: 0 3px;
    }
    .login-footer{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        line-height: 30px;
        padding: 20px;
        text-align: center;
        box-sizing: border-box;
        color: rgba(0,0,0,.5);
    }
</style>
