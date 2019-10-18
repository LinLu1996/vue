<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
           label-width="90px">
    <el-row>
      <el-col :span="6">
        <el-form-item label="考核月度" prop="month">
          <el-date-picker
            style="width: 100%"
            v-model="dataForm.month"
            type="month"
            placeholder="选择考核月度">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="承运商" prop="carrierId">
          <xkl-select style="width: 100%"  v-model="dataForm.carrierId" linkage="/transresources/trcarrier/noPowerList" labelType="carrierName" placeholder="承运商"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="考核模板" prop="templateId">
          <xkl-select style="width: 100%" v-model="dataForm.templateId" keyType="id" labelType="templateName" placeholder="考核模板" linkage="/performancemanagement/tkpiassessmenttemplate/list"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="text-align: right">
        <el-button type="primary" @click="dataFormSubmit()">生成</el-button>
        <el-button @click="visible = false">保存</el-button>
      </el-col>
    </el-row>
    <template-view v-if="templateShow" :templateData="templateData"></template-view>
    <div v-else style="color: #eeeeee; font-size: 80px; text-align: center;height: 500px;line-height: 500px">点击右上角生成模板</div>
  </el-form>
</template>
<script>
  // import { formatDate } from '../../../../utils';
  import TemplateView from '../perform-appraisal/exam-template/template-view'
  export default {
    data () {
      return {
        dataForm: {
          id: 0,
          month: '',
          carrierId: '',
          templateId: '',
          name: ''
        },
        clickFlag: true,
        templateData: {},
        templateShow: false,
        dataRule: {
          month: [
            { required: true, message: '请选择考核月度', trigger: 'change' }
          ],
          carrierId: [
            { required: true, message: '请选择承运商', trigger: 'change' }
          ],
          templateId: [
            { required: true, message: '请选择考核模板', trigger: 'change' }
          ]
        },
        tableData: [],
        initialData: [],
        spanArr: [],
        position: 0
      }
    },
    components: {
      TemplateView
    },
    created () {
      this.init()
    },
    methods: {
      init () {
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentrecord/generate`),
              method: 'post',
              data: this.$http.adornData({
                'templateId': this.dataForm.templateId || undefined
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.templateShow = true
                this.templateData = data.tKpiAssessmentTemplate.kpiTemplateRelationEntityList
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
.table-wrap{
  h2{
    text-align: center;
    letter-spacing: 5px;
  }
  p{
    letter-spacing: 5px;
    span:nth-child(1) {
      margin-left: 10px;
    }
    span:nth-child(2) {
      float: right;
      margin-right: 20px;
    }
  }
  /deep/.el-table__body tr:hover>td{
    background-color: #ffffff!important;
  }
}
</style>
