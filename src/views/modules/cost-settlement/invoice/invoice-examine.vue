<template>
  <div>
    <el-form :model="dataForm" label-width="100px" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label-width="0">
        <el-tag>开票信息</el-tag>
      </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="开票编号：">
              <span>
                {{dataForm.invoiceNo}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开票金额：">
              <span>
                {{dataForm.askInvoiceAmount}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="无税金额：">
              <span>
                {{dataForm.taxlessAmount}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="承运商：">
              <span>
                {{dataForm.carrierName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对账账期：">
              <span>
                {{dataForm.invoiceMonth}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注信息：" prop="remark">
              <span>
                {{dataForm.remark}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      <el-form-item label-width="0">
        <el-tag>运输产品</el-tag>
      </el-form-item>
      <el-row v-if="!productLists.length">
        <el-col>
          <div style="height: 100px;line-height: 100px;text-align: center;font-size: 20px;color: #CCCCCC">请选择产品！</div>
        </el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="7" v-for="(item, index) in productLists" key="item" style="margin-bottom: 20px">
          <div style="width: 90%;margin: 0 auto">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span style="color: #ffffff;font-size: 16px;font-weight: bold">{{item.prdName}}</span>
              </div>
              <div class="text item">{{'运输方式：' + item.tpModeName }}</div>
              <div class="text item">{{'配载方式：' + item.loadingModeName }}</div>
              <div class="text item">{{'温控类型：' + item.tempModeName }}</div>
              <el-button style="padding: 3px 0" type="text" @click="getDrawerInfo(item.id)">详 情</el-button>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
      <el-row style="margin-bottom: 10px">
        <el-col :span="4">
          <el-form-item label-width="0">
            <el-tag>纸质发票信息</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" size="mini" @click="addInvoiceList()">添加发票</el-button>
        </el-col>
      </el-row>
      <template>
          <el-row v-for="(item, index) in dataForm.fsInvoiceAttachmentEntityList" :key="index">
            <el-col :span="8">
              <el-form-item label="发票号：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.invoiceNumber'" :rules="dataRule.invoiceNumber">
                <el-input v-model="item.invoiceNumber" maxlength="100" placeholder="请填写纸质发票号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附件：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.attachmentInvoiceNumberList'" :rules="dataRule.attachmentInvoiceNumberList">
                <xkl-upload v-model="item.attachmentInvoiceNumberList" :config="uploadConfig"></xkl-upload>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="备注：" :prop="'fsInvoiceAttachmentEntityList.' + index + '.remark'">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="item.remark" placeholder="备注" clearable maxlength="160"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center" v-show="dataForm.fsInvoiceAttachmentEntityList && dataForm.fsInvoiceAttachmentEntityList.length > 1">
              <el-button type="danger" size="mini" @click="deleteHandle(index)">删除</el-button>
            </el-col>
          </el-row>
      </template>
      <el-row style="margin-top: 20px;text-align: right">
        <el-col>
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit">确定</el-button>
        </el-col>
      </el-row>
    </el-form>
    <submit-approval ref="submitApproval" v-if="submitApprovalVisible" @refreshDataList="init"></submit-approval>
  </div>
</template>

<script>
  import Upload from '@/components/upload/upload'
  import SubmitApproval from '../../sys/audit/submit_approval'
  import ProductDrawer from '../../trans-resources/product/product-drawer'
  export default {
    data () {
      return {
        clickFlag: true,
        dataForm: {
          id: 0,
          askInvoiceAmount: '',
          taxlessAmount: '',
          carrierName: '',
          invoiceMonth: '',
          remark: '',
          status: '',
          fsInvoiceAttachmentEntityList: [
          ]
        },
        dataRule: {
          invoiceNumber: [{required: true, message: '请输入发票号', trigger: 'change'}],
          attachmentInvoiceNumberList: [{required: true, message: '请上传附件', trigger: 'change'}]
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        },
        productLists: [],
        drawerVisible: false,
        submitApprovalVisible: false
      }
    },
    activated () {
      this.dataForm.id = this.$route.query.id || null
      this.init()
    },
    components: {
      Upload,
      ProductDrawer,
      SubmitApproval
    },
    methods: {
      init () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/feesettlement/tfsinvoice/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            const dataList = data.tFsInvoice
            const trProductEntity = []
            if (data.tFsInvoice.trProductEntity) {
              trProductEntity.push(data.tFsInvoice.trProductEntity)
            }
            this.dataForm.invoiceNo = dataList.invoiceNo
            this.dataForm.carrierName = dataList.carrierName
            this.dataForm.invoiceMonth = dataList.invoiceMonth
            this.dataForm.askInvoiceAmount = dataList.askInvoiceAmount
            this.dataForm.taxlessAmount = dataList.taxlessAmount
            this.dataForm.status = dataList.status
            this.dataForm.remark = dataList.remark
            this.productLists = trProductEntity
            this.dataForm.fsInvoiceAttachmentEntityList = dataList.fsInvoiceAttachmentEntityList && dataList.fsInvoiceAttachmentEntityList.length > 0 ? dataList.fsInvoiceAttachmentEntityList : [
              {
                invoiceNumber: '',
                attachmentInvoiceNumberList: [],
                remark: ''
              }
            ]
          } else {
            this.dataForm = {}
          }
          this.dataListLoading = false
        })
      },
      handleCancel () {
        window.history.go(-1)
      },
      addInvoiceList () {
        this.dataForm.fsInvoiceAttachmentEntityList.push({
          invoiceNumber: '',
          attachmentInvoiceNumberList: [],
          remark: ''
        })
      },
      deleteHandle (index) {
        this.dataForm.fsInvoiceAttachmentEntityList.splice(index, 1)
      },
      submitApproval () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.status !== 0) {
              this.$message.error('该开票单已审核')
              return
            }
            const ids = []
            ids.push(this.dataForm.id)
            this.submitApprovalVisible = true
            this.$nextTick(() => {
              this.$refs.submitApproval.init(ids, 'invoice', this.dataForm.fsInvoiceAttachmentEntityList)
            })
          }
        })
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const ids = []
            ids.push(this.dataForm.id)
            this.$http({
              url: this.$http.adornUrl('/feesettlement/tfsinvoice/audit'),
              method: 'post',
              data: this.$http.adornData({
                'ids': ids,
                'fsInvoiceAttachmentList': this.dataForm.fsInvoiceAttachmentEntityList,
                status: 2
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '新增成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    window.history.go(-1)
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tem-content{
    padding: 0 100px;
  }
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 1px;
    }
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-upload__tip{
    display: none;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 10px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
</style>
