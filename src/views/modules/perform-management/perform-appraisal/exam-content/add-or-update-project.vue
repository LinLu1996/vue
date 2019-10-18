<template>
  <el-dialog
    :title="type === 'add' ? '新增项目' : '编辑项目'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="考核分类" prop="categoryName">
            <el-input v-model="dataForm.categoryName" disabled ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="考核项目" prop="projectName">
            <el-input v-model="dataForm.projectName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-button @click="closeForm()">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  // import contractUpload from './contract-upload'
  // import XklDatePicker from '../../../../components/global/xkl-datePicker';
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          categoryName: '',
          projectName: ''
        },
        dataRule: {
          projectName: [
            { required: true, message: '请填写考核项目', trigger: 'blur' }
          ]
        },
        type: '',
        standardCode: '',
        parentId: ''
      }
    },
    methods: {
      init (row, type) {
        this.clickFlag = true
        this.dataForm.id = row.id || 0
        this.type = type || ''
        this.parentId = row.id || ''
        this.standardCode = row.standardCode || ''
        this.visible = true
        this.dataForm.categoryName = row.name
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (type === 'edit') {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/info`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'level': row.level
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.categoryName = data.assessmentStandard.categoryName
                this.dataForm.projectName = data.assessmentStandard.projectName
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            this.clickFlag = false
            let data = {
              'parentId': this.dataForm.id || undefined,
              'standardCode': this.standardCode || undefined,
              'level': 2
            }
            if (this.type === 'edit') {
              data = {
                'id': this.dataForm.id || undefined
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/${this.type === 'add' ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...data,
                'name': this.dataForm.projectName.trim()
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      closeForm () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
