<template>
    <div class="main-content">
        <el-card class="space-card" style="margin:12px 0">
            <el-form size="mini" class="search-form">
                <el-form-item label="名称:" size="mini">
                    <el-input v-model="name" placeholder="名称" style="width:240px"></el-input>
                    <el-button type="primary" @click="searchResources(1)">查询</el-button>
                    <el-button type="primary" @click="openAddResForm">添加</el-button>
                </el-form-item>
            </el-form>
            <el-form v-if="addFormFlag" :model="addForm" :rules="addFormRules" ref="addForm" size="mini" class="add-form">
                <div class="inline-col">
                    <el-form-item prop="name" size="mini">
                        <el-input v-model="addForm.name" placeholder="名称" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item prop="url" size="mini">
                        <el-input v-model="addForm.url" placeholder="地址" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="closeAddResource">取消</el-button>
                        <el-button type="primary" @click="addResource">添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card class="space-card main-card" style="margin:0;">
            <el-form :model="editResourceForm" :rules="editResourceFormRules" ref="editResourceForm" size="mini">
                <el-table :data="tableData" style="width:100%" size="mini" border>
                    <el-table-column label="名称">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.name }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="name">
                                    <el-input v-model="editResourceForm.name" style="max-width: 200px"></el-input>
                                </el-form-item>
                            </template>

                        </template>
                    </el-table-column>
                    <el-table-column label="地址">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.url }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="url">
                                    <el-input v-model="editResourceForm.url" style="max-width: 300px"></el-input>
                                </el-form-item>
                            </template>
                        </template>

                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleSaveEdit(scope.row)" v-if="editIndex==scope.$index">保存</el-button>
                            <el-button size="mini" @click="handleCloseEdit" v-if="editIndex==scope.$index">取消</el-button>
                            <el-button size="mini" @click="handleOpenEdit(scope.$index, scope.row)" v-if="editIndex!=scope.$index">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="20" @current-change="handleCurrentChange"></el-pagination>
            </el-form>

        </el-card>
    </div>

</template>

<script>
    import qs from 'qs';
    export default {
        name: 'Resource',
        created(){
            this.searchResources(1);
        },
        computed:{
        },
        data: function () {
            return {
                defaultActive:'1',
                tableData:[],
                name:'',
                submitLoading:false,
                addFormFlag:false,
                addForm:{name:'',url:''},
                addFormRules:{
                    name: [{ required: true, message: '请输入资源名称', trigger: ['blur','change'] }],
                    url: [{ required: true, message: '请输入资源地址', trigger: ['blur','change'] }],
                },
                editIndex:2000,
                editResourceForm:{id:'',name:'',url:''},
                editResourceFormRules:{
                    name: [{ required: true, message: '请输入资源名称', trigger: ['blur','change'] }],
                    url: [{ required: true, message: '请输入资源地址', trigger: ['blur','change']}],
                },
                total:0
            };
        },
        methods: {
            searchResources:function(pageNum){
                this.$axios.post('/api/resource/resources',qs.stringify({
                    'name':this.name,
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
                this.searchResources(val);
            },
            openAddResForm:function(){
                this.addForm={name:'',url:''};
                this.addFormFlag = true;
            },
            closeAddResource:function(){
                this.addForm={name:'',url:''};
                this.addFormFlag=false;
            },
            addResource:function(){
                var $this = this;
                $this.$refs['addForm'].validate(function(valid){
                    if (valid) {
                        $this.$axios.post('/api/resource/add', ({
                            'name':$this.addForm.name,
                            'url':$this.addForm.url
                        })).then(res=>{
                            // 成功后执行
                            if(res.data.errCode===0){
                                $this.$message.success('添加成功');
                                $this.searchResources(1);
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
            },
            handleOpenEdit:function(index, row){
                this.editResourceForm = {id:row.id, name:row.name, url:row.url};
                this.editIndex = index;
            },
            handleCloseEdit:function(){
                this.editResourceForm = {id:'',name:'',url:''};
                this.editIndex = 2000;

            },
            handleDel:function(index,row){
                var $this = this;
                $this.$confirm('此操作将永久删除'+row.url+'资源, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    $this.$axios.post('/api/resource/del', qs.stringify({
                        'id':row.id,
                    })).then(res=>{
                        // 成功后执行
                        if(res.data.errCode===0){
                            $this.tableData.splice(index, 1);
                            $this.$message.success('删除成功');
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
                if($this.editResourceForm.name==row.name && $this.editResourceForm.url==row.url){
                    $this.editIndex=2000;
                    $this.$message.success('修改成功');
                }else{
                    $this.$refs['editResourceForm'].validate(function(valid){
                        if (valid) {
                            $this.$axios.post('/api/resource/edit',({
                                'id':$this.editResourceForm.id,
                                'name':$this.editResourceForm.name,
                                'url':$this.editResourceForm.url,
                            })).then(res=>{
                                // 成功后执行
                                if(res.data.errCode===0){
                                    row.name=$this.editResourceForm.name;
                                    row.url=$this.editResourceForm.url;
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
        }

    }
</script>

<style scoped lang="scss">
    .search-form{
        .el-form-item div{
            padding-right: 5px;
        }
    }
</style>
