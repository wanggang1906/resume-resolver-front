<template>
    <div class="main-content">
        <el-card class="space-card" style="margin:12px 0;">
            <el-form size="mini" class="search-form">
                <el-form-item label="名称:" size="mini">
                    <el-input v-model="name" placeholder="名称" style="width:220px"></el-input>
                    <el-select v-model="parentId" placeholder="父菜单" style="width:120px">
                        <template  v-for="menu in menuOptions">
                            <el-option  v-if="menu.type===1" :key="menu.id" :label="menu.name" :value="menu.id"></el-option>
                        </template>
                    </el-select>
                    <el-button type="primary" @click="searchBtnClick">查询</el-button>
                    <el-button type="primary" @click="openAddMenuForm">添加</el-button>
                </el-form-item>
            </el-form>
            <el-form v-if="addFormFlag" :model="addForm" :rules="addFormRules" ref="addForm" size="mini" class="add-form">
                <div class="inline-col">
                    <el-form-item prop="name">
                        <el-input v-model="addForm.name" placeholder="名称" style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item prop="type">
                        <el-select v-model="addForm.type" placeholder="请选择类型" style="width:120px">
                            <el-option key="1" label="目录" value="1"></el-option>
                            <el-option key="2" label="页面" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="url" v-if="addForm.type==='2'">
                        <el-input v-model="addForm.url" placeholder="页面请求路径" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item prop="parentId">
                        <el-select v-model="addForm.parentId" placeholder="请选择父菜单">
                            <template  v-for="menu in menuOptions">
                                <el-option :key="menu.id" :label="menu.name" :value="menu.id" v-if="menu.type==1"></el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="icon">
                        <el-button type="primary">
                            <i :class="addForm.icon" v-if="addForm.icon"></i>
                            <span v-else>无</span>
                        </el-button>
                        <el-popover placement="right" width="160" trigger="click" >

                            <p>
                                <el-radio-group v-model="addForm.icon">
                                    <el-radio-button label="" size="mini" style="margin:2px 8px;">无</el-radio-button>
                                    <el-radio-button :key="icon" :label="icon" v-for="icon in icons" size="mini" style="margin:2px 8px;"><i :class="icon"></i></el-radio-button>
                                </el-radio-group>
                            </p>
                            <el-button slot="reference" type="text" size="mini">选择图标</el-button>
                        </el-popover>
                    </el-form-item>
                    <el-form-item prop="order" label="顺序">
                        <el-input-number v-model="addForm.order" :min="1" label="顺序"></el-input-number>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="closeAddMenu">取消</el-button>
                        <el-button type="primary" @click="addMenu">添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-card>
        <el-card class="space-card main-card" style="margin:0;">
            <el-form :model="editMenuForm" :rules="editMenuFormRules" ref="editMenuForm" size="mini">
                <el-table :data="tableData" style="width:100%" size="mini" border>
                    <el-table-column label="名称">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.name }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="name">
                                    <el-input v-model="editMenuForm.name" style="max-width: 200px"></el-input>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" width="120px">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                <template v-for="type in menuTypes">
                                    <template v-if="type.id==scope.row.type">{{ type.name }}</template>
                                </template>
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="type">
                                    <el-select v-model="editMenuForm.type" placeholder="请选择类型" size="mini">
                                        <el-option :key="type.id" :label="type.name" :value="type.id" v-for="type in menuTypes"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="父菜单">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                <template v-for="menu in menuOptions">
                                    <template  v-if="menu.id==scope.row.parentId">
                                        {{ menu.name }}
                                    </template>
                                </template>
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="parentId">
                                    <el-select v-model="editMenuForm.parentId" placeholder="请选择父菜单" size="mini">
                                        <template v-for="menu in menuOptions">
                                            <el-option :key="menu.id" :label="menu.name" :value="menu.id" v-if="menu.parentId==0 || menu.id==0"></el-option>
                                        </template>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="图标">
                        <template slot-scope="scope">
                            <i :class="scope.row.icon" v-if="scope.row.icon"></i>
                            <span v-else>无</span>
                            <el-popover placement="right" width="160" trigger="click" >
                                <p>
                                    <el-radio-group v-model="editIcon">
                                        <el-radio-button label="" size="mini" style="margin:2px 8px;">无</el-radio-button>
                                        <el-radio-button :key="icon" :label="icon" v-for="icon in icons" size="mini" style="margin:2px 8px;"><i :class="icon"></i></el-radio-button>
                                    </el-radio-group>
                                </p>
                                <div style="text-align: right; margin: 0">
                                    <el-button type="primary" size="mini" @click="updIcon(scope.row)" >确定</el-button>
                                </div>
                                <el-button slot="reference" type="text" @click="editIcon=scope.row.icon" size="mini">修改</el-button>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="请求路径" min-width="120px">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                <template v-if="scope.row.type=='1'">无</template>
                                <template v-if="scope.row.type=='2'">
                                    {{ scope.row.url }}
                                </template>
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item prop="url">
                                    <el-input v-model="editMenuForm.url" style="max-width: 300px"></el-input>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="顺序">
                        <template slot-scope="scope">
                            <template v-if="editIndex!=scope.$index">
                                {{ scope.row.order }}
                            </template>
                            <template v-if="editIndex==scope.$index">
                                <el-form-item>
                                    <el-input-number v-model="editMenuForm.order" :min="1"></el-input-number>
                                </el-form-item>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="120px">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleSaveEdit(scope.row)" v-if="editIndex==scope.$index">保存</el-button>
                            <el-button size="mini" @click="handleCloseEdit" v-if="editIndex==scope.$index">取消</el-button>
                            <el-button size="mini" @click="handleOpenEdit(scope.$index, scope.row)" v-if="editIndex!=scope.$index">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="total, prev, pager, next" :page-size="20" :total="total" @current-change="handleCurrentChange"></el-pagination>
            </el-form>

        </el-card>
    </div>
