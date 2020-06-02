<template>
    <div class="main-content">
        <el-card class="space-card" style="margin:12px 0">
            <el-form size="mini" class="search-form">
                <el-form-item label="用户名:" size="mini">
                    <el-input v-model="username" placeholder="用户名"  style="width:240px"></el-input>
                    <el-button type="primary" @click="searchBtnClick">查询</el-button>
                    <el-button type="primary" @click="openAddUserForm">添加</el-button>
                </el-form-item>
            </el-form>
            <el-form v-if="addFormFlag" :model="addForm" :rules="addFormRules" ref="addForm" size="mini" class="add-form">
                <div class="inline-col">
                    <el-form-item prop="username" size="mini">
                        <el-input v-model="addForm.username" placeholder="用户名" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" size="mini">
                        <el-input v-model="addForm.password" placeholder="密码" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="closeAddUser">取消</el-button>
                        <el-button type="primary" @click="addUser">添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card class="space-card main-card" style="margin:0;">
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserForm" size="mini">
                <el-table :data="tableData" style="width:100%" size="mini" border>
                    <el-table-column label="用户名" width="120px">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.username }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="username">
                                    <el-input v-model="editUserForm.username" style="max-width: 200px"></el-input>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="roles" label="角色">
                        <template slot-scope="scope">
                            <template v-for="role in allRoles">
                                <template v-if="scope.row.roles">
                                    <template  v-for="item in scope.row.roles.split(',')">
                                        <el-tag type="primary" size="small" :key="role.id+''+item" disable-transitions v-if="role.id==item">{{role.name}}</el-tag>
                                    </template>    
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.status" placeholder="请选择状态" style="width:88px" size="mini" @change="statusChange(scope.row.id, scope.row.status)">
                                <el-option value="0" label="停用">停用</el-option>
                                <el-option value="1" label="正常">正常</el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作"  min-width="120px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleSaveEdit(scope.row)" v-if="editIndex==scope.$index">保存</el-button>
                            <el-button size="mini" @click="handleCloseEdit" v-if="editIndex==scope.$index">取消</el-button>
                            <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                            <el-button size="mini" @click="handleEditUserRoles(scope.$index, scope.row)">编辑用户角色</el-button>    
                            <el-button size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="total, prev, pager, next" :page-size="20" :total="total" @current-change="handleCurrentChange"></el-pagination>
            </el-form>
        </el-card>
        <el-dialog title="编辑用户的角色" :visible.sync="dialogUserRoleVisible">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="roleDefaultChecked" @change="handleCheckedRolesChange">
                <template v-for="role in allRoles">
                    <el-checkbox :label="role.id+''">{{ role.name }}</el-checkbox>
                </template>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUserRoleVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="submitUserRoles" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
    import qs from 'qs';
    export default {
        name: 'User',
        created(){
            this.searchUsers(1);
            this.initAllRoles();
        },
        computed:{
        },
        data: function () {
            return {
                allRoles:[],
                dialogUserRoleVisible:false,
                tableData:[],
                username:'',
                defaultSearchForm:{username:''},
                addFormFlag:false,
                addForm:{username:'',password:''},
                addFormRules:{
                    username: [{ required: true, message: '请输入用户名', trigger: ['blur','change'] }],
                    password: [{ required: true, message: '请输入密码', trigger: ['blur','change'] }],
                },
                editIndex:2000,
                editUserForm:{id:'',username:'',password:''},
                editUserFormRules:{
                    username: [{ required: true, message: '请输入用户名', trigger: ['blur','change'] }],
                    password: [{ required: true, message: '请输入密码', trigger: ['blur','change']}],
                },
                total:0,
                userRoleId:'',
                userRoleIndex:'',
                roleDefaultChecked:[],
                isIndeterminate: true,
                checkAll: false,
            };
        },
        methods: {
            searchBtnClick:function(){
                this.defaultSearchForm = {'username':this.username};
                this.searchUsers(1);
            },

            searchUsers:function(pageNum){
                this.$axios.post('/api/user/users', qs.stringify({
                    'username':this.defaultSearchForm.username,
                    'pageNum':pageNum
                })).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        this.tableData = res.data.data.list;
                        this.total = res.data.data.total;
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });
            },
            handleCurrentChange:function(val){
                this.searchUsers(val);
            },
            openAddUserForm:function(){
                this.addForm={username:'',password:''};
                this.addFormFlag = true;
            },
            closeAddUser:function(){
                this.addForm={username:'',password:''};
                this.addFormFlag=false;
            },
            addUser:function(){
                alert(1)
                
                this.$refs['addForm'].validate(function(valid){
                    if (valid) {
                        $this.$axios.post('/api/user/add', qs.stringify({
                            'username':$this.addForm.username,
                            'password':$this.addForm.password,
                        })).then(res=>{
                            // 成功后执行
                            if(res.data.errCode===0){
                                this.searchUsers(1);
                                this.$message.success('添加成功');
                            }else{
                                // todo 错误处理
                            }
                        }).catch(()=>{
                            // 失败后执行
                            $this.$message.error('服务器有异常，请稍后重试');
                        });
                    }else{
                        return false;
                    }
                });
            },
            handleOpenEdit:function(index, row){
                this.editUserForm = {id:row.id,username:row.username,password:row.password};
                this.editIndex = index;
            },
            handleCloseEdit:function(){
                this.editUserForm = {id:'',username:'',password:''};
                this.editIndex = 2000;

            },
            handleDel:function(index,row){
                var $this = this;
                this.$confirm('此操作将永久删除'+row.key+'用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    $this.$axios.post('/api/user/del', qs.stringify({
                        'id':row.id,
                    })).then(res=>{
                        // 成功后执行
                        if(res.data.errCode===0){
                            $this.tableData.splice(index, 1);
                            $this.$message.success('删除成功');
                            $this.searchUsers(1);
                        }else{
                            // todo 错误处理
                        }
                    }).catch(err=>{
                        // 失败后执行
                        $this.$message.error('服务器有异常，请稍后重试');
                    });
                }).catch(function(){
                    $this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSaveEdit:function(row){
                if(this.editUserForm.name==row.name && this.editUserForm.key==row.key){
                    this.editIndex=2000;
                    this.$message.success('修改成功');
                }else{
                    this.$refs['editUserForm'].validate(function(valid){
                        if (valid) {
                            this.$axios.post('/api/user/edit', qs.stringify({
                                'id':this.editUserForm.id,
                                'username':this.editUserForm.username,
                                'password':this.editUserForm.password,
                            })).then(res=>{
                                // 成功后执行
                                if(res.data.errCode===0){
                                    row.username=this.editUserForm.username;
                                    row.password=this.editUserForm.password;
                                    this.editIndex=2000;
                                    this.$message.success('修改成功');
                                }else{
                                    // todo 错误处理
                                }
                            }).catch(err=>{
                                // 失败后执行
                                this.$message.error('服务器有异常，请稍后重试');
                            });
                        }else{
                            return false;
                        }
                    });


                }
            },
            handleEditUserRoles:function(index, row){
                
                this.userRoleId = row.id;
                this.userRoleIndex = index;
                if(row.roles){
                    this.roleDefaultChecked = row.roles.split(',');
                }else{
                    this.roleDefaultChecked = [];
                }

                this.dialogUserRoleVisible = true;
            },
            submitUserRoles: function () {
                var $this = this;
                $this.$axios.post('/api/user/role/edit', {
                    'id':$this.userRoleId,
                    'roles':$this.roleDefaultChecked.join(','),
                }).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        $this.tableData[$this.userRoleIndex]['roles'] = $this.roleDefaultChecked.join(',');
                        $this.dialogUserRoleVisible = false;
                        $this.$message.success('修改成功');
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    $this.$message.error('服务器有异常，请稍后重试');
                });
            },
            handleCheckAllChange: function(val) {
                let allRoleIds = [];
                for(let role of this.allRoles){
                    allRoleIds.push(role['id']);
                }
                this.roleDefaultChecked = val ? allRoleIds : [];
                this.isIndeterminate = false;
            },
            handleCheckedRolesChange: function(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allRoles.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allRoles.length;
            },
            statusChange:function (id, status) {
                var $this = this;
                $this.$axios.post('/api/user/status/edit',({
                    'id':id,
                    'status':status,
                })).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        $this.$message.success('修改成功');
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    $this.$message.error('服务器有异常，请稍后重试');
                });

            },
            initAllRoles:function(){
                this.$axios.post('/api/roles', {}).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        this.allRoles = res.data.data;
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });
            },
            resetPassword:function(row){
                var $this = this;
                $this.$axios.post('/api/user/resetPwd',qs.stringify({
                    'id':row.id,
                })).then(res=>{
                    if(res.data.errCode===0){
                        $this.$message.success('修改成功密码已重置，新密码为123456');
                    }else{
                        //todo 错误处理
                    }
                }).catch(err=>{
                    //失败后执行
                    $this.$message.error('服务器有异常，请稍后重试');
                })

            },

        }

    }
</script>

<style scoped>

</style>
