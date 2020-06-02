<template>
    <div class="choose">
        <el-card class="space-card" style="margin:20px;">
            <el-form size="mini" class="search-form">
                <el-form-item label="选择上传要解析的文件" size="mini">
                    <el-upload
                            multiple="multiple"
                            class="upload-demo"
                            ref="upload"
                            action="/api/cv/input"
                            :on-success="handleSuccess"
                            :beforeUpload="beforeAvatarUpload"
                            :file-list="fileList"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">上传文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传docx、doc、pdf文件，且不超过10MB</div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="space-card" style="margin: 20px;">
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="5"></el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="nextStep" size="mini" style="width: 80px;">保 存</el-button>
                </el-col>

                <el-col :span="6">
                    <el-button type="primary" size="mini" @click="removeFile" style="width: 80px;">取 消</el-button>
                </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="20">
                    <template>
                        <table class="mailTable">
                            <tr v-for="(index,key) in rowCount" :key="key" class="mail-tr">
                                <td class="column">{{tableOne[index*3-3].infoName}}</td>
                                <td>{{tableOne[index*3-3].infoValue}}</td>
                                <td class="column">{{tableOne[index*3-2] !== undefined ? tableOne[index*3-2].infoName : ''}}</td>
                                <td>{{tableOne[index*3-2] !== undefined ? tableOne[index*3-2].infoValue : ''}}</td>
                                <td class="column">{{tableOne[index*3-1] !== undefined ? tableOne[index*3-1].infoName : ''}}</td>
                                <td>{{tableOne[index*3-1] !== undefined ? tableOne[index*3-1].infoValue : ''}}</td>
                            </tr>
                        </table>
                    </template>
                </el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="20">
                    <table class="mailTable" style="margin-top: 0;border-top: none;" v-loading="loading">
                        <tr v-for="(index,key) in tableTwo" :key="key">
                            <td class="column">{{index.modelName}}</td>
                            <td class="td-table">{{index.content}}</td>
                        </tr>
                    </table>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "choose",
        data(){
            return{
                fileList: [],
                tableOne: [],
                tableTwo:[],
                tableData: [],
                loading: false,
            }
        },
        computed: {
            rowCount: function() {
                return Math.ceil(this.tableOne.length/3);
            }
        },
        methods: {
            // 文件上传之前限制
            beforeAvatarUpload(file){
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = testmsg === 'docx'
                const extension2 = testmsg === 'doc'
                const extension3 = testmsg === 'pdf'
                const isLt2M = file.size / 1024 / 1024 < 10
                if(!extension && !extension2 &&!extension3) {
                    this.$message({
                        message: '上传文件只能是 docx、doc、pdf!',
                        type: 'warning'
                    });
                }
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 10MB!',
                        type: 'warning'
                    });
                }
                return extension || extension2 || extension3 && isLt2M
            },

            // 上传按钮
            submitUpload() {
                this.$refs.upload.submit();
            },

            //  处理数据
            setTable(){
                for(let i = 0;i<this.tableOne.length;i++) {
                    if (this.tableOne[i].infoValue === null || this.tableOne[i].infoValue === '') {
                        this.tableOne.splice(i,1)
                    }
                }
                for(let i = 0;i<this.tableTwo.length;i++) {
                    if (this.tableTwo[i].content === null || this.tableTwo[i].content === '') {
                        this.tableTwo.splice(i,1)
                    }
                }
            },

            // 上传成功触发
            handleSuccess(response){
                this.loading = true
                setTimeout(()=>{
                        if(response.errCode===0){
                            this.tableData = response.data;
                            // eslint-disable-next-line no-console
                            console.log(this.tableData)
                            this.tableOne = this.tableData[1]
                            this.tableTwo = this.tableData[0]
                            //this.tableTwo.splice(0,1)
                            this.setTable()
                            this.loading = false
                        }else {
                            this.loading = false
                            this.$message.error('服务器有异常，请稍后重试')
                        }
                    }
                    ,500)
            },

            // 取消按钮
            removeFile(){
                this.tableOne=[]
                this.tableTwo=[]
                this.$refs.upload.clearFiles()
            },
            // 保存按钮
            nextStep(){
                if (this.tableData.length !== 0){
                    this.$message.success('保存成功')
                    this.removeFile()
                } else {
                    this.$message.warning('未匹配到文件')
                }
            }
        }
    }
</script>

<style scoped>
    /*.button-foot{*/
    /*margin: 0 0 50px 400px;*/
    /*}*/


    .mailTable{font-size: 12px;color: #71787E; border-collapse: collapse;min-width: 850px;
        border: none;margin: 50px auto;}
    .mailTable tr, .mailTable tr td{}
    .mailTable tr td{  border:1px solid #E6EAEE;width: 170px;
        min-width: 40px; height: 35px; line-height: 35px;
        box-sizing: border-box; padding: 0 10px; }
    .mailTable tr .column{background-color: #EFF3F6; color: #393C3E;max-width: 100px;text-align: center;}
    td{border: solid #000 1px;color: #009688;}

    .mailTable tr .td-table{
        text-indent: 50px;
        max-width: 780px;width: 750px;height: 220px;padding: 12px;
        max-height: 220px;
        box-sizing: border-box;
        overflow: auto;
        text-overflow: ellipsis;
        display: -webkit-box;
    }
    .mail-tr td{
        display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
</style>
