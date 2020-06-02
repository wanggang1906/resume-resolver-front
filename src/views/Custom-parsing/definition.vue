<template>
    <div class="definition">
        <el-card class="space-card" style="margin: 20px;">
            <el-row type="flex" class="row-bg" justify="center" style="margin-top: 10px;">
                <el-col :span="13">
                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" size="mini" class="search-form">
                        <el-form-item
                                prop="name"
                                label="模块名"
                                :rules="[
      { required: true, message: '请输入模块名', trigger: 'blur' },
      { message: '请输入模块名', trigger: 'blur,change' }
    ]"
                        >
                            <el-input style="max-width: 240px;" placeholder="模块名"
                                      maxlength="15"
                                      @focus="focus =1" @blur="focus = 0"
                                      v-model="dynamicValidateForm.name"></el-input>
                            <span v-show="focus==1" style="font-size: 12px;margin-left: 5px;color: #F56C6C;">
                                * 输入不得超过15个字符</span>
                        </el-form-item>
                        <el-form-item
                                v-for="(domain, index) in dynamicValidateForm.domains"
                                label="关键字"
                                :key="domain.key"
                                :prop="'domains.' + index + '.value'"
                                :rules="{
      required: true, message: '字段框不能有空', trigger: 'blur'
    }"
                        >
                            <el-input v-model="domain.value" placeholder="关键字"
                                      maxlength="15"
                                      @focus="focus =1" @blur="focus = 0"
                                      style="max-width: 240px;"></el-input>
                            <el-button type="primary" style="margin-left: 8px;"
                                       @click.prevent="removeDomain(domain)" icon="el-icon-minus"></el-button>
                            <el-button type="primary" @click="addDomain" icon="el-icon-plus"></el-button>
                        </el-form-item>
                        <el-form-item
                                v-for="(domain2, index2) in dynamicValidateForm.domains2"
                                label="属性名"
                                :key="domain2.key"
                                style="margin-left: 40px;"
                                :prop="'domains2.' + index2 + '.value'"
                                :rules="{
      required: true, message: '属性值不能为空', trigger: 'blur'
    }"
                        >
                            <el-input v-model="domain2.value" placeholder="属性值"
                                      maxlength="15"
                                      @focus="focus =1" @blur="focus = 0"
                                      style="max-width: 200px;"></el-input>
                            <el-button type="primary" @click.prevent="removeDomain2(domain2)"
                                       icon="el-icon-minus" style="margin-left: 8px;" ></el-button>
                        </el-form-item>


                        <el-form-item >
                            <el-button type="primary" style="margin: 20px 0 20px -60px;" @click="submitForm('dynamicValidateForm')">确定</el-button>
                            <el-button type="primary" @click="resetForm('dynamicValidateForm')">取消</el-button>
                            <el-button type="primary" @click="addDomain2" icon="el-icon-plus">属性值</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="2"></el-col>
                <el-col :span="9">
                    <div class="tip-border">
                        <div class="header-rule">规则导航</div>
                        <div class="divider-css" style="margin: 0 0 8px 0;"></div>
                        <span class="divider-span">每次可输入一类模块名，并在下方生成预览</span>
                        <div class="divider-css" style="margin: 8px 0 8px 0;"></div>
                        <span class="divider-span">关键字为模块名的相似字段</span>
                        <div class="divider-css" style="margin: 8px 0 8px 0;"></div>
                        <span class="divider-span">基本信息提供二级解析，可为其添加属性值</span>
                        <div class="divider-css" style="margin: 8px 0 8px 0;"></div>
                        <span class="divider-span" style="margin-left: 7px;">示例:(模块名-基本信息,关键字-个人信息,属性名-姓名)</span>
                        <div class="divider-css" style="margin: 8px 0 17px 0;"></div>
                    </div>
                </el-col>
                <el-col :span="2"></el-col>

            </el-row>
        </el-card>

        <el-card class="space-card" style="margin: 20px;">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="18">
                    <div class="model-show">
                        <el-row type="flex" class="row-bg" justify="space-between">
                            <el-col :span="6">
                                <el-tag size="medium" style="width: 300px;letter-spacing:8px;" type="info">提 示 : 输入完成可查看详情</el-tag>
                                <!--<el-tag size="medium" style="width: 370px;letter-spacing:1px;" type="info">示例:(模块名-基本信息,关键字-个人信息,属性名-姓名)</el-tag>-->
                            </el-col>
                            <el-col :span="3"></el-col>
                            <el-col :span="9">
                                <el-button round style="letter-spacing:1px"
                                           @click="getHistoryData()">查看历史</el-button>
                                <el-button round :disabled="disabled" @click="submitData">提交</el-button>
                                <el-button round :disabled="disabled" @click="removeData">重置</el-button>
                            </el-col>
                        </el-row>


                        <template v-if="showButton">
                            <el-card :key="index" v-for="(item,index) in lists">
                                <h3 style="margin-top: 0">
                                    <el-row type="flex" class="row-bg" justify="space-between">
                                        <el-col :span="12">
                                            <span class="el-nature">模块名：</span>
                                            <span style="margin-left: 15px;">{{item.modelName}}</span>
                                        </el-col>
                                        <el-col :span="6">
                                            <i class="el-icon-edit" @click="reviseData(index)"
                                               style="cursor:pointer;margin:0 20px 0 50px;"></i>
                                            <i class="el-icon-delete" @click="delModel(index)"
                                               style="cursor:pointer;margin:0 5px;"></i>
                                        </el-col>
                                    </el-row>
                                </h3>

                                <span class="el-nature">关键字：</span>
                                <el-tag
                                        :key="num"
                                        v-for="(list, num) in item.fieldName"
                                        style="margin: 3px 10px;height: 35px;line-height: 35px;"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(index,num)">
                                    {{list.value}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="editIndex==index"
                                        v-model="editKeyword"
                                        style="width: 100px;"
                                        :ref="'savePosition'+index"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(index)"
                                        @blur="handleInputConfirm(index)"
                                ></el-input>
                                <el-button v-else class="button-new-tag el-addButton" style="color: #009688" size="small" @click="addKeyword(index)">添加关键字
                                </el-button>


                                <div style="margin-top: 15px;">
                                    <span class="el-nature">属性值：</span>
                                    <el-tag
                                            :key="natureId"
                                            v-for="(list, natureId) in item.attributeName"
                                            style="margin: 3px 10px;height: 35px;line-height: 35px;"
                                            closable
                                            type="warning"
                                            :disable-transitions="false"
                                            @close="handleClose2(index,natureId)">
                                        {{list.value}}
                                    </el-tag>
                                    <el-input
                                            class="input-new-tag"
                                            v-if="natureIndex==index"
                                            v-model="natureWord"
                                            style="width: 100px;height: 35px;line-height: 35px;"
                                            :ref="'savePosition'+index"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm2(index)"
                                            @blur="handleInputConfirm2(index)"
                                    ></el-input>
                                    <el-button v-else class="button-new-tag el-addButton" size="small" @click="addKeyword2(index)">添加属性值
                                    </el-button>
                                </div>


                            </el-card>

                        </template>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <el-dialog title="修改模块名" :visible.sync="dialogFormVisible">
            <el-form :model="form" @submit.native.prevent>
                <el-form-item label="模块名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" style="width: 300px;"
                              ref="inputModel"
                              @keyup.enter.native="showDialog(1)">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialog(-1)">取 消</el-button>
                <el-button type="primary" @click="showDialog(1)">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="历史输入" :visible.sync="dialogFormHistory">
            <el-table
                    :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
                    style="width: 100%">
                <el-table-column
                        label="修改时间"
                        width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="版本号"
                        width="180">
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.ruleUploadCount }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                    :page-size="PageSize"
                    :total="total">
            </el-pagination>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: "definition",
        data(){
            return{
                showButton: false,
                disabled:true,
                focus: 0,
                item: [],
                activeNames: ['1'],
                lists: [],
                dynamicValidateForm: {
                    domains: [{
                        value: ''
                    }],
                    domains2:[],
                    name: ''
                },
                dynamicTags:[],
                dialogFormVisible: false,
                dialogFormHistory: false,
                form: {
                    name: '',
                },
                formLabelWidth: '120px',
                editIndex:-1,
                natureIndex: -1,
                natureWord:'',
                editKeyword:'',
                listId: 0,
                PageSize: 7,
                currentPage:1,//默认开始页面
                tableData:[],
                total: 0,
            }
        },
        mounted(){
            this.getInitializeData()
        },
        methods:{
            // 获取数据
            getInitializeData(){
                this.$axios.post('/api/cv/initializeRulePackage').then(res=>{
                    if (res.data.errCode === 0) {
                        this.item = JSON.parse(res.data.data)
                        this.getData()
                        this.disabled = false
                        this.showButton = true
                    }
                }).catch(()=>{
                    // console.log('暂无规则')
                })
            },

            // 获取随机ID
            generateId (){
                let min = 100;
                let max = 999;
                min = Math.ceil(min);
                max = Math.floor(max);
                let randomNumber = Math.floor(Math.random()*(max-min))+min;
                return new Date().getTime()+''+randomNumber;
            },

            // 刷新数据
            getData(){
                this.lists = this.item
            },

            // 减少关键字input
            removeDomain(item) {
                let index = this.dynamicValidateForm.domains.indexOf(item)
                if (this.dynamicValidateForm.domains.length>1) {
                    this.dynamicValidateForm.domains.splice(index, 1)
                }
            },

            // 增加关键字input  (添加ID)
            addDomain() {
                this.dynamicValidateForm.domains.push({
                    value: '',
                });
            },

            // 减少属性值的input框
            removeDomain2(item) {
                var index = this.dynamicValidateForm.domains2.indexOf(item)
                if (index !== -1) {
                    this.dynamicValidateForm.domains2.splice(index, 1)
                }
            },

            //  添加属性值的input框  (添加ID)
            addDomain2() {
                this.dynamicValidateForm.domains2.push({
                    value: '',
                });
            },

            // 表单的确定按钮  (添加ID)
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.disabled = false
                        let list = {
                            id: this.generateId(),
                            modelName: this.dynamicValidateForm.name,
                            fieldName: this.dynamicValidateForm.domains,
                            attributeName: (this.dynamicValidateForm.domains2 === [])? [] : this.dynamicValidateForm.domains2
                        }
                        this.item.push(list)
                        this.$message.success('添加成功')
                        this.getData()
                        this.dynamicValidateForm.name = ''
                        this.dynamicValidateForm.domains = [{value:''}]
                        this.dynamicValidateForm.domains2 = []
                        this.showButton = true
                    } else {
                        return false;
                    }
                });
            },

            // 表单取消按钮
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 获取历史数据
            getHistoryData(){
                this.dialogFormHistory = true
                this.$axios.post('/api/cv/historyRule').then(res=>{
                    if (res.data.errCode === 0) {
                        this.tableData = res.data.data.reverse()
                        this.total = this.tableData.length
                    }
                }).catch(()=>{
                    this.$message.error('服务器有异常，请稍后重试');
                })
            },

            // 详情按钮
            handleEdit(index, row) {
                if (this.lists.length !== 0){
                    this.$confirm('检测到有待提交的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const useId = row.versionNumber
                        this.$axios.post('/api/cv/showDetailRule',qs.stringify({
                            'versionNumber': useId
                        })).then(res=>{
                            if (res.data.errCode === 0) {
                                this.item = []
                                this.item = JSON.parse(res.data.data)
                                if (this.item.length>0){
                                    this.getData()
                                    this.disabled = false
                                    this.showButton = true
                                    this.dialogFormHistory = false
                                }
                            }
                        }).catch(()=>{
                            this.$message.info('该记录丢失，请选择其他记录')
                        })
                    }).catch(() => {
                        this.dialogFormHistory = false
                    });
                } else {
                    const useId = row.versionNumber
                    this.$axios.post('/api/cv/showDetailRule',qs.stringify({
                        'versionNumber': useId
                    })).then(res=>{
                        if (res.data.errCode === 0) {
                            this.item = []
                            this.item = JSON.parse(res.data.data)
                            if (this.item.length>0){
                                this.disabled = false
                                this.getData()
                                this.showButton = true
                                this.dialogFormHistory = false
                            }
                        }
                    }).catch(()=>{
                        this.$message.info('该记录丢失，请选择其他记录')
                    })
                }
            },

            // 删除按钮
            // handleDelete(index, row) {
            //     console.log(index, row);
            // },

            // 分页
            current_change(currentPage){
                this.currentPage = currentPage;
            },

            // 控件显隐
            showData(){
                if (this.item !== ''){
                    this.showButton = true
                    this.disabled = true
                }
            },

            // 显示模块名修改框
            reviseData(id){
                this.dialogFormVisible = true
                this.listId = id
                this.form.name = ''
                this.$nextTick(() => {
                    this.$refs['inputModel'].focus()
                })
            },

            // 标签内添加关键字一
            addKeyword(index){
                this.editIndex = index;
                this.editKeyword = '';
                this.$nextTick(() => {
                    this.$refs['savePosition' + index][0].$refs.input.focus();
                });
            },

            // 标签添加关键字二   (添加ID)
            handleInputConfirm(index){
                // 检查重复性
                let list = this.lists[index]
                let find = false;
                for (let i = 0; i < list.fieldName.length; i++) {
                    if (list.fieldName[i].value === this.editKeyword) { find = true; break;}
                    if (find) break;
                }
                if (find){
                    this.$message.warning('关键字有重复')
                    this.getData()
                }else {
                    if (this.editKeyword) {
                        let list = {
                            value: this.editKeyword
                        }
                        this.item[index].fieldName.splice(this.item[index].fieldName.length, 0, list);
                        this.$message.success("关键字添加成功")
                        this.getData()
                    }
                }
                this.editIndex = -1;
                this.editKeyword=''
            },

            // 删除标签内指定关键字
            handleClose(id,num){
                this.lists[id].fieldName.splice(num,1)
                this.$message.info("关键字删除成功")
            },

            // 标签内添加属性值一
            addKeyword2(index){
                this.natureIndex = index;
                this.natureWord = '';
                this.$nextTick(() => {
                    this.$refs['savePosition' + index][0].$refs.input.focus();
                });
            },

            // 标签添加属性值二   (可添加ID)
            handleInputConfirm2(index){
                // 检查重复性
                let list = this.lists[index]
                let find = false;
                for (let i = 0; i < list.attributeName.length; i++) {
                    if (list.attributeName[i].value === this.natureWord) { find = true; break;}
                    if (find) break;
                }
                if (find){
                    this.$message.warning('属性值有重复')
                    this.getData()
                }else{
                    if (this.natureWord){
                        let list={
                            value: this.natureWord
                        }
                        this.item[index].attributeName.splice(this.item[index].attributeName.length,0,list);
                        this.$message.success("属性值添加成功")
                        this.getData()
                    }
                }
                this.natureIndex = -1;
                this.natureWord=''
            },

            // 删除标签内指定属性值
            handleClose2(id,num){
                this.lists[id].attributeName.splice(num,1)
                this.$message.info("属性值删除成功")
            },

            // 修改模块名
            showDialog(number){
                if (number==-1){
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                    this.form.name = ''
                    this.dialogFormVisible = false
                }
                if (number ==1){
                    if (this.form.name !==''){
                        // 检查重复性
                        let find = false;
                        for (let i = 0; i < this.lists.length; i++) {
                            if (this.lists[i].modelName === this.form.name) { find = true; break;}
                            if (find) break;
                        }
                        if (find){
                            this.$message.warning('模块名有重复')
                        } else{
                            this.lists[this.listId].modelName = this.form.name
                            this.$message({type: 'success', message: '更改成功'});
                            this.dialogFormVisible = false
                            this.form.name = ''
                        }
                    }else {
                        this.$message({
                            type: 'warning',
                            message: '不能为空'
                        });
                    }
                }
            },

            // 删除部分模块
            delModel(num) {
                this.$confirm('删除该模块, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.lists.splice(num,1)
                    if (this.lists.length===0){
                        this.showButton = false
                        this.disabled = true
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            // 重置数据
            removeData(){
                this.$confirm('此操作将重置所有字段, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '重置成功!'
                    });
                    this.showButton = false
                    this.disabled = true
                    this.item = []
                    this.getData()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消重置'
                    });
                });
            },

            // 提交数据
            submitData(){
                this.$confirm('此操作将上传该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    // 检查重复性
                    var find = false;
                    for (var i = 0; i < this.lists.length; i++) {
                        for (var j = i + 1; j < this.lists.length; j++) {
                            if (this.lists[i].modelName === this.lists[j].modelName) { find = true; break;}
                        }
                        if (find) break;
                    }
                    if (find){
                        this.$message.warning('模块名有重复')
                    } else {
                        this.$axios.post('/api/cv/rule', qs.stringify({
                            'data': JSON.stringify(this.lists)
                        })).then(res=>{
                            if(res.data.errCode===0) {
                                this.$message.success('提交成功')
                                this.disabled = true
                                this.item = [];
                                this.getData()
                            }
                        }).catch(()=>{
                            // 失败后执行
                            this.$message.error('服务器有异常，请稍后重试');
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上传'
                    });
                });
            },
        },
        created() {
            this.getData()
            this.showData()
        }
    }
</script>

<style scoped>
    .model-show{
        display: inline-block;
        width: 700px;
        max-width: 800px;
        padding: 3px 5px;
        background: #f4f4f5;
        margin:0 0 100px 50px;
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .el-nature{
        font-size: 12px;
        font-weight: 400;
        letter-spacing:4px;
        margin-left: 20px;
    }
    .el-addButton{
        border: none;
        color: orange;
        font-weight: 400;
    }
    .el-addButton:hover{
        background: #ffffff;
    }
    .tip-border{
        border-radius: 30px;
        border: 2px solid #f4f4f5;
    }
    .divider-span{
        margin-left: 25px;
        color: red;
        font-size: 12px;
        letter-spacing: 1px;
        font-weight: 400;
    }
    .divider-css{
        border-top: 1px solid #DCDFE6;
    }
    .header-rule{
        font-size: 14px;font-weight: 400;
        text-align: center;
        letter-spacing: 2px;
        height: 20px;
        margin-top: 10px;
    }
</style>
