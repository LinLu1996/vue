<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="承运商名称：">
            <span style="width: 200px; display: block">
                {{dataForm.shortName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称：">
            <span style="width: 200px; display: block">
                {{dataForm.carrierName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签订日期：">
            <span style="width: 200px; display: block">
                {{dataForm.signDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属项目：">
            <span style="width: 200px; display: block">
                {{dataForm.subProject}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同主体：">
            <span style="width: 200px; display: block">
                {{dataForm.carrierA}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同类型：">
            <span style="width: 200px; display: block">
                {{dataForm.contractName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同主体：">
            <span style="width: 200px; display: block">
                {{dataForm.carrierB}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同主体：">
            <span style="width: 200px; display: block">
                {{dataForm.carrierC}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运营中心：">
            <span style="width: 400px; display: inline-block">
                {{dataForm.signCompanyName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="签订部门：">
            <span style="width: 400px; display: inline-block">
                {{dataForm.departName}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同有效期：">
            <span style="width: 400px; display: inline-block">
                {{dataForm.carrierStartDtm}}
                <span style="width: 20px; display: inline-block;text-align: center">
                至
                </span>
              {{dataForm.carrierEndDtm}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span style="width: 90%; display: inline-block">
                {{dataForm.remark}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>合同附件</el-tag>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="attachmentUrl">
            <xkl-upload v-model="dataForm.contractAttachment" :config="uploadConfig"></xkl-upload>
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
              <el-button style="padding: 3px 0" type="text" @click="getDrawerInfo(item.trProductId)">详 情</el-button>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <product-drawer v-if="drawerVisible" ref="productDrawer"></product-drawer>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils';
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
          contractName: '',
          shortName: '1',
          signDtm: '',
          subProject: '',
          carrierStartDtm: '',
          carrierEndDtm: '',
          attachmentUrl: '',
          signCompanyName: '',
          departName: '',
          contractAttachment: [],
          pathName: '',
          carrierA: '',
          carrierB: '',
          carrierC: '',
          signDep: '',
          companyName: '',
          carrierId: '',
          signCompany: '',
          contractFileUrl: [],
          valueDate: [],
          contractProductIds: [],
          remark: ''
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true // 禁止上传
        },
        productLists: [],
        fileList: [],
        levelDate: '',
        isDisabled: false
      }
    },
    watch: {
      'dataForm.type' (newVal) {
        if (newVal !== '') {
          this.linkage = newVal === 0 ? '/basic/supplier/noPowerList' : '/sys/operation/noPowerList'
        } else {
          this.linkage = ''
        }
        this.dataForm.owner = ''
      },
      'dataForm.expiryDate' (newVal) {
        this.getSelectDate(newVal)
      }
    },
    components: {
      ProductDrawer
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcontract/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierCode = data.tTrContract.carrierCode
                this.dataForm.carrierName = data.tTrContract.carrierName
                this.dataForm.contractName = data.tTrContract.contractName
                this.dataForm.shortName = data.tTrContract.shortName
                this.dataForm.signDtm = formatDate(data.tTrContract.signDtm)
                this.dataForm.subProject = data.tTrContract.subProject
                this.dataForm.carrierStartDtm = data.tTrContract.carrierStartDtm ? data.tTrContract.carrierStartDtm.split(' ')[0] : ''
                this.dataForm.carrierEndDtm = data.tTrContract.carrierEndDtm ? data.tTrContract.carrierEndDtm.split(' ')[0] : ''
                this.dataForm.attachmentUrl = data.tTrContract.attachmentUrl
                this.dataForm.carrierA = data.tTrContract.carrierA
                this.dataForm.carrierB = data.tTrContract.carrierB
                this.dataForm.carrierC = data.tTrContract.carrierC
                this.dataForm.signDep = data.tTrContract.signDep
                this.dataForm.signDepName = data.tTrContract.signDepName
                this.productLists = data.tTrContract.contractProductList
                this.dataForm.carrierType = data.tTrContract.carrierType ? data.tTrContract.carrierType.toString() : ''
                this.dataForm.carrierId = data.tTrContract.carrierId
                this.dataForm.contractAttachment = data.tTrContract.contractFileList
                this.dataForm.signCompany = data.tTrContract.signCompany
                this.dataForm.signCompanyName = data.tTrContract.signCompanyName
                this.dataForm.pathName = data.tTrContract.pathName
                this.dataForm.signCompanyName = data.tTrContract.signCompanyName
                this.dataForm.departName = data.tTrContract.departName
                this.dataForm.remark = data.tTrContract.remark
                this.dataForm.contractProductIds = data.tTrContract.contractProductList.map(res => {
                  return res.trProductId
                })
                this.productLists = data.tTrContract.contractProductList
                this.dataForm.valueDate = [
                  data.tTrContract.carrierStartDtm,
                  data.tTrContract.carrierEndDtm
                ]
              }
            })
          } else {
            this.isDisabled = false
            this.dataForm.attachmentUrl = ''
          }
        })
      },
      getProductList () {
        this.$router.push({
          name: 'product-list'
        })
      },
      getDrawerInfo (id) {
        this.drawerVisible = true
        this.$nextTick(() => {
          this.$refs.productDrawer.init(id)
        })
      },
      closeForm () {
        this.visible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
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
