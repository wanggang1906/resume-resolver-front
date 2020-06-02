<template>
    <el-card class="space-card" style="margin: 20px;">
        <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="4"></el-col>
            <el-col :span="6">
                <el-button type="primary" @click="lastStep" size="mini">上一步</el-button>
            </el-col>

            <el-col :span="6">
                <el-button type="primary" size="mini" @click="xiaStep" style="width: 80px;">继续上传</el-button>
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
                        <td class="column col-table">{{index.modelName}}</td>
                        <td class="td-table">{{index.content}}</td>
                    </tr>
                </table>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import qs from 'qs'
    export default {
        name: "information",
        data(){
            return{
                tableOne: [],
                tableTwo:[],
                loading: false,
                useId: ''
            }
        },
        mounted(){
            this.useId = this.$route.params.id
            this.getStepTable()
        },
        computed: {
            rowCount: function() {
                return Math.ceil(this.tableOne.length/3);
            }
        },
        methods:{
            getStepTable(){
                this.loading = true
                setTimeout(()=>{
                    this.$axios.post('/api/cv/PreviewFile',qs.stringify({
                        'uploadId':this.useId
                    })).then(res=>{
                        if (res.data.errCode === 0) {
                            console.log(res)
                            this.tableOne = res.data.data[1]
                            this.tableTwo = res.data.data[0]
                            this.setTable()
                            this.loading = false
                        }
                    }).catch(()=>{
                        //console.log(err)
                        this.$message.error('服务器有异常，请稍后重试');
                    })
                },500)
            },
            //  处理数据
            setTable(){
                for(let i = 0;i<this.tableOne.length;i++) {
                    if (this.tableOne[i].infoValue === null || this.tableOne[i].infoValue === '') {
                        this.tableOne.splice(i,1)
                    }
                }
                for(let j = 0;j<this.tableTwo.length;j++) {
                    if (this.tableTwo[j].content === null || this.tableTwo[j].content === '') {
                        this.tableTwo.splice(j,1)
                        console.log(this.tableTwo[j])
                    }
                }
                console.log(this.tableOne)
                console.log(this.tableTwo)
            },
            // 上一步按钮
            lastStep(){
                this.$router.push('/leading')
            },
            //  继续上传按钮
            xiaStep(){
                this.$router.push('/choose')
            }
        },
    }
</script>

<style scoped>
    .space-card{min-height: 500px;}
    .mailTable{font-size: 12px;color: #71787E; border-collapse: collapse;min-width: 850px;
        border: none;margin: 50px auto;}
    .mailTable tr, .mailTable tr td{}
    .mailTable tr td{  border:1px solid #E6EAEE;width: 170px;
        min-width: 40px; height: 35px; line-height: 35px;
        box-sizing: border-box; padding: 0 10px; }
    .mailTable tr .column{background-color: #EFF3F6; color: #393C3E;max-width: 100px;text-align: center;}
    .mailTable tr .col-table{width: 70px;}
    .td-table{text-indent: 50px;}
    td{border: solid #000 1px;color: #009688;}
    .mail-tr td{
        display:inline-block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
</style>
