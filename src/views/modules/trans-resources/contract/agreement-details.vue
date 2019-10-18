<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
        <el-form-item label="签订日期：">
            <span style="width: 200px; display: block">
                {{dataForm2.signTime}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="生效日期：">
          <span style="width: 200px; display: block">
                {{dataForm2.effectTime}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="签订部门：">
          <span style="width: 200px; display: block">
                {{dataForm2.signDepart}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="协议名称：">
          <span style="width: 90%; display: block">
                {{dataForm2.agreementName}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="补充内容：">
          <span style="width: 90%; display: block">
                {{dataForm2.sideContent}}
          </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件：" prop="attachmentUrl">
          <xkl-upload v-model="dataForm2.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-contract/contract-management',params: {id: $route.query.contractId}})">取消</el-button>
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
      let verifyChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      let verifyNumberChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
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
          contractAttachment: [],
          carrierA: '',
          carrierB: '',
          carrierC: '',
          pathName: '',
          valueDate: [],
          contractProductIds: [],
          contractName: ''
        },
        dataForm2: {
          id: '',
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
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true // 禁止上传
        },
        dataRule: {
          carrierCode: [
            {required: true, message: '请填写合同编号', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          carrierId: [
            { required: true, message: '请填写承运商名称', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ],
          carrierName: [
            { required: true, message: '请填写合同名称', trigger: 'blur' }
          ],
          carrierType: [
            { required: true, message: '请选择合同类型', trigger: 'change' }
          ],
          carrierA: [
            { required: true, message: '请填写合同主体（甲方）', trigger: 'blur' }
          ],
          carrierB: [
            { required: true, message: '请填写合同主体（乙方）', trigger: 'blur' }
          ],
          carrierC: [
            { required: true, message: '请填写合同主体（丙方）', trigger: 'blur' }
          ],
          subProject: [
            { required: true, message: '请填写所属项目', trigger: 'change' }
          ],
          signDtm: [
            { required: true, message: '请选择签订日期', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '请填写签订公司', trigger: 'change' }
          ],
          signDep: [
            { required: false, message: '请选择签订部门', trigger: 'change' }
          ],
          valueDate: [
            { required: true, message: '请选择合同有效期', trigger: 'change' }
          ]
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
          this.dataForm.contractProductIds = this.productLists.map(res => {
            return res.id
          })
        }
      }
    },
    components: {
      Upload,
      ProductDrawer
    },
    created () {
      this.init()
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.contractId || 0
        this.dataForm2.id = this.$route.query.id || 0
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
                  url: this.$http.adornUrl(`/transresources/trcontractsideagreement/info/${this.dataForm2.id}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    this.dataForm2.contractId = data.agreement.contractId
                    this.dataForm2.signTime = data.agreement.signTime ? formatDate(data.agreement.signTime) : null;
                    this.dataForm2.effectTime = data.agreement.effectTime ? formatDate(data.agreement.effectTime) : null;
                    this.dataForm2.agreementName = data.agreement.agreementName
                    this.dataForm2.sideContent = data.agreement.sideContent
                    this.dataForm2.signCompany = data.agreement.signCompany
                    this.dataForm2.signDepart = data.agreement.signDepart
                    this.dataForm2.attachments = data.agreement.attachments
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
              url: this.$http.adornUrl(`/transresources/trcontract/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'carrierCode': this.dataForm.carrierCode,
                'carrierType': this.dataForm.carrierType,
                'carrierName': this.dataForm.carrierName,
                'carrierId': this.dataForm.carrierId,
                'signDtm': formatDate(this.dataForm.signDtm),
                'subProject': this.dataForm.subProject,
                'carrierStartDtm': formatDate(this.dataForm.valueDate[0]),
                'carrierEndDtm': formatDate(this.dataForm.valueDate[1]),
                'attachmentUrl': this.dataForm.attachmentUrl,
                'contractAttachment': this.dataForm.contractAttachment,
                'carrierA': this.dataForm.carrierA,
                'carrierB': this.dataForm.carrierB,
                'carrierC': this.dataForm.carrierC,
                'signDep': this.dataForm.signDep,
                'contractProductIds': this.dataForm.contractProductIds
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
  /deep/.el-form-item .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-form-item .el-upload__tip{
    display: none;
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
