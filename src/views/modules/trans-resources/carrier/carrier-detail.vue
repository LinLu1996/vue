<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    id="dialog"
    width="70%"
  >
    <div>
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
               label-width="140px">
        <el-form-item label-width="0">
          <el-tag>基本信息</el-tag>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="运营中心：" prop="carrierCode">
              <span style="width: 200px; display: block">
                {{dataForm.operationCenterName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="代码：" prop="carrierCode">
              <span style="width: 200px; display: block">
                {{dataForm.carrierCode}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称：" prop="carrierName">
            <span style="width: 200px; display: block">
              {{dataForm.carrierName}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="简称：" prop="shortName">
              <span style="width: 200px; display: block">
                {{dataForm.shortName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
              <span style="width: 200px; display: block">
                {{dataForm.type}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="引入方式：" prop="introductionWay">
              <span style="width: 200px; display: block">
                {{dataForm.introductionWay}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="质量审计：" prop="qualityAuditResult">
              <span style="width: 220px; display: block">
                {{dataForm.qualityAuditResult === 0 ? '通过' : '不通过'}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票账期：" prop="billAccountPeriod">
              <span style="width: 200px; display: block">
                {{dataForm.billAccountPeriod !== null ? `${dataForm.billAccountPeriod}天` : ''}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="温度：" prop="temperatures">
              <span style="width: 200px; display: block">
                {{dataForm.temperatures}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>营业执照信息</el-tag>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="统一社会信用代码：" prop="licence.creditCode">
              <span style="width: 200px; display: block">
                {{dataForm.licence.creditCode}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期：" prop="licence.registerTime">
            <span style="width: 200px; display: block">
              {{dataForm.licence.registerTime}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证照有效期：" prop="licence.validTime">
              <span style="width: 200px; display: block">
                {{dataForm.licence.validTime}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册资金：" prop="licence.regCapital">
              <span style="width: 200px; display: block">
                {{dataForm.licence.regCapital !== null ? `${dataForm.licence.regCapital}万` : ''}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人代表：" prop="licence.corporation">
              <span style="width: 200px; display: block">
                {{dataForm.licence.corporation}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件：" prop="licence.attachments">
              <xkl-upload v-model="dataForm.licence.attachments" :config="uploadConfig"></xkl-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="0">
          <el-tag>联系人信息</el-tag>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="联系人姓名：" prop="link">
              <span style="width: 200px; display: block">
                {{dataForm.link}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话：" prop="linkPhone">
            <span style="width: 200px; display: block">
              {{dataForm.linkPhone}}
            </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱：" prop="linkMail">
              <span style="width: 200px; display: block">
                {{dataForm.linkMail}}
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
  import {formatDate} from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        clickFlag: true,
        options: [],
        dataForm: {
          id: '',
          operationCenterName: '',
          carrierCode: '',
          carrierName: '',
          shortName: '',
          type: '',
          introductionWay: '',
          qualityAuditResult: '',
          billAccountPeriod: '',
          link: '',
          linkPhone: '',
          linkMail: '',
          remark: '',
          licence: {
            creditCode: '',
            registerTime: '',
            validTime: '',
            regCapital: '',
            corporation: '',
            attachments: []
          },
          temperatures: []
        },
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          disabled: true
        },
        dataRule: {},
        selectElement: ''
      }
    },
    activated () {
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcarrier/details/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierCode = data.trCarrier.carrierCode
                this.dataForm.carrierName = data.trCarrier.carrierName
                this.dataForm.operationCenterName = data.trCarrier.operationCenterName
                this.dataForm.shortName = data.trCarrier.shortName
                this.dataForm.type = data.trCarrier.type
                this.dataForm.introductionWay = data.trCarrier.introductionWay
                this.dataForm.qualityAuditResult = data.trCarrier.qualityAuditResult
                this.dataForm.billAccountPeriod = data.trCarrier.billAccountPeriod
                this.dataForm.link = data.trCarrier.link
                this.dataForm.linkPhone = data.trCarrier.linkPhone
                this.dataForm.linkMail = data.trCarrier.linkMail
                this.dataForm.licence = data.trCarrier.licence ? data.trCarrier.licence : this.dataForm.licence;
                this.dataForm.licence.registerTime = data.trCarrier.licence.registerTime ? formatDate(data.trCarrier.licence.registerTime) : null;
                this.dataForm.licence.validTime = data.trCarrier.licence.validTime ? formatDate(data.trCarrier.licence.validTime) : null;
                this.dataForm.licence.attachments = data.trCarrier.attachments
                this.dataForm.temperatures = data.trCarrier.temperaturesValue ? data.trCarrier.temperaturesValue.join('、') : null;
              }
            })
          }
        })
      },
      handleCancel () {
        window.history.go(-1)
      },
      mousedown (event) {
        this.selectElement = document.getElementById('dialog')
        console.log('aaaa', this.selectElement)
        var div1 = this.selectElement
        this.selectElement.style.cursor = 'move'
        const distanceX = event.clientX - this.selectElement.offsetLeft
        const distanceY = event.clientY - this.selectElement.offsetTop
        document.onmousemove = function (ev) {
          var oevent = ev || event
          div1.style.left = oevent.clientX - distanceX + 'px'
          div1.style.top = oevent.clientY - distanceY + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          div1.style.cursor = 'default'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tem-content{
    padding: 0 100px;
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload--picture-card{
    display: none;
  }
  /deep/.el-dialog__wrapper .el-form-item__content .el-upload__tip{
    display: none;
  }
</style>
