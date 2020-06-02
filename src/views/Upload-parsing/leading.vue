<template>
    <div>
        <el-card style="margin: 12px 20px;">
            <el-form :inline="true" :rules="rules" ref="ruleForm" :model="formInline" class="demo-form-inline" style="height: 28px;">
                <el-form-item label="搜索类型" prop="type">
                    <el-select v-model="formInline.type" placeholder="检索类型">
                        <el-option label="工作时间" value="工作年限"></el-option>
                        <el-option label="职位" value="职位"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索">
                    <el-input v-model="formInline.search" placeholder="输入要搜索的字段"
                              maxlength="15"
                              @keyup.enter.native="onSubmit('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('ruleForm')">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="space-card" style="margin:0 20px;">
            <el-table
                    :data="newList"
                    style="width: 100%;">
                <el-table-column
                        prop="date"
                        label="日期"
                        width="150">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.uploadDate | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="名称"
                        width="350">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            {{ scope.row.originalName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="workYears"
                        label="工作时间"
                        width="150">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper table-maxHeight">
                            {{ scope.row.workYears }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="post"
                        label="职位"
                        width="200">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper table-maxHeight">
                            {{ scope.row.post }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="right">
                    <!--<template slot="header" slot-scope="scope">-->
                        <!--<el-input-->
                        <!--v-model="search"-->
                        <!--size="mini"-->
                        <!--placeholder="输入关键字搜索（工作时间，职位）"/>-->
                    <!--</template>-->
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">查看简历</el-button>
                        <!--<el-button-->
                        <!--size="mini"-->
                        <!--type="danger"-->
                        <!--style="margin-left: 10px;"-->
                        <!--@click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="total, prev, pager, next"
                    @current-change="current_change"
                    :current-page="currentPage"
                    :page-size="10"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import moment from 'moment';
    import qs from 'qs'
    export default {
        name: "information",
        data(){
            return{
                currentPage:1,//默认开始页面
                tableData:[],
                total: 0,
                formInline: {
                    search: '',
                    type: ''
                },
                rules:{
                    type: [
                        { required: true, message: '请选择检索类型', trigger: 'change' }
                    ]
                }
            }
        },
        computed:{
            newList(){
                return this.tableData.filter(value=> {
                    return value
                })
            }
        },
        mounted(){
            this.getData()
        },
        filters:{
            dateFormat(dataStr, pattern = 'YYYY-MM-DD HH:mm'){
                let value = dataStr.slice(0,8)+'T'+dataStr.slice(8)
                if (value) {
                    return moment(value).format(pattern)
                } else {
                    return value
                }
            }
        },
        methods: {
            // 获取数据
            getData(){
                this.$axios.post('/api/cv/choosePreview',qs.stringify({
                    'type':this.formInline.type,
                    'value':this.formInline.search,
                    'pageNum':this.currentPage
                })).then(res=>{
                    if (res.data.errCode === 0) {
                        this.tableData = res.data.data.list
                        this.total = res.data.data.total
                    }
                }).catch(()=>{
                    this.$message.error('服务器有异常，请稍后重试');
                })
            },
            // 查询按钮
            onSubmit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.currentPage = 1
                        this.getData()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 详情按钮
            handleEdit(index, row)  {
                const useId = row.uploadId
                this.$router.push({path:`/information/${useId}`})
            },
            // 删除按钮
            // handleDelete(index, row) {
            //     console.log(index, row);
            // },

            // 分页
            current_change(currentPage){
                this.currentPage = currentPage;
                this.getData()
            }
        }
    }
</script>

<style scoped>
    .space-card{
        min-height: 500px;
    }
    .el-select .el-input {
        width: 130px;
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .table-maxHeight{
        max-height: 14px;
        overflow: hidden;
    }
</style>
