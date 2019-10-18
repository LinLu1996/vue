<template>
  <div>
    <el-upload
      ref="upload1"
      v-bind="config"
      :class="{'upload-demo': true, 'isHidden': true}"
      v-if="config.fileListType === 'picture-card'"
      list-type="picture"
      :action="this.$http.adornUrl(`${config.uploadUrl}?token=${$cookie.get('token')}`)"
      :file-list="fileList"
      :before-upload="checkUpload"
      :on-remove="handleRemove"
      :on-success="getResult"
      :on-progress="handleProgress"
      :on-preview="handlePreview"
      :on-error="handleError"
      :limit="5"
      :multiple="true"
      :disabled="config.disabled"
      :on-exceed="handleExceed">
      <!--<i slot="default" class="el-icon-plus"></i>-->
      <!--<div slot="file" slot-scope="{file}">-->
        <!--<img-->
          <!--class="el-upload-list__item-thumbnail"-->
          <!--:src="file.url" alt=""-->
        <!--&gt;-->
        <!--<span class="el-upload-list__item-actions">-->
        <!--<span-->
          <!--class="el-upload-list__item-preview"-->
          <!--@click="handlePictureCardPreview(file)"-->
        <!--&gt;-->
          <!--<i class="el-icon-zoom-in"></i>-->
        <!--</span>-->
        <!--<span-->
          <!--class="el-upload-list__item-delete"-->
          <!--@click="handleDownload(file)"-->
        <!--&gt;-->
          <!--<i class="el-icon-download"></i>-->
        <!--</span>-->
        <!--<span-->
          <!--v-if="!config.disabled"-->
          <!--class="el-upload-list__item-delete"-->
          <!--@click="handleRemove(file)"-->
        <!--&gt;-->
          <!--<i class="el-icon-delete"></i>-->
        <!--</span>-->
      <!--</span>-->
      <!--</div>-->
      <el-button v-if="!config.disabled" size="mini" type="success">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        {{'最多上传5个文件，点击文件列表即可下载'}}
      </div>
    </el-upload>
    <el-upload
      v-bind="config"
      v-if="config.fileListType === 'text'"
      ref="upload2"
      :action="this.$http.adornUrl(`${config.uploadUrl}?token=${$cookie.get('token')}`)"
      :file-list="fileList"
      list-type="text"
      :before-upload="checkUpload"
      :on-remove="handleRemove"
      :on-success="getResult"
      :on-progress="handleProgress"
      :on-error="handleError"
      :limit="config.limit ? config.limit : 5"
      :disabled="config.disabled"
      :multiple="true"
      :on-exceed="handleExceed">
      <div slot="tip" class="el-upload__tip" style="display: inline-block;margin: 0 10px">
        {{`最多上传${config.limit || 5}个文件`}}
      </div>
      <el-button v-show="loading" type="success" size="mini" :loading="true">加载中</el-button>
      <el-button v-show="!loading" size="mini" type="success"
                 icon="el-icon-upload">
        {{config.fileListShow ? '文件上传' : '导入'}}
      </el-button>
    </el-upload>
    <el-upload
      v-bind="config"
      :class="{'avatar-uploader': config.single}"
      v-if="config.fileListType === 'avatar'"
      :action="this.$http.adornUrl(`${config.uploadUrl}?token=${$cookie.get('token')}`)"
      :show-file-list="false"
      :before-upload="checkUpload"
      :on-success="getResult"
      :on-error="handleError">
      <img v-if="urlImagShow" :src="singleUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip" class="el-upload__tip">
        {{'请上传 jpg / jpeg 格式图片，不大于1Mb'}}
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="">
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'xklUpload',
    props: {
      value: {
        type: Array
      },
      config: {
        type: Object
      }
    },
    data () {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        loadList: [],
        isList: true,
        singleUrl: '',
        loading: false,
        urlImagShow: true
      }
    },
    watch: {
    },
    created () {
      this.init()
    },
    computed: {
      fileList: {
        get () {
          let loadArr = this.value ? this.value.map(res => {
            let loadItem = {
              name: res.name,
              path: res.path,
              url: res.path
              // url: require('D:/static/noimag.jpg')
            }
            return loadItem
          }) : []
          return loadArr
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
      init (type) {
        this.urlImagShow = false
        setTimeout(() => {
          this.singleUrl = this.fileList.length ? this.fileList[0].url : ''
          if (this.singleUrl) {
            this.urlImagShow = true
          }
        }, 1000)
        if (type === 'add') {
          if (this.fileListType === 'picture-card') {
            this.$refs.upload1.clearFiles()
          } else {
            this.$refs.upload2.clearFiles()
          }
        }
        const { fileListType, fileListShow } = this.config
        fileListType === 'picture-card' && fileListShow ? this.isList = false : this.isList = true
      },
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
        const ending = file.name.split('.')
        const endIndex = ending.length - 1
        ending[endIndex] = ending[endIndex].toLowerCase()
        if (this.config.single) {
          if (ending.indexOf('jpg') < 1 && ending.indexOf('jpeg') < 1) {
            this.$message.warning('证件照格式不正确')
            return false
          }
          if (!isLt1M) {
            this.$message.warning('图片大小不得超过1Mb')
            return false
          }
        }
      },
      getResult (response, ee, fileList) {
        if (response.code === 0 && response.file) {
          let loadItem = {
            name: response.file.fileName,
            path: response.file.filePath
          }
          this.loadList = [loadItem]
          let fileItem = {
            name: response.file.fileName,
            path: response.file.filePath,
            url: response.file.filePath
          }
          const importList = response.file.importList ? response.file.importList : []
          this.fileList.push(fileItem)
          if (this.config.single) {
            this.$emit('input', this.loadList)
            this.singleUrl = this.loadList[0].path
          } else {
            this.$emit('input', this.fileList)
          }
          this.$emit('getDataList', importList)
        } else {
          this.$message.error('上传失败')
          this.$refs['upload'].clearFiles()
        }
      },
      handleRemove (file) {
        this.fileList = this.fileList.filter(res => {
          return res.uid !== file.uid
        })
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleDownload (file) {
        this.$nextTick(() => {
          this.loading = true
          if (this.fileList.length) {
            let filePath = file.url.toString()
            let fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length)
            this.$http({
              url: this.$http.adornUrl(`${this.config.downloadUrl}`),
              method: 'get',
              params: this.$http.adornParams({
                'filePath': filePath
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
                window.navigator.msSaveOrOpenBlob(blob, fileName)
              } else {
                // for Non-IE (chrome, firefox etc.)
                link.style.display = 'none'
                link.href = URL.createObjectURL(blob)
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })
          }
        })
      },
      handlePreview (file) {
        this.handleDownload(file)
      },
      handleExceed () {
        this.$message.warning(`每次只能上传${this.config.limit || 5}个文件`)
      },
      handleProgress (event, file, fileList) {
      },
      handleError (err) {
        console.log(err)
      }
    }
  }
</script>
<style lang="scss">
  .upload-demo{
    ul{
      li{
        width: 300px;
        margin-right: 50px;
        float: left;
      }
    }
  }
  .isHidden {
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 240px;
    height: 178px;
    display: block;
  }
  .v-modal{
    z-index: 2000!important;
  }
</style>
