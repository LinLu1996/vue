<template>
  <el-dialog
    title="详情"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="160px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="KPI月度：">
            <span style="width: 200px; display: block">
                {{dataForm.kpiMonth}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运商：">
             <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温度计应返还数量：">
             <span style="width: 200px; display: block">
                {{dataForm.planBackNum}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温度计及时返回数量：">
             <span style="width: 200px; display: block">
                {{dataForm.timelyBackNum}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温度计已返回数量：">
             <span style="width: 200px; display: block">
                {{dataForm.realityBackNum}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温度计返回及时率：">
             <span style="width: 200px; display: block">
                {{dataForm.timelyRate}}%
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注：">
           <span style="width: 200px; display: block">
              {{dataForm.remark}}
           </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
  export default {
    components: {
    },
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          kpiMonth: '',
          carrierName: '',
          planBackNum: '',
          timelyBackNum: '',
          realityBackNum: '',
          timelyRate: '',
          remark: ''
        },
        dataRule: {
        }
      }
    },
    methods: {
      init (id) {
        console.log('id:', id)
        this.visible = true
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transmanagement/tmbacktimely/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.id = formatDate(data.backTimely.id)
              const kpiYear = data.backTimely.kpiMonth.substring(0, 4)
              const kpiMon = data.backTimely.kpiMonth.substring(4)
              this.dataForm.kpiMonth = `${kpiYear}-${kpiMon}`
              this.dataForm.carrierName = data.backTimely.carrierName
              this.dataForm.planBackNum = data.backTimely.planBackNum
              this.dataForm.timelyBackNum = data.backTimely.timelyBackNum
              this.dataForm.realityBackNum = data.backTimely.realityBackNum
              this.dataForm.timelyRate = data.backTimely.timelyRate
              this.dataForm.remark = data.backTimely.remark
            }
          })
        }
      }
    }
  }
</script>
