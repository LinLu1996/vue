<template>
  <el-dialog
    title="对账单导入"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()"
             label-width="100px">
      <el-row>
        <el-col>
          <el-form-item label="下载模板">
            <span style="margin-right: 20px">{{fileName}}</span>
            <el-button type="primary" @click="handleDownLoad()">下载</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="上传对账单" prop="attachments">
            <xkl-upload ref="upload" v-model="dataForm.attachments" :config="uploadConfig" @getDataList="getDataList"></xkl-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="handleRefresh"></upload-road-feedback>
  </el-dialog>
</template>

<script>
  import Upload from '@/components/upload/upload'
  import UploadRoadFeedback from '../../trans-resources/carrier/upload-road-feedback'
  export default {
    components: {
      Upload,
      UploadRoadFeedback
    },
    data () {
      return {
        visible: false,
        clickFlag: true,
        dataForm: {
          id: '',
          attachments: []
        },
        dataRule: {
          attachments: [{required: true, message: '请上传对账单', trigger: 'change'}]
        },
        uploadConfig: {
          fileListType: 'text', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/feesettlement/fscarriagestatement/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false, // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
          limit: 1
        },
        fileName: '对账单导入模板.xlsx',
        fsCarriageStatementEntityList: [],
        uploadRoadFeedbackVisible: false
      }
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.uploadRoadFeedbackVisible = false
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          this.dataForm.attachments = []
          this.$refs.upload.init('add')
        })
      },
      // 表单提交
      dataFormSubmit (val) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/feesettlement/fscarriagestatement/imporFsCarriageStatement'),
              method: 'post',
              data: this.$http.adornData({
                'fsCarriageStatementEntityList': this.fsCarriageStatementEntityList,
                'type': !val ? null : val
              })
            }).then(({data}) => {
              if (data.type && data.type === '2') {
                this.$confirm(`${data.errorMsg}`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.dataFormSubmit(2)
                }).catch(() => {})
              } else {
                if (data.code === 0 && data.type === 1) {
                  this.visible = true
                  this.clickFlag = true
                  // let exception = ''
                  // data.feedBack.exceptionList && data.feedBack.exceptionList.length && data.feedBack.exceptionList.forEach(item => {
                  //   exception += `第${item.index}行 ${item.column}列 ${item.exception}<br/>`
                  // })
                  // this.$confirm(`本次导入新增${data.feedBack.successNumber}对账单条，对账单明细${data.feedBack.falseNumber}条<br/>${exception}`, '导入成功！', {
                  //   confirmButtonText: '确定',
                  //   showCancelButton: false,
                  //   dangerouslyUseHTMLString: true,
                  //   showClose: false,
                  //   type: 'warning'
                  // }).then(() => {
                  //   this.$emit('refreshDataList')
                  // }).catch(() => {})
                  this.uploadRoadFeedbackVisible = true
                  this.$nextTick(() => {
                    this.$refs.uploadRoadFeedback.init(data)
                  })
                } else {
                  this.$message({
                    type: 'warning',
                    message: data.errorMsg
                  })
                }
              }
            })
          }
        })
      },
      // 下载
      handleDownLoad () {
        let fileName = this.fileName
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontract/downloadOne'),
          method: 'get',
          params: this.$http.adornParams({
            'fileName': fileName
          }),
          responseType: 'blob'
        }).then(({data}) => {
          this.loading = false
          const link = document.createElement('a')
          let blob = new Blob([data], {type: 'application/octet-stream'})
          if (blob.size === 0) {
            this.$message.error('文件不存在')
            return
          }
          // let fileName = new Date().getTime()
          // for IE
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, this.fileName)
          } else {
            // for Non-IE (chrome, firefox etc.)
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            link.setAttribute('download', this.fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        })
      },
      getDataList (data) {
        this.fsCarriageStatementEntityList = data
      },
      handleRefresh () {
        this.visible = false
        this.clickFlag = true
        this.$emit('refreshDataList')
      },
      closeForm () {
        this.visible = false
        if (!this.dataForm.id) {
          this.$refs.upload.init('add')
        }
      }
    }
  }
</script>
<style lang="scss">
  .el-message-box__content{
    max-height: 500px!important;
    overflow: auto;
  }
</style>
