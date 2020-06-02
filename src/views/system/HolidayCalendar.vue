<template>
    <el-card>
        <el-form :form="form">

            <el-form-item label="上班时间设定:" label-width="120px">
                <el-form-item label="上午" label-width="80px">
                    <el-time-picker
                            is-range
                            v-model="form.dutyTime.morningTime"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="下午" label-width="80px">
                    <el-time-picker
                            is-range
                            v-model="form.dutyTime.afternoonTime"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item>
            </el-form-item>
            <el-form-item label="节假日设定:" label-width="120px">
                <vc-date-picker
                        v-model='form.holidays'
                        :columns="layout.columns"
                        :rows="layout.rows"
                        :is-expanded="layout.isExpanded"
                        mode="multiple"
                        is-inline
                />
            </el-form-item>
            <el-form-item label-width="120px">
                <el-button type="primary" @click="saveDutyTimes">保存</el-button>
            </el-form-item>

        </el-form>
    </el-card>
</template>

<script>
    export default {
        name: 'HolidayCalendar',
        computed: {
            layout() {
                return this.$screens(
                    {
                        // Default layout for mobile
                        default: {
                            columns: 1,
                            rows: 1,
                            isExpanded: true,
                        },
                        // Override for large screens
                        md: {
                            columns: 2,
                            rows: 2,
                            isExpanded: false,
                        },
                        // Override for large screens
                        lg: {
                            columns: 3,
                            rows: 2,
                            isExpanded: false,
                        },
                    },
                );
            }
        },
        mounted(){
            this.findDutyTimes();
        },
        data(){
            return {
                form:{
                    holidays: [
                        new Date(2019, 4, 1),
                        new Date(2019, 4, 15),
                    ],
                    dutyTime:{
                        morningTime:[],
                        afternoonTime:[]
                    }
                }
            }
        },
        methods:{
            findDutyTimes:function () {
                this.$axios.post('/api/duty/times/',qs.stringify({

                })).then(res=>{

                    // 成功后执行
                    if(res.data && res.data.errCode===0){
                        this.form = res.data.data;
                    }
                }).catch(err=>{
                    // 失败后执行
                    this.$message.error('服务器有异常，请稍后重试');
                });
            },
            saveDutyTimes:function () {
                this.$axios.post('/api/duty/times/save/',qs.stringify(form)).then(res=>{

                    // 成功后执行
                    if(res.data && res.data.errCode===0){
                        this.$message.success('保存成功');
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
