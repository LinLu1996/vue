<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="承运商名称" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList " placeholder="承运商" clearable></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="KPI月度" prop="kpiMonth">
            <xkl-date-picker type="month" v-model="dataForm.kpiMonth" placeholder="KPI月度" clearable></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划车次数" prop="planedCarNum">
            <el-input-number style="width: 100%" :min="0" :max="99999" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="dataForm.planedCarNum" placeholder="计划车次数" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="支援车次数" prop="supportCarNum">
            <el-input-number style="width: 100%" :min="0" :max="99999" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="dataForm.supportCarNum" placeholder="支援车次数" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际车次数" prop="realityCarNum">
            <el-input-number style="width: 100%" :min="0" :max="99999" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="dataForm.realityCarNum" placeholder="实际车次数" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运力满足率" prop="fillRate">
            <el-input style="width: 100%" v-model="dataForm.fillRate" disabled type="text" placeholder="运力满足率" clearable>
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="未保障车次数" prop="unprotectedNumber">
            <el-input style="width: 100%" v-model.number="dataForm.unprotectedNumber" disabled type="text" placeholder="未保障车次" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input style="width: 100%;" v-model="dataForm.remark" maxlength="160" show-word-limit type="text" placeholder="备注" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
  export default {
    components: {},
    data () {
      let verifyParseInt = (rule, value, callback) => {
        if (value === '' || value == null) {
          callback()
        }
        let r = /^[0-9][0-9]*$/;
        if (!r.test(value)) {
          callback(new Error('请输入整数'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          carrierId: '',
          kpiMonth: '',
          planedCarNum: '',
          supportCarNum: '',
          realityCarNum: '',
          fillRate: '',
          unprotectedNumber: '',
          remark: ''
        },
        dataRule: {
          carrierId: [{required: true, message: '请选择承运商', trigger: 'blur'}],
          kpiMonth: [{required: true, message: '请选择KPI月度', trigger: 'blur'}],
          planedCarNum: [
            {required: true, message: '请输入计划车次数', trigger: 'blur'},
            {validator: verifyParseInt, trigger: 'change'}
          ],
          supportCarNum: [
            {validator: verifyParseInt, trigger: 'change'}
          ],
          realityCarNum: [
            {required: true, message: '请输入实际车次数', trigger: 'blur'},
            {validator: verifyParseInt, trigger: 'change'}
          ],
          fillRate: [{required: true, message: '请输入运力满足率', trigger: 'blur'}],
          unprotectedNumber: [{required: true, message: '请输入未保障车次数', trigger: 'change'}]
        }
      }
    },
    watch: {
      'dataForm.realityCarNum' () {
        this.getPercen()
      },
      'dataForm.planedCarNum' () {
        this.getPercen()
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transmanagement/tmcarensurerate/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.carrierId = data.tTmCarEnsurerate.carrierId
              const kpiYear = data.tTmCarEnsurerate.kpiMonth.substring(0, 4)
              const kpiMon = data.tTmCarEnsurerate.kpiMonth.substring(4)
              this.dataForm.kpiMonth = `${kpiYear}-${kpiMon}`
              this.dataForm.planedCarNum = data.tTmCarEnsurerate.planedCarNum
              this.dataForm.supportCarNum = data.tTmCarEnsurerate.supportCarNum
              this.dataForm.realityCarNum = data.tTmCarEnsurerate.realityCarNum
              // this.dataForm.fillRate = data.tTmCarEnsurerate.fillRate
              this.dataForm.unprotectedNumber = data.tTmCarEnsurerate.unprotectedNumber
              this.dataForm.remark = data.tTmCarEnsurerate.remark
            }
          })
        }
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
              url: this.$http.adornUrl(`/transmanagement/tmcarensurerate/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                carrierId: this.dataForm.carrierId,
                kpiMonth: this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').split('-').join('') : '',
                planedCarNum: this.dataForm.planedCarNum,
                supportCarNum: this.dataForm.supportCarNum,
                realityCarNum: this.dataForm.realityCarNum,
                fillRate: this.dataForm.fillRate,
                unprotectedNumber: this.dataForm.unprotectedNumber,
                remark: this.dataForm.remark
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.clickFlag = true
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
      getPercen () {
        if (this.dataForm.planedCarNum) {
          this.dataForm.fillRate = this.dataForm.realityCarNum / this.dataForm.planedCarNum * 100
          this.dataForm.fillRate = this.dataForm.fillRate.toFixed(2)
          this.dataForm.unprotectedNumber = this.dataForm.planedCarNum - this.dataForm.realityCarNum
          if (this.dataForm.unprotectedNumber < 0) {
            this.dataForm.unprotectedNumber = 0
          } else {
            this.dataForm.unprotectedNumber = this.dataForm.unprotectedNumber
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 85px;
  }
</style>
