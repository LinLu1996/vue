<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
           label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="承运商"  prop="carrierId">
          <xkl-select style="width: 100%"  v-model="dataForm.carrierId" linkage="/transresources/trcarrier/noPowerList" labelType="carrierName" placeholder="承运商"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌号" class="carNumber" prop="appendNumber">
          <xkl-car-number ref="carNumber" v-model="dataForm.appendNumber" @areaPre="getAreaPre"></xkl-car-number>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车型" prop="carType">
          <xkl-select style="width: 100%"  v-model="dataForm.carType" select-type="CAR_TYPE" placeholder="车型"></xkl-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="车辆尺寸" prop="carLong">
          <el-col :span="8">
            <el-form-item prop="carLong">
              <el-input v-model="dataForm.carLong" maxlength="7" clearable>
                <template slot="prepend">长</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carWide">
              <el-input v-model="dataForm.carWide" maxlength="7" clearable>
                <template slot="prepend">宽</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left: 10px">
            <el-form-item prop="carHigh">
              <el-input v-model="dataForm.carHigh" maxlength="7" clearable>
                <template slot="prepend">高</template>
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="载重" prop="carLoad">
          <el-input style="width: 100%" v-model="dataForm.carLoad" placeholder="载重" maxlength="7" clearable><template slot="append">吨</template></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="容积" prop="volume">
          <el-input style="width: 100%" v-model="dataForm.volume" placeholder="容积" maxlength="7" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="上牌日期" prop="cardTime">
          <el-date-picker
            style="width: 100%"
            v-model="dataForm.cardTime"
            type="date"
            placeholder="上牌日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发动机号" prop="engineNumber">
          <el-input style="width: 100%" v-model="dataForm.engineNumber" placeholder="发动机号" maxlength="20" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车架号" prop="frameNumber">
          <el-input style="width: 100%" v-model="dataForm.frameNumber" placeholder="车架号" clearable maxlength="20"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="温区"  prop="warmArea">
          <xkl-select style="width: 100%" v-model="dataForm.warmArea" select-type="TEMPERATURE" placeholder="请选择"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input style="width: 100%" type="textarea" v-model="dataForm.remark" placeholder="备注" rows="4" maxlength="100" clearable></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-tag>GPS信息</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="16" style="text-align: right;">
        <div style="display: inline-block">
          <el-upload
            :action="urls"
            :show-file-list="false"
            :before-upload="checkUpload"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess">
            <el-button size="mini" type="primary" @click="urls = $http.adornUrl(`/transresources/trcar/gpsExport?token=${$cookie.get('token')}`)">导入</el-button>
          </el-upload>
        </div>
        <el-button icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="addGpsList()" style="background: #3698ce;color: #ffffff">新增</el-button>
      </el-col>
    </el-row >
    <template>
      <el-row v-for="(item, index) in dataForm.carGpses" :key="index" style="margin-bottom: 0px">
        <el-col :span="8">
          <el-form-item label="GPS品牌" :prop="'carGpses.'+ index +'.gpsName'" :rules="dataRule.gpsName">
            <xkl-select style="width: 100%" v-model="item.gpsName" placeholder="GPS品牌" keyType="gpsBrand" labelType="gpsBrand" linkage="/transresources/trgps/list"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="text-align: center">
          <el-form-item label="GPS设备号" :prop="'carGpses.'+ index +'.gpsDeviceCode'" :rules="dataRule.gpsDeviceCode">
            <el-input style="width: 100%" v-model="item.gpsDeviceCode" placeholder="GPS设备号" maxlength="50" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="放置位置" :prop="'carGpses.'+ index +'.placePosition'" :rules="dataRule.placePosition">
          <xkl-select style="width: 100%" v-model="item.placePosition" labelType="carrierTpmodeName" select-type="PLACE_POSITION" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align: right">
          <el-button  icon="el-icon-delete" type="danger" size="mini" @click="deleteGpsList(index)"></el-button>
        </el-col>
      </el-row>
    </template>
    <el-row style="margin-bottom: 20px">
      <el-col :span="8">
        <el-form-item label-width="0">
          <el-tag>冷机信息</el-tag>
        </el-form-item>
      </el-col>
      <el-col :span="16" style="text-align: right;">
        <div style="display: inline-block">
          <el-upload
            :action="urls"
            :show-file-list="false"
            :before-upload="checkUpload"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess">
            <el-button size="mini" type="primary" @click="urls = $http.adornUrl(`/transresources/trcar/coolerExport?token=${$cookie.get('token')}`)">导入</el-button>
          </el-upload>
        </div>
        <el-button icon="el-icon-circle-plus-outline" type="primary" size="mini" @click="addCoolerList" style="background: #3698ce;color: #ffffff">新增</el-button>
      </el-col>
    </el-row >
    <template>
      <el-row v-for="(item, index) in dataForm.carCoolers" :key="index" style="margin-bottom: 0px">
        <el-col :span="8">
          <el-form-item label="冷机品牌" :prop="'carCoolers.'+ index +'.coolerName'" :rules="dataRule.coolerName">
            <xkl-select style="width: 100%" ref="coolerSelect" v-model="item.coolerName" placeholder="冷机品牌" keyType="coolerBrand" labelType="coolerBrand" linkage="/transresources/trcooler/list" @change="clearNext(item)"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" style="text-align: center">
          <el-form-item label="冷机型号" :prop="'carCoolers.'+ index +'.coolerModel'" :rules="dataRule.coolerModel">
            <xkl-select style="width: 100%" ref="coolerSelect" v-model="item.coolerModel" placeholder="冷机型号" :coolerBrand="item.coolerName" keyType="coolerModel" labelType="coolerModel" linkage="/transresources/trcooler/list"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="放置位置" :prop="'carCoolers.'+ index +'.placePosition'" :rules="dataRule.placePosition">
            <xkl-select style="width: 100%" v-model="item.placePosition" labelType="carrierTpmodeName" select-type="PLACE_POSITION" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align: right">
          <el-button  icon="el-icon-delete" type="danger" size="mini" @click="deleteCoolerList(index)"></el-button>
        </el-col>
      </el-row>
    </template>
    <el-form-item label-width="0">
      <el-tag>行驶证信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="所有人" prop="carLicence.person" :rules="dataRule.person">
          <el-input style="width: 100%" v-model="dataForm.carLicence.person" placeholder="所有人" clearable maxlength="16"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="使用性质" prop="carLicence.applyNature" :rules="dataRule.applyNature">
          <xkl-select style="width: 100%" v-model="dataForm.carLicence.applyNature" select-type="USAGE_RESTRICTION" placeholder="请选择"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="品牌型号" prop="carLicence.brandModel" :rules="dataRule.brandModel">
          <el-input style="width: 100%" v-model="dataForm.carLicence.brandModel" placeholder="品牌型号" clearable maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="注册日期" prop="carLicence.registerTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            v-model="dataForm.carLicence.registerTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发证日期" prop="carLicence.certificationTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            v-model="dataForm.carLicence.certificationTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="有限期至" prop="carLicence.validTime" :rules="dataRule.validTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            v-model="dataForm.carLicence.validTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="强制报废期至" prop="forceScrapTime">
          <el-date-picker
            style="width: 100%;"
            type="date"
            v-model="dataForm.carLicence.forceScrapTime">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件" prop="carLicence.attachments">
          <xkl-upload v-model="dataForm.carLicence.attachments" :config="uploadConfig"></xkl-upload>
        </el-form-item>
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
  import attachmentUpload from '@/components/upload/attachmentUpload'
  export default {
    data () {
      let verifyCarNumber = (rule, value, callback) => {
        let patrn = /^[a-zA-Z]{1}[a-zA-Z0-9]{4}[a-zA-Z0-9挂学警港澳]{1}$/;
        if (!patrn.test(value)) {
          callback(new Error('请输入合法车牌号'))
        }
        callback()
      }
      let verifyNumberChar = (rule, value, callback) => {
        let patrn = /^(\w){0,50}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      let verifyPositiveNumber = (rule, value, callback) => {
        if (isNaN(value) || value <= 0) {
          callback(new Error('请输入大于0的数字'))
        }
        callback()
      }
      return {
        url: this.$http.adornUrl(`/transresources/trcontract/upload?token=${this.$cookie.get('token')}`),
        urls: '',
        visible: false,
        dataListLoading: false,
        brandListVisible: false,
        clickFlag: true,
        uploadType: '',
        dataForm: {
          id: null,
          carrierId: '',
          carCoolers: [{
            coolerName: '',
            coolerModel: '',
            placePosition: ''
          }],
          coolerName: '',
          coolerModel: '',
          carNumber: '',
          carNumberPre: '沪',
          appendNumber: '',
          cardTime: '',
          carType: '',
          engineNumber: '',
          volume: '',
          carLong: '',
          carHigh: '',
          frameNumber: '',
          carWide: '',
          carGpses: [{
            gpsName: '',
            gpsDeviceCode: '',
            placePosition: ''
          }],
          gpsName: '',
          gpsDeviceCode: '',
          carLoad: '',
          warmArea: '',
          remark: '',
          carLicence: {
            person: '',
            applyNature: '',
            brandModel: '',
            registerTime: '',
            certificationTime: '',
            validTime: '',
            forceScrapTime: '',
            attachments: []
          }
        },
        carNumberPres: [],
        dataList: [{name: 1}],
        uploadConfig: {
          fileListType: 'picture-card', // 设置列表展示类型，参数（picture-card/picture/text）默认 text ，注：仅在fileListShow为true时生效
          fileListShow: true, // 当使用导入功能时置为false 默认true
          uploadUrl: '/transresources/trcontract/upload', // 文件上传地址
          downloadUrl: '/transresources/trcontract/download', // 文件下载地址
          single: false // 单个文件上传，用于头像，身份证，驾驶证等唯一性证件展示，不支持下载，默认false
        },
        dataRule: {
          carrierId: [
            {required: true, trigger: 'change', message: '请选择承运商名称'}],
          carType: [
            {required: true, trigger: 'change', message: '请选择车型'}],
          engineNumber: [
            {validator: verifyNumberChar}],
          frameNumber: [
            {validator: verifyNumberChar}],
          coolerName: [
            {required: true, trigger: 'change', message: '请选择冷机品牌'}],
          coolerModel: [
            {required: true, trigger: 'change', message: '选择冷机型号'}],
          gpsName: [
            {required: true, trigger: 'change', message: '请选择GPS品牌'}],
          gpsDeviceCode: [
            {required: true, trigger: 'blur', message: '请填写GPS设备号'},
            {validator: verifyNumberChar}],
          appendNumber: [{required: true,  trigger: 'blur', message: '请填写车牌号'},
            {validator: verifyCarNumber, trigger: 'blur'}
          ],
          placePosition: [
            {required: true, trigger: 'change', message: '请选择放置位置'}],
          cardTime: [
            {required: true, trigger: 'blur', message: '请选择上牌日期'}],
          carLong: [
            {required: true, message: '请输入车长'},
            {validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          carWide: [
            {required: true, message: '请输入车宽', trigger: 'blur'},
            { validator: verifyPositiveNumber, trigger: 'blur' }
          ],
          carHigh: [
            { required: true, message: '请输入车高', trigger: 'blur' },
            {validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          carLoad: [
            {required: true, validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          volume: [
            {required: true, validator: verifyPositiveNumber, trigger: 'blur'}
          ],
          person: [
            {required: true, trigger: 'blur', message: '请输入所有人'}],
          applyNature: [
            {required: true, trigger: 'change', message: '请选择使用性质'}],
          brandModel: [
            {required: true, trigger: 'blur', message: '请填写品牌型号'},
            {validator: verifyNumberChar, trigger: 'blur'}],
          validTime: [
            {required: true, message: '请输入有效时间'}]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    watch: {
    },
    activated () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    components: {
      attachmentUpload
    },
    methods: {
      init (id, values) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcar/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.carrierId = data.trCar.carrierId
                this.dataForm.carCoolers = data.trCar.carCoolers
                this.dataForm.cardTime = new Date(data.trCar.cardDtm)
                this.dataForm.carType = data.trCar.carType
                this.dataForm.carNumber = data.trCar.carNumber
                this.dataForm.carNumberPre = data.trCar.carNumber.substring(0, 1)
                if (this.dataForm.carNumberPre === '内') {
                  this.dataForm.carNumberPre = '内蒙古'
                  this.dataForm.appendNumber = data.trCar.carNumber.substring(3, 9)
                } else {
                  this.dataForm.appendNumber = data.trCar.carNumber.substring(1, 7)
                }
                this.dataForm.carHigh = data.trCar.carHigh
                this.dataForm.engineNumber = data.trCar.engineNumber
                this.dataForm.carLong = data.trCar.carLong
                this.dataForm.frameNumber = data.trCar.frameNumber
                this.dataForm.carWide = data.trCar.carWide
                this.dataForm.carGpses = data.trCar.carGpses
                this.dataForm.remark = data.trCar.remark
                this.dataForm.carLoad = data.trCar.carLoad
                this.dataForm.warmArea = data.trCar.warmArea
                this.dataForm.volume = data.trCar.volume
                this.dataForm.carLicence = data.trCar.carLicence ? data.trCar.carLicence : this.dataForm.carLicence;
                this.dataForm.carLicence.registerTime = data.trCar.carLicence.registerTime ? new Date(data.trCar.carLicence.registerTime) : '';
                this.dataForm.carLicence.certificationTime = data.trCar.carLicence.certificationTime ? new Date(data.trCar.carLicence.certificationTime) : '';
                this.dataForm.carLicence.validTime = new Date(data.trCar.carLicence.validTime)
                this.dataForm.carLicence.forceScrapTime = data.trCar.carLicence.forceScrapTime ? new Date(data.trCar.carLicence.forceScrapTime) : '';
                this.dataForm.carLicence.attachments = data.trCar.attachments ? data.trCar.attachments : []
                this.$nextTick(() => {
                  this.$refs.carNumber.init(this.dataForm.carNumberPre)
                })
              }
            })
          }
        })
      },
      addGpsList () {
        this.dataForm.carGpses.push(
          {
            gpsName: '',
            gpsDeviceCode: '',
            placePosition: ''
          }
        )
      },
      deleteGpsList (index) {
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.carGpses.splice(index, 1)
        })
      },
      addCoolerList () {
        this.dataForm.carCoolers.push(
          {
            coolerName: '',
            coolerModel: '',
            placePosition: ''
          }
        )
      },
      deleteCoolerList (index) {
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.carCoolers.splice(index, 1)
        })
      },
      clearNext (item) {
        this.$set(item, 'coolerModel', '')
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getAreaPre (area) {
        this.dataForm.carNumberPre = area
      },
      getBrandList (type) {
        let date = null
        if (type && type === 'cooler') {
          date = this.dataForm.carCoolers
        } else {
          date = this.dataForm.carGpses
          console.log(date)
        }
        this.brandListVisible = true
        this.$nextTick(() => {
          this.$refs.brandList.init(type, date)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (!this.clickFlag) {
            return
          }
          if (valid) {
            this.clickFlag = false
            this.$http({
              url: this.$http.adornUrl(`/transresources/trcar/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                carNumber: this.dataForm.carNumberPre + this.dataForm.appendNumber
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    window.history.go(-1)
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
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
        if (this.uploadType === 'gps') {
          this.urls = this.$http.adornUrl(`/transresources/trcar/gpsExport?token=${this.$cookie.get('token')}`)
        }
        if (this.uploadType === 'cooler') {
          this.urls = this.$http.adornUrl(`/transresources/trcar/coolerExport?token=${this.$cookie.get('token')}`)
        }
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      handleAvatarSuccess (response) {
        if (response.gps) {
          response.gps.map(res => {
            if (this.dataForm.carGpses.length && !this.dataForm.carGpses[0].gpsName) {
              this.dataForm.carGpses = []
            }
            if (!this.dataForm.carGpses.length) {
              this.dataForm.carGpses = []
            }
            this.dataForm.carGpses.push(
              {
                gpsName: res.gpsName,
                gpsDeviceCode: res.gpsDeviceCode,
                placePosition: res.placePosition
              }
            )
          })
        }
        if (response.cooler) {
          response.cooler.map(res => {
            if (this.dataForm.carCoolers.length && !this.dataForm.carCoolers[0].coolerName) {
              this.dataForm.carCoolers = []
            }
            if (!this.dataForm.carCoolers.length) {
              this.dataForm.carCoolers = []
            }
            this.dataForm.carCoolers.push(
              {
                coolerName: res.coolerName,
                coolerModel: res.coolerModel,
                placePosition: res.placePosition
              }
            )
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/.el-form-item .el-form-item__content .el-input-group__prepend{
    padding: 5px!important;
  }
  /deep/.carNumber .el-input-group__prepend{
    width: 100px!important;
    text-align: center;
  }
</style>
