<template>
  <el-form :model="dataForm2" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>合同信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="合同编号：">
           <span style="width: 200px; display: block">
                {{dataForm.carrierCode}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同名称：">
           <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同类型：">
           <span style="width: 200px; display: block">
                {{dataForm.contractName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运商：">
             <span style="width: 200px; display: block">
                {{dataForm.shortName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="履行期限：">
           <span style="width: 200px; display: block">
                {{dataForm.valueDate[0]}}~{{dataForm.valueDate[1]}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="签订日期：">
           <span style="width: 200px; display: block">
                {{dataForm.signDtm}}
            </span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>补充协议信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="签订日期" prop="signTime">
          <xkl-date-picker type="date" v-model="dataForm2.signTime" clearable placeholder="签订日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="生效日期" prop="effectTime">
          <xkl-date-picker type="date" v-model="dataForm2.effectTime" clearable placeholder="生效日期"></xkl-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="签订部门" prop="signDepart">
          <xkl-select style="width: 100%" v-model="dataForm2.signDepart" keyType="departId" labelType="departName" linkage="/sys/sysdepart/getByCompanyId" placeholder="选择或输入查找"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="协议名称" prop="agreementName">
          <el-input v-model="dataForm2.agreementName" maxlength="30" clearable placeholder="协议名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="补充内容" prop="sideContent">
          <el-input v-model="dataForm2.sideContent" maxlength="100" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="attachments">
          <xkl-upload v-model="dataForm2.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-contract/contract-management'})">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  import { formatDate } from '@/utils'
  import Upload from '@/components/upload/upload'
  import ProductDrawer from '../product/product-drawer'
  export default {
    data () {
      return {
        visible: false,
        drawerVisible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          carrierCode: '',
          carrierType: '',
          carrierName: '',
          shortName: '',
          carrierId: '',
          signDtm: '',
          signDep: '',
          companyId: '',
          subProject: '',
          carrierStartDtm: '',
          carrierEndDtm: '',
          attachmentUrl: '',
          contractAttachment: '',
          carrierA: '',
          carrierB: '',
          carrierC: '',
          pathName: '',
          valueDate: [],
          contractProductIds: [],
          contractName: ''
        },
        dataForm2: {
          contractId: '',
          signTime: '',
          effectTime: '',
          agreementName: '',
          sideContent: '',
          signCompany: '1',
          signDepart: '',
          attachments: []
        },
        signDepData: [],
        productLists: [],
        loadUrl: '/transresources/trcontract/upload',
        downloadUrl: '/transresources/trcontract/download',
        dataRule: {
          signTime: [
            {required: true, message: '请选择签订日期', trigger: 'change'}
          ],
          effectTime: [
            { required: true, message: '请选择生效日期', trigger: 'change' }
          ],
          signDepart: [
            { required: true, message: '请选择签订部门', trigger: 'blur' }
          ],
          agreementName: [
            { required: true, message: '请填写协议名称', trigger: 'blur' }
          ]
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        },
        fileList: [],
        levelDate: '',
        pickerOptions: {
          disabledDate (value) {
            if (Date.now() >= value) {
              return true
            }
            return false
          }
        },
        isDisabled: false
      }
    },
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productLists = this.$route.params
          if (this.productLists) {
            this.dataForm.contractProductIds = this.productLists.map(res => {
              return res.id
            })
          }
        }
      }
    },
    components: {
      Upload,
      ProductDrawer
    },
    created () {
      const contractId = this.$route.query.contractId || null
      const id = this.$route.query.id || null
      this.dataForm2.contractId = contractId
      this.dataForm2.id = id
      this.init(contractId)
      this.dataForm2.trcontract = []
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcontract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierCode = data.tTrContract.carrierCode
                this.dataForm.carrierType = data.tTrContract.carrierType ? data.tTrContract.carrierType.toString() : ''
                this.dataForm.carrierName = data.tTrContract.carrierName
                this.dataForm.shortName = data.tTrContract.shortName
                this.dataForm.carrierId = data.tTrContract.carrierId
                this.dataForm.signDtm = data.tTrContract.signDtm ? formatDate(data.tTrContract.signDtm) : '';
                this.dataForm.subProject = data.tTrContract.subProject
                this.dataForm.attachmentUrl = data.tTrContract.attachmentUrl
                this.dataForm.contractAttachment = data.tTrContract.contractAttachment
                this.dataForm.carrierA = data.tTrContract.carrierA
                this.dataForm.carrierB = data.tTrContract.carrierB
                this.dataForm.carrierC = data.tTrContract.carrierC
                this.dataForm.signDep = data.tTrContract.signDep
                this.dataForm.pathName = data.tTrContract.pathName
                this.dataForm.contractName = data.tTrContract.contractName
                this.dataForm.contractProductIds = data.tTrContract.contractProductIds
                this.productLists = data.tTrContract.contractProductList
                this.dataForm.valueDate = [
                  data.tTrContract.carrierStartDtm ? formatDate(data.tTrContract.carrierStartDtm) : null,
                  data.tTrContract.carrierEndDtm ? formatDate(data.tTrContract.carrierEndDtm) : null
                ]
              }
            }).then(() => {
              if (this.dataForm2.id) {
                this.$http({
                  url: this.$http.adornUrl(`/transresources/trcontract/info/${this.dataForm.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                  }
                })
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
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
              url: this.$http.adornUrl(`/transresources/trcontractsideagreement/save`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm2
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-contract/contract-management'})
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
      getSelectDate (val) {
        if (val) {
          let levelDate = (new Date(val) - Date.now()) / 86400000
          levelDate = Math.ceil(levelDate)
          this.levelDate = levelDate
          this.$message({
            type: 'warning',
            // message: '证书还有' + levelDate + '天过期',
            message: levelDate > 0 ? `合同还有${levelDate}天过期` : `合同已过期${-levelDate}天`
          })
        } else {
          this.levelDate = ''
        }
      },
      closeForm () {
        this.visible = false
        this.$refs['attachment'].init()
      },
      getDrawerInfo () {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init()
        })
      },
      getProductList (type) {
        this.$router.push({
          name: 'product-list',
          params: {
            type: type
          }
        })
      },
      deleteProduct (index) {
        this.productLists.splice(index, 1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 0;
    }
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
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
