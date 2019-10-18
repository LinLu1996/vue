<template>
  <el-dialog
    title="详情"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="KPI月度：">
            <span style="width: 200px; display: block">
                {{dataForm.kpiMonth}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉日期：">
            <span style="width: 200px; display: block">
                {{dataForm.complaintDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生日期：">
             <span style="width: 200px; display: block">
                {{dataForm.occurDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库：">
             <span style="width: 200px; display: block">
                {{dataForm.warehoseId}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托方：">
             <span style="width: 200px; display: block">
                {{dataForm.consignorName}}
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
          <el-form-item label="问题类型：">
             <span style="width: 200px; display: block">
                {{dataForm.matterValue}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="具体情况：">
            <span style="width: 90%; display: block">
                {{dataForm.matterContent}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="书面投诉：">
            <span style="width: 200px; display: block">
                {{dataForm.isPaperComplaint === 0 ? '有' : '没有'}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后续处理：">
             <span style="width: 200px; display: block">
                {{dataForm.postProcessing}}
             </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚建议：">
             <span style="width: 200px; display: block">
                {{dataForm.finePropose}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚金额：">
             <span style="width: 200px; display: block">
                {{dataForm.fineAmount}}&nbsp&nbsp万元
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
             <span style="width: 90%; display: block">
                {{dataForm.remark}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="投诉记录人：">
           <span style="width: 200px; display: block">
              {{dataForm.complaintBy}}
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
          complaintDtm: '',
          occurDtm: '',
          warehoseId: '',
          consignorId: '',
          consignorName: '',
          carrierId: '',
          carrierName: '',
          matterType: '',
          matterValue: '',
          matterContent: '',
          isPaperComplaint: 0,
          postProcessing: '',
          finePropose: '',
          fineAmount: '',
          remark: '',
          complaintBy: ''
        },
        dataRule: {
        }
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.dataForm.id = id || 0
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/transmanagement/tmcustomercomplaints/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              const kpiYear = data.customerComplaints.kpiMonth.substring(0, 4)
              const kpiMon = data.customerComplaints.kpiMonth.substring(4)
              this.dataForm.kpiMonth = `${kpiYear}-${kpiMon}`
              this.dataForm.complaintDtm = formatDate(data.customerComplaints.complaintDtm)
              this.dataForm.occurDtm = formatDate(data.customerComplaints.occurDtm)
              this.dataForm.warehoseId = data.customerComplaints.warehoseId
              this.dataForm.wareName = data.customerComplaints.wareName
              this.dataForm.consignorId = data.customerComplaints.consignorId
              this.dataForm.consignorName = data.customerComplaints.consignorName
              this.dataForm.carrierId = data.customerComplaints.carrierId
              this.dataForm.carrierName = data.customerComplaints.carrierName
              this.dataForm.matterType = data.customerComplaints.matterType
              this.dataForm.matterValue = data.customerComplaints.matterValue
              this.dataForm.matterContent = data.customerComplaints.matterContent
              this.dataForm.isPaperComplaint = data.customerComplaints.isPaperComplaint
              this.dataForm.postProcessing = data.customerComplaints.postProcessing
              this.dataForm.finePropose = data.customerComplaints.finePropose
              this.dataForm.fineAmount = data.customerComplaints.fineAmount
              this.dataForm.remark = data.customerComplaints.remark
              this.dataForm.complaintBy = data.customerComplaints.complaintBy
            }
          })
        }
      }
    }
  }
</script>
