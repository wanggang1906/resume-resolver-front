<template>
    <el-card style="margin: 20px;">
        <!-- margin 外边距，值可有1-4个 -->
        <div class="block">
            <el-timeline>
                <el-timeline-item timestamp="1、定义解析规则" placement="top">
                    <el-card>
                        <h4>自定义字段-----<router-link to="/definition">解析字段</router-link></h4>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2、上传文件" placement="top">
                    <el-card>
                        <h4>选择文件-----<router-link to="/choose" >上传并解析</router-link></h4>
                    </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="3、文件历史查看" placement="top">
                    <el-card>
                        <h4>查看历史-----<router-link to="/leading" >历史上传文件</router-link></h4>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: 'firstpage',
    }
</script>

<style scoped>
</style>
