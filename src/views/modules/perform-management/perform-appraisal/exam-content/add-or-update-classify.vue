<template>
  <el-dialog
    :title="!dataForm.id ? '新增分类' : '编辑分类'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="考核分类" prop="name">
            <el-input v-model="dataForm.name" clearable></el-input>
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
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: 0,
          name: ''
        },
        dataRule: {
          name: [
            { required: true, message: '请填写考核分类', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/info`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'level': 1
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.assessmentStandard.categoryName
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
              'level': 1
            }
            if (this.dataForm.id) {
              data = {
                'id': this.dataForm.id || undefined
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...data,
                'name': this.dataForm.name.trim()
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
