<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '编辑'"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="KPI月度" prop="kpiMonth">
            <xkl-date-picker type="month" v-model="dataForm.kpiMonth" placeholder="KPI月度" clearable></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投诉日期" prop="complaintTime">
            <xkl-date-picker type="date" v-model="dataForm.complaintTime" placeholder="投诉日期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生日期" prop="occurTime">
            <xkl-date-picker type="date" v-model="dataForm.occurTime" placeholder="发生日期"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库" prop="warehoseId">
            <el-input v-model="dataForm.warehoseId" placeholder="后续处理" maxLength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="委托方" prop="consignorId">
            <xkl-select style="width: 100%" v-model="dataForm.consignorId" keyType="id" labelType="ownerName" linkage="/transresources/ttrconsignor/list" placeholder="委托方"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运商" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList " placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题类型" prop="matterType">
            <xkl-select style="width: 100%" v-model="dataForm.matterType" select-type="MATTER_TYPE" placeholder="问题类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="具体情况" prop="matterContent">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              maxLength="100"
              v-model="dataForm.matterContent">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="书面投诉" prop="isPaperComplaint">
            <el-radio-group v-model="dataForm.isPaperComplaint">
              <el-radio :label="1">有</el-radio>
              <el-radio :label="0">没有</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="后续处理" prop="postProcessing">
            <el-input v-model="dataForm.postProcessing" placeholder="后续处理" maxLength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚建议" prop="finePropose">
            <el-input v-model="dataForm.finePropose" placeholder="扣罚建议" maxLength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扣罚金额" prop="fineAmount">
            <el-input v-model="dataForm.fineAmount" placeholder="扣罚金额" maxLength="8" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="dataForm.remark" placeholder="备注" maxLength="100" clearable></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="投诉记录人">-->
            <!--<el-input v-model="dataForm.complaintBy" placeholder="投诉记录人" clearable></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
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
    components: {
    },
    data () {
      let verifyPositiveNumber = (rule, value, callback) => {
        if (value === '' || value === null) {
          callback()
        }
        if (isNaN(value) || value <= 0) {
          callback(new Error('请输入大于0的数字'))
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          kpiMonth: '',
          complaintTime: '',
          occurTime: '',
          warehoseId: '',
          consignorId: '',
          carrierId: '',
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
          kpiMonth: [
            {required: true, message: '请选择KPI月度', trigger: 'change'}
          ],
          complaintTime: [
            {required: true, message: '请选择投诉日期', trigger: 'change'}
          ],
          occurTime: [
            {required: true, message: '请选择发生日期', trigger: 'change'}
          ],
          warehoseId: [
            {required: true, message: '请输入仓库', trigger: 'blur'}
          ],
          consignorId: [
            {required: true, message: '请选择委托方', trigger: 'change'}
          ],
          carrierId: [
            {required: true, message: '请选择承运商', trigger: 'change'}
          ],
          matterType: [
            {required: true, message: '请选择问题类型', trigger: 'change'}
          ],
          fineAmount: [
            {validator: verifyPositiveNumber, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
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
                this.dataForm.complaintTime = new Date(data.customerComplaints.complaintDtm)
                this.dataForm.occurTime = new Date(data.customerComplaints.occurDtm)
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
            this.$http({
              url: this.$http.adornUrl(`/transmanagement/tmcustomercomplaints/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                kpiMonth: this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').split('-').join('') : '',
                complaintTime: this.dataForm.complaintTime,
                occurTime: this.dataForm.occurTime,
                warehoseId: this.dataForm.warehoseId,
                consignorId: this.dataForm.consignorId,
                carrierId: this.dataForm.carrierId,
                matterType: this.dataForm.matterType,
                matterContent: this.dataForm.matterContent,
                isPaperComplaint: this.dataForm.isPaperComplaint,
                postProcessing: this.dataForm.postProcessing,
                finePropose: this.dataForm.finePropose,
                fineAmount: this.dataForm.fineAmount,
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
      }
    }
  }
</script>
