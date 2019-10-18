<template>
  <el-dialog
    title="详情"
    :visible.sync="visible">
    <div class="vehicel-detail">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
               label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运商名称：" prop="carrierId">
              <span style="width: 200px; display: block">
                  {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="KPI月度：" prop="kpiMonth">
              <span style="width: 200px; display: block">
                  {{dataForm.kpiMonth}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划车次数：" prop="planedCarNum">
              <span style="width: 200px; display: block">
                  {{dataForm.planedCarNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支援车次数:" prop="supportCarNum">
              <span style="width: 200px; display: block">
                  {{dataForm.supportCarNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际车次数:" prop="realityCarNum">
              <span style="width: 200px; display: block">
                  {{dataForm.realityCarNum}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运力满足率:" prop="fillRate">
              <span style="width: 200px; display: block">
                  {{dataForm.fillRate}}%
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="未保障车次数:" prop="unprotectedNumber">
              <span style="width: 200px; display: block">
                  {{dataForm.unprotectedNumber}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <span style="width: 90%;display: block;">
                  {{dataForm.remark}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-button @click="visible = false">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  // import { formatDate } from '@/utils'
  export default {
    components: {},
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          carrierId: '',
          carrierName: '',
          consignorId: '',
          kpiMonth: '',
          planedCarNum: '',
          supportCarNum: '',
          realityCarNum: '',
          fillRate: '',
          unprotectedNumber: '',
          remark: ''
        },
        dataRule: {
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transmanagement/tmcarensurerate/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.carrierId = data.tTmCarEnsurerate.carrierId
              this.dataForm.carrierName = data.tTmCarEnsurerate.carrierName
              const kpiYear = data.tTmCarEnsurerate.kpiMonth.substring(0, 4)
              const kpiMon = data.tTmCarEnsurerate.kpiMonth.substring(4)
              this.dataForm.kpiMonth = `${kpiYear}-${kpiMon}`
              this.dataForm.planedCarNum = data.tTmCarEnsurerate.planedCarNum
              this.dataForm.supportCarNum = data.tTmCarEnsurerate.supportCarNum
              this.dataForm.realityCarNum = data.tTmCarEnsurerate.realityCarNum
              this.dataForm.fillRate = data.tTmCarEnsurerate.fillRate
              this.dataForm.unprotectedNumber = data.tTmCarEnsurerate.unprotectedNumber
              this.dataForm.remark = data.tTmCarEnsurerate.remark
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .vehicel-detail .el-form .el-form-item .el-form-item__content span{
    display: block;
    width: 100%!important;
  }
</style>
