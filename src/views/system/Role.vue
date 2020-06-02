<template>
    <div class="main-content">
        <el-card class="space-card" style="margin:12px 0">
            <el-form size="mini" class="search-form">
                <el-form-item label="名称:" size="mini">
                    <el-input v-model="name" placeholder="名称"  style="width:240px"></el-input>
                    <el-button type="primary" @click="searchBtnClick">查询</el-button>
                    <el-button type="primary" @click="openAddRoleForm">添加</el-button>
                </el-form-item>
            </el-form>
            <el-form v-if="addFormFlag" :model="addForm" :rules="addFormRules" ref="addForm" size="mini" class="add-form">
                <div class="inline-col">
                    <el-form-item prop="name" size="mini">
                        <el-input v-model="addForm.name" placeholder="名称" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item prop="key" size="mini">
                        <el-input v-model="addForm.key" placeholder="关键字" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="closeAddRole">取消</el-button>
                        <el-button type="primary" @click="addRole">添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card class="space-card main-card" style="margin:0;">
            <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleForm" size="mini">
                <el-table :data="tableData" style="width:100%" size="mini" border>
                    <el-table-column label="名称">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.name }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="name">
                                    <el-input v-model="editRoleForm.name" style="max-width: 200px"></el-input>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="关键字">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.key }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="key">
                                    <el-input v-model="editRoleForm.key" style="max-width: 300px"></el-input>
                                </el-form-item>
                            </template>
                        </template>

                    </el-table-column>
                    <el-table-column label="操作"  min-width="120px">
                        <template slot-scope="scope">
                            <template v-if="scope.row.key!=='admin'">
                                <el-button size="mini" @click="handleSaveEdit(scope.row)" v-if="editIndex==scope.$index">保存</el-button>
                                <el-button size="mini" @click="handleCloseEdit" v-if="editIndex==scope.$index">取消</el-button>
                                <el-button size="mini" @click="handleOpenEdit(scope.$index, scope.row)" v-if="editIndex!=scope.$index">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                            </template>
                            <el-button size="mini" @click="handleEditRoleMenus(scope.$index, scope.row)">编辑角色菜单</el-button>
                            <el-button size="mini" @click="handleEditRoleResources(scope.$index, scope.row)">编辑角色资源</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="total, prev, pager, next" :page-size="20" :total="total" @current-change="handleCurrentChange"></el-pagination>
            </el-form>
        </el-card>
        <el-dialog title="编辑角色显示的菜单" :visible.sync="dialogRoleMenuVisible">
            <el-tree :data="allMenus" show-checkbox node-key="id" check-strictly default-expand-all :default-checked-keys="menuDefaultChecked" :props="menuDefaultProps" ref="roleMenuTree"></el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRoleMenuVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="submitRoleMenus" size="mini">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="编辑角色可以访问的资源" :visible.sync="dialogRoleResourceVisible">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="resourceDefaultChecked" @change="handleCheckedResourcesChange">
                <el-checkbox :key="resource.id" :label="resource.id" v-for="resource of allResources">{{ resource.name }}</el-checkbox>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRoleResourceVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="submitRoleResources" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs';

    export default {
        name: 'Role',
        created(){
            this.searchRoles(1);
            this.initAllMenus();
            this.initAllResources();
        },
        computed:{
        },
        data: function () {
            return {
                allMenus:[],
                allResources:[],
                dialogRoleMenuVisible:false,
                dialogRoleResourceVisible:false,
                tableData:[],
                name:'',
                defaultSearchForm:{name:''},
                submitLoading:false,
                addFormFlag:false,
                addForm:{name:'',key:''},
                addFormRules:{
                    name: [{ required: true, message: '请输入角色名称', trigger: ['blur','change'] }],
                    key: [{ required: true, message: '请输入角色关键字', trigger: ['blur','change'] }],
                },
                editIndex:2000,
                editRoleForm:{id:'',name:'',key:''},
                editRoleFormRules:{
                    name: [{ required: true, message: '请输入角色名称', trigger: ['blur','change'] }],
                    key: [{ required: true, message: '请输入角色关键字', trigger: ['blur','change']}],
                },
                total:0,
                roleMenuId:'',
                roleMenuIndex:'',
                menuDefaultChecked:[],
                menuDefaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleResourceId:'',
                roleResourceIndex:'',
                resourceDefaultChecked:[],
                isIndeterminate: true,
                checkAll: false,
            };
        },
        methods: {
            searchBtnClick:function(){
                this.defaultSearchForm = {'name':this.name};
                this.searchRoles(1);
            },

            searchRoles:function(pageNum){
                this.$axios.post('/api/role/roles',qs.stringify({
                    'name':this.defaultSearchForm.name,
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
                this.searchRoles(val);
            },
            openAddRoleForm:function(){

                this.addForm={name:'',key:''};
                this.addFormFlag = true;
            },
            closeAddRole:function(){
                this.addForm={name:'',key:''};
                this.addFormFlag=false;
            },
            addRole:function(){

                var $this = this;
                this.$refs['addForm'].validate(function(valid){
                    if (valid) {
                        $this.$axios.post('/api/role/add',({
                            'name':$this.addForm.name,
                            'key':$this.addForm.key,
                        })).then(res=>{
                            // 成功后执行
                            if(res.data.errCode===0){
                                $this.searchRoles(1);
                                $this.$message.success('添加成功');
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
                this.editRoleForm = {id:row.id,name:row.name,key:row.key};
                this.editIndex = index;
            },
            handleCloseEdit:function(){
                this.editRoleForm = {id:'',name:'',key:''};
                this.editIndex = 2000;

            },
            handleDel:function(index,row){
                var $this = this;
                $this.$confirm('此操作将永久删除'+row.key+'角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    $this.$axios.post('/api/role/del',qs.stringify({
                        'id':row.id,
                    })).then(res=>{
                        // 成功后执行
                        if(res.data.errCode===0){

                            $this.tableData.splice(index, 1);
                            $this.$message.success('删除成功');
                            $this.searchRoles(1);
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
                var $this = this;
                if(this.editRoleForm.name==row.name && this.editRoleForm.key==row.key){
                    $this.editIndex=2000;
                    $this.$message.success('修改成功');
                }else{
                    this.$refs['editRoleForm'].validate(function(valid){
                        if (valid) {
                            $this.$axios.post('/api/role/edit',({
                                'id':$this.editRoleForm.id,
                                'name':$this.editRoleForm.name,
                                'key':$this.editRoleForm.key,
                            })).then(res=>{
                                // 成功后执行
                                if(res.data.errCode===0){
                                    row.name=$this.editRoleForm.name;
                                    row.key=$this.editRoleForm.key;
                                    $this.editIndex=2000;
                                    $this.$message.success('修改成功');
                                }else{
                                    // todo 错误处理
                                }
                            }).catch(err=>{
                                // 失败后执行
                                $this.$message.error('服务器有异常，请稍后重试');
                            });
                        }else{
                            return false;
                        }
                    });


                }
            },
            handleEditRoleMenus:function(index, row){
                this.roleMenuId = row.id;
                this.roleMenuIndex = index;
                if(this.menuDefaultChecked.length>0){
                    this.menuDefaultChecked.splice(0,this.menuDefaultChecked.length);
                }
                const allDefaultChecked = row.menuIds ? row.menuIds.split(',') : [];
                this.menuDefaultChecked = allDefaultChecked;
                this.dialogRoleMenuVisible = true;
                this.$nextTick(function () {
                    this.$refs.roleMenuTree.setCheckedKeys(allDefaultChecked);
                });
            },
            handleEditRoleResources:function(index, row){
                this.roleResourceId = row.id;
                this.roleResourceIndex = index;
                this.resourceDefaultChecked = [];
                if(row.resourceIds){
                    for(let resourceId of row.resourceIds.split(',')){
                        this.resourceDefaultChecked.splice(this.resourceDefaultChecked.length,0,Number(resourceId));
                    }
                }
                let checkedCount = this.resourceDefaultChecked.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allResources.length;
                this.checkAll = checkedCount === this.allResources.length;
                this.dialogRoleResourceVisible = true;
            },
            submitRoleMenus:function () {
                let checkedKeys = this.$refs.roleMenuTree.getCheckedKeys();
                this.$axios.post('/api/role/edit',{
                    'id':this.roleMenuId,
                    'menuIds':checkedKeys.join(',')
                }).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        this.tableData[this.roleMenuIndex]['menus'] = checkedKeys;
                        this.dialogRoleMenuVisible = false;
                        this.$message.success('修改成功');
                        this.initUserMenus();
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });
            },
            handleCheckAllChange(val) {
                let allResourceIds = [];
                for(let resource of this.allResources){
                    allResourceIds.push(resource['id']);
                }
                this.resourceDefaultChecked = val ? allResourceIds : [];
                this.isIndeterminate = false;
            },
            handleCheckedResourcesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.allResources.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.allResources.length;
            },
            submitRoleResources:function () {
                this.$axios.post('/api/role/edit',{
                    'id':this.roleResourceId,
                    'resourceIds':this.resourceDefaultChecked.join(',')
                }).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        this.tableData[this.roleResourceIndex]['resourceIds'] = this.resourceDefaultChecked.join(',');
                        this.dialogRoleResourceVisible = false;
                        this.$message.success('修改成功');
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });

            },
            initAllMenus:function(){
                this.$axios.post('/api/menus', {}).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        this.allMenus = res.data.data;
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });
            },
            initAllResources:function(){
                this.$axios.post('/api/resources', {}).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        this.allResources = res.data.data;
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });
            }
        }
    }
</script>

<style scoped>

</style>