</template>

<script>
    import qs from 'qs';
    export default {
        name: 'Menu',
        created(){
            this.findMenuOptions();
            this.searchMenus(1);
        },
        computed:{
            icons(){
                return this.$store.getters.icons;
            },
        },
        data: function () {
            var $this = this;
            var addPathValidator = function (rule, value, callback) {
                if($this.addForm.type=='2'){
                    if (value === '') {
                        callback(new Error('请输入请求路径'));
                    } else {
                        callback();
                    }
                }else{
                    callback();
                }
            };
            var editPathValidator = function (rule, value, callback) {


                if($this.editMenuForm.type=='2'){
                    if (value === '') {
                        callback(new Error('请输入请求路径'));
                    } else {
                        callback();
                    }
                }else{
                    callback();
                }
            };
            var addIconValidator = function (rule, value, callback) {
                // debugger
                // if(this.addForm.parentId=='0'){
                //     if (value === '') {
                //         callback(new Error('请选择图标'));
                //     } else {
                //         callback();
                //     }

                // }else{
                    callback();
                // }
            };
            return {
                menuTypes:[{'id':1, 'name':'目录'},{'id':2, 'name':'页面'}],
                tableData:[],
                menuOptions:[],
                name:'',
                parentId:'',
                defaultSearchForm:{name:'', parentId:''},
                submitLoading:false,
                addFormFlag:false,
                addForm:{name:'', type:'', parentId:'', url:'', icon:'', order:1},
                addFormRules:{
                    name: [{ required: true, message: '请输入资源名称', trigger: ['blur','change'] }],
                    type: [{ required: true, message: '请输入菜单类型', trigger: ['blur','change'] }],
                    parentId: [{ required: true, message: '请选择父菜单', trigger: ['blur','change'] }],
                    url: [{ validator:addPathValidator, trigger: ['blur','change'] }],
                    icon: [{ validator:addIconValidator, trigger: ['blur','change'] }],
                },
                editIcon:'',
                editIndex:2000,
                editMenuForm:{id:'', name:'', type:'', parentId:'', url:'', icon:'', order:1},
                editMenuFormRules:{
                    name: [{ required: true, message: '请输入资源名称', trigger: ['blur','change'] }],
                    type: [{ required: true, message: '请输入菜单类型', trigger: ['blur','change'] }],
                    parentId: [{ required: true, message: '请选择父菜单', trigger: ['blur','change'] }],
                    url: [{ validator:editPathValidator, trigger: ['blur','change'] }],
                },
                total:0,

            };
        },
        methods:{
            searchBtnClick:function(){
                var $this =this;
                $this.defaultSearchForm = {'name':$this.name, 'parentId':$this.parentId};
                $this.searchMenus(1);
            },
            searchMenus:function(pageNum){

                this.$axios.post('/api/menu/menus',qs.stringify({
                    'name':this.defaultSearchForm.name,
                    'parentId':this.defaultSearchForm.parentId,
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
                var $this =this;
                $this.searchMenus(val);
            },
            openAddMenuForm:function(){
                var $this =this;
                $this.addForm={name:'',url:'', type:'', parentId:'', icon:'el-icon-arrow-right', order:1};
                $this.addFormFlag = true;
            },
            closeAddMenu:function(){
                var $this =this;
                $this.addForm={name:'',url:'',type:'', parentId:'', icon:'el-icon-arrow-right', order:1};
                $this.addFormFlag=false;
            },
            addMenu:function(){
                var $this = this;
                this.$refs['addForm'].validate(function(valid){
                    if (valid) {


                        $this.$axios.post('/api/menu/add/',{
                            'name':$this.addForm.name,
                            'type':$this.addForm.type,
                            'parentId':$this.addForm.parentId,
                            'url':$this.addForm.url,
                            'icon':$this.addForm.icon,
                            'order':$this.addForm.order,
                        }).then(res=>{

                            // 成功后执行
                            if(res.data.errCode===0){
                                $this.$message.success('添加成功');
                                $this.findMenuOptions();
                                $this.searchMenus(1);
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
                var $this = this;
                $this.editMenuForm = {id:row.id,name:row.name,url:row.url,
                    type:row.type, parentId:row.parentId, icon:row.icon, order:row.order};
                $this.editIndex = index;
            },
            handleCloseEdit:function(){
                var $this = this;
                $this.editMenuForm = {id:'',name:'',url:'',type:'', parentId:'', icon:'el-icon-arrow-right', order:1};
                $this.editIndex = 2000;

            },
            handleDel:function(index,row){

                var $this = this;
                $this.$confirm('此操作将永久删除'+row.url+'菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    $this.$axios.post('/api/menu/del/',qs.stringify({
                        'id':row.id,
                    })).then(res=>{

                        // 成功后执行
                        if(res.data.errCode===0){
                            $this.tableData.splice(index, 1);
                            $this.$message.success('删除成功');
                            $this.findMenuOptions();
                            $this.searchMenus(1);
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
                if(this.editMenuForm.name==row.name
                    && $this.editMenuForm.type==row.type
                    && $this.editMenuForm.parentId==row.parentId
                    && $this.editMenuForm.order==row.order
                    && $this.editMenuForm.icon==row.icon
                    && $this.editMenuForm.url==row.url){
                    $this.editIndex=2000;
                    $this.$message.success('修改成功');
                }else{
                    this.$refs['editMenuForm'].validate(function(valid){

                        if (valid) {
                            $this.$axios.post('/api/menu/edit/',({
                                'id':$this.editMenuForm.id,
                                'name':$this.editMenuForm.name,
                                'type':$this.editMenuForm.type,
                                'parentId':$this.editMenuForm.parentId,
                                'url':$this.editMenuForm.url,
                                'icon':$this.editMenuForm.icon,
                                'order':$this.editMenuForm.order,
                            })).then(res=>{
                                // 成功后执行
                                if(res.data.errCode===0){
                                    row.name=$this.editMenuForm.name;
                                    row.type=$this.editMenuForm.type;
                                    row.parentId=$this.editMenuForm.parentId;
                                    row.url=$this.editMenuForm.url;
                                    row.icon=$this.editMenuForm.icon;
                                    row.order=$this.editMenuForm.order;
                                    $this.editIndex=2000;
                                    $this.$message.success('修改成功');
                                    $this.findMenuOptions();
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
            getMenuLabel(id){
                for(let menuIndex in this.menuOptions){
                    let menu = this.menuOptions[menuIndex];
                    if(menu['id']==id){
                        return menu['name'];
                    }
                }
            },
            findMenuOptions(){
                var $this = this;
                $this.$axios.post('/api/menu/options/',qs.stringify({
                })).then(res=>{

                    // 成功后执行
                    if(res.data.errCode===0){
                        $this.menuOptions = res.data.data;
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    $this.$message.error('服务器有异常，请稍后重试');
                });

            },
            updIcon:function(row){
                var $this = this;
                row.icon = $this.editIcon;
                $this.editIndex = 2000;
                $this.$axios.post('/api/menu/icon/upd/',({
                    'id':row.id,
                    'icon': row.icon
                })).then(res=>{
                    // 成功后执行
                    if(res.data.errCode===0){
                        // this.menuOptions = res.data.data;
                    }else{
                        // todo 错误处理
                    }
                }).catch(err=>{
                    // 失败后执行
                    $this.$message.error('服务器有异常，请稍后重试');
                });
            }
        }

    }
</script>

<style lang="scss">
    .search-form{
        .el-form-item div{
            padding-right: 5px;
        }
    }

</style>
