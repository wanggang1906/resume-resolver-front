<template>
    <el-card>
        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="addForm">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="addForm.oldPassword" style="width:200px" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input v-model="addForm.password" type="password"  style="width:200px" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input type="password" style="width:200px" v-model="addForm.confirmPassword" placeholder="请确认新密码"></el-input>
            </el-form-item>
            <el-button type="primary" @click="updatePassword('addForm')">修改密码</el-button>
        </el-form>
    </el-card>
</template>

<script>
export default {
    data(){
          var validateOldPassword = (rule, value, callback) =>{
                    if (value === '') {
                        callback(new Error('请输入原密码'));
                    } else {
                        callback();
                    }
                };
                 var validatePass=(rule, value, callback)=>{
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else if (value.length < 6 || value.length > 15) {
                        callback(new Error('密码长度应为6~15个字符'));
                    } else {
                        callback();
                    }
                };
                var validatePass2 = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入确认密码'));

                    } else if (value.length < 6 || value.length > 15) {
                        callback(new Error('确认密码长度应为6~15个字符'));

                    } else if (value !== this.addForm.password) {
                        callback(new Error('两次输入密码不一致!'));

                    } else {
                        callback();

                    }
                };
        return{
            addForm: {
                oldPassword: '',
                password: '',
                confirmPassword: ''
            },
            addRules: {
                oldPassword: [{validator: validateOldPassword, trigger: 'blur'}],
                password: [{validator: validatePass, trigger: 'blur'}],
                confirmPassword: [{validator: validatePass2, trigger: 'blur'}]
            },
        }
    },
    methods:{
        updatePassword:function(addForm){
            var $this = this;
            $this.$refs['addForm'].validate(function(valid){
                if(valid){
                    $this.$axios.post('/api/user/changepassword',{
                       'oldPassword':$this.addForm.oldPassword,
                       'password':$this.addForm.password
                    }).then(res=>{
                        if(res.data.errCode===0){
                            $this.$message.success('修改密码成功');

                        }else{
                            $this.$message.error(res.data.errMsg);
                        }
                    }).catch(err=>{
                        //失败
                        $this.$message.error('服务器有异常，请稍后重试');
                    });
                }else{
                    return false;
                }
            })

            }
    }
}
</script>

<style lang="scss">
    .addForm{
    }
</style>


