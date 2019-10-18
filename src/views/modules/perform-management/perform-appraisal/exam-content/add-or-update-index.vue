<template>
  <el-dialog
    :title="type === 'add' ? '新增指标' : '编辑指标'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="考核分类" prop="categoryName">
            <el-input v-model="dataForm.categoryName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="考核项目" prop="projectName">
            <el-input v-model="dataForm.projectName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="考核指标" prop="targetName">
            <el-input v-model="dataForm.targetName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="配置公式" prop="configType">
            <xkl-select style="width: 100%" v-model="dataForm.configType" select-type="CONFIG_TYPE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dataForm.configType === '1'">
          <el-form-item label="分子" prop="numerator">
            <el-input v-model="dataForm.numerator" maxlength="5"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dataForm.configType === '1'">
          <el-form-item label="分母" prop="denominator">
            <el-input v-model="dataForm.denominator" maxlength="5"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.configType === '2'">
          <el-form-item label="公式" prop="formulaId">
            <xkl-select style="width: 100%" v-model="dataForm.formulaId" labelType="formulaName" placeholder="公式" linkage="/performancemanagement/kpiformulaconfig/noPowerList"></xkl-select>
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
      let verifyPositiveZero = (rule, value, callback) => {
        if (isNaN(value) || value === 0) {
          callback(new Error('请输入不等于0的数字'))
        }
        callback()
      }
      let verifyParseInt = (rule, value, callback) => {
        let patrn = /^[0-9][0-9]{0,4}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入不超过5位的正整数'))
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: 0,
          categoryName: '',
          projectName: '',
          targetName: '',
          configType: '',
          numerator: '',
          denominator: '',
          formulaId: ''
        },
        dataRule: {
          targetName: [
            { required: true, message: '请输入考核指标', trigger: 'blur' }
          ],
          denominator: [
            { validator: verifyPositiveZero, trigger: 'blur' }
          ],
          numerator: [
            { validator: verifyParseInt, trigger: 'blur' }
          ]
        },
        type: '',
        standardCode: '',
        parentId: ''
      }
    },
    watch: {
      'dataForm.configType' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.formulaId = ''
          this.dataForm.numerator = ''
          this.dataForm.denominator = ''
        }
      }
    },
    methods: {
      init (row, type) {
        this.clickFlag = true
        this.visible = true
        this.dataForm.id = row.id || 0
        this.type = type || ''
        this.parentId = row.id || ''
        this.standardCode = row.standardCode || ''
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
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
              this.dataForm.targetName = data.assessmentStandard.targetName
              this.dataForm.configType = data.assessmentStandard.configType ? data.assessmentStandard.configType.toString() : ''
              this.dataForm.numerator = data.assessmentStandard.numerator !== null ?  data.assessmentStandard.numerator : ''
              this.dataForm.denominator = data.assessmentStandard.denominator !== null ? data.assessmentStandard.denominator : ''
              this.dataForm.formulaId = data.assessmentStandard.formulaId !== null ? data.assessmentStandard.formulaId : ''
            }
          })
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
              'configType': this.dataForm.configType || undefined,
              'numerator': this.dataForm.numerator || undefined,
              'denominator': this.dataForm.denominator || undefined,
              'formulaId': this.dataForm.formulaId || undefined,
              'standardCode': this.standardCode || undefined,
              'level': 3
            }
            if (this.type === 'edit') {
              data = {
                'id': this.dataForm.id || undefined,
                'configType': this.dataForm.configType || undefined,
                'numerator': this.dataForm.numerator || undefined,
                'denominator': this.dataForm.denominator || undefined,
                'formulaId': this.dataForm.formulaId || undefined
              }
            }
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmentstandard/${this.type === 'add' ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...data,
                'name': this.dataForm.targetName.trim()
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
