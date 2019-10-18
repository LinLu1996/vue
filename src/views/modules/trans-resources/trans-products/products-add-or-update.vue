<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="产品编号" prop="prdNo">
          <el-input v-model="dataForm.prdNo" @blur="handlePrdNo" maxlength="20" clearable placeholder="产品编号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品名称" prop="prdName">
          <el-input v-model="dataForm.prdName" maxlength="20" clearable placeholder="产品名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="运输方式" prop="tpMode">
          <xkl-select style="width: 100%" v-model="dataForm.tpMode" select-type="TRANSPORT_TYPE" placeholder="运输方式"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="配载方式" prop="loadingMode">
          <xkl-select style="width: 100%" v-model="dataForm.loadingMode" select-type="LOADING_MODE" placeholder="配载方式"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="温控类型" prop="tempMode">
          <xkl-select style="width: 100%" v-model="dataForm.tempMode" select-type="TEMP_MODE"  placeholder="温控类型"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label=是否启用 prop="isEnabled">
          <el-radio-group v-model="dataForm.isEnabled">
            <el-radio :label=0>启用</el-radio>
            <el-radio :label=1>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注">
          <el-input v-model="dataForm.remark" type="textarea" rows="4" maxlength="160"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>质量标准</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <el-form-item label="标准内容" prop="qualityStandard">
          <el-input v-model="dataForm.qualityStandard" type="textarea" rows="3" maxlength="160"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="attachments">
          <xkl-upload v-model="dataForm.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>服务标准</el-tag>
    </el-form-item>
    <el-row>
      <!--<el-col style="text-align: right">-->
        <!--<el-form-item style="margin-bottom: 5px;margin-right: 30px">-->
          <!--<el-button type="success" @click="getProductList" size="mini">-->
            <!--<icon-svg name="选择" style="vertical-align: middle"></icon-svg>-->
            <!--选择</el-button>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
    </el-row>
    <el-row>
      <el-col>
        <el-table
          :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            type="index"
            width="60"
            align="center"
            label="No.">
          </el-table-column>
          <el-table-column
            prop="carrierCode"
            header-align="center"
            width="120"
            align="center"
            label="考核分类"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="contractTypeName"
            header-align="center"
            align="center"
            label="考核项目"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="carrierName"
            header-align="center"
            align="center"
            label="考核指标"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="shortName"
            header-align="center"
            align="center"
            label="标准分值1"
            show-overflow-tooltip>
            <template slot-scope="{ row }">
              <el-input v-model="linkage"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="signDtm"
            header-align="center"
            align="center"
            label="标准分值2"
            show-overflow-tooltip>
            <template slot-scope="{ row }">
              <el-input v-model="linkage"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.go(-1)">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    data () {
      // let verifyChar = (rule, value, callback) => {
      //   let patrn = /^(\w){0,30}$/;
      //   if (!patrn.exec(value)) {
      //     callback(new Error('只能输入字母、数字、下划线'))
      //   }
      //   callback()
      // }
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
        dataListLoading: false,
        dataList: [],
        linkage: '1',
        dataForm: {
          id: 0,
          prdNo: '',
          prdName: '',
          tpMode: '',
          loadingMode: '',
          tempMode: '',
          isEnabled: 1,
          remark: '',
          qualityStandard: '',
          pathName: '',
          attachments: []
        },
        signDepData: [],
        dataRule: {
          prdNo: [
            {required: true, message: '请填写产品编号', trigger: 'blur'},
            {validator: verifyNumberChar}
          ],
          prdName: [
            { required: true, message: '请填写产品名称', trigger: 'blur' }
          ],
          tpMode: [
            { required: true, message: '请选择运输方式', trigger: 'change' }
          ],
          loadingMode: [
            { required: true, message: '请选择配载方式', trigger: 'change' }
          ],
          tempMode: [
            { required: true, message: '请选择温控类型', trigger: 'change' }
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
      'dataForm.attachments' () {
        console.log(this.dataForm.attachments)
      }
    },
    components: {
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.clickFlag = true
        this.dataForm.id = this.$route.query.id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/transresources/trproduct/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.prdNo = data.tTrProduct.prdNo
                this.dataForm.prdName = data.tTrProduct.prdName
                this.dataForm.tpMode = data.tTrProduct.tpMode
                this.dataForm.loadingMode = data.tTrProduct.loadingMode
                this.dataForm.tempMode = data.tTrProduct.tempMode
                this.dataForm.isEnabled = data.tTrProduct.isEnabled
                this.dataForm.remark = data.tTrProduct.remark
                this.dataForm.qualityStandard = data.tTrProduct.qualityStandard
                this.dataForm.pathName = data.tTrProduct.pathName
                this.dataForm.attachments = data.tTrProduct.attachmentList ? data.tTrProduct.attachmentList : []
              }
            })
          } else {
            this.isDisabled = false
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
              url: this.$http.adornUrl(`/transresources/trproduct/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'prdNo': this.dataForm.prdNo,
                'prdName': this.dataForm.prdName,
                'tpMode': this.dataForm.tpMode,
                'loadingMode': this.dataForm.loadingMode,
                'tempMode': this.dataForm.tempMode,
                'isEnabled': this.dataForm.isEnabled,
                'remark': this.dataForm.remark,
                'qualityStandard': this.dataForm.qualityStandard,
                'attachments': this.dataForm.attachments
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-trans-products/products'})
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
      getProductList () {
        this.$router.push({
          name: 'product-list'
        })
      },
      handlePrdNo (event) {
        this.$http({
          url: this.$http.adornUrl(`/transresources/trproduct/byProductNo/${event.target.value}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code !== 0) {
            this.$message(data.msg)
            this.dataForm.prdNo = ''
          }
        })
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
</style>
