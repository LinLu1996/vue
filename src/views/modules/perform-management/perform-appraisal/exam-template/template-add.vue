<template>
  <div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row style="border-bottom: 1px solid #CCCCCC;margin-bottom: 20px">
        <el-col :span="22">
          <el-col :span="12">
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="dataForm.templateName" maxLength="10" placeholder="模板名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编号" prop="templateCode">
              <el-input v-model="dataForm.templateCode" maxLength="10" placeholder="模板编号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期" prop="templateAproveDate">
              <xkl-date-picker type="date" v-model="dataForm.templateAproveDate" placeholder="批准日期" clearable></xkl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施日期" prop="templateImplementedDate">
              <xkl-date-picker type="date" v-model="dataForm.templateImplementedDate" placeholder="实施日期" clearable></xkl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板说明">
              <el-input type="textarea" v-model="dataForm.templateRemark" maxLength="5" placeholder="模板说明" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>考核信息</el-tag>
      </el-form-item>
      <el-form-item label-width="50px">
        <el-button type="primary" size="small" plain icon="el-icon-plus" style="background: #3698ce;color: #ffffff" @click="addTemplate()">新增模板</el-button>
      </el-form-item>
      <el-row v-if="!dataForm.kpiTemplateRelationEntityList.length">
        <div>
          <h2 style="text-align: center;color: #dddddd;padding-right: 180px">当前无可用模板！</h2>
        </div>
      </el-row>
      <el-row v-else v-for="(addItem, index) in dataForm.kpiTemplateRelationEntityList" :key="index" style="border-bottom: 1px solid #CCCCCC;margin-bottom: 20px">
        <el-col :span="18">
          <el-row>
            <el-col :span="12">
              <el-form-item label="考核分类" prop="assessmentClassification">
                <xkl-select style="width: 100%" v-model="addItem.assessmentClassification" keyType="id" labelType="name" placeholder="考核分类" assessmentClassificationLevel="1" linkage="/performancemanagement/tkpiassessmentstandard/assessmentStandard" @change="clearNext(addItem, 1)" @getLabel="getLabel(arguments[0], addItem, 1)"></xkl-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核项目" prop="assessmentProject">
                <xkl-select style="width: 100%" v-model="addItem.assessmentProject" keyType="id" labelType="name" placeholder="考核项目" :selectId="addItem.assessmentClassification" assessmentProjectLevel="2" linkage="/performancemanagement/tkpiassessmentstandard/assessmentStandard" @change="clearNext(addItem, 2)" @getLabel="getLabel(arguments[0], addItem, 2)"></xkl-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form label-width="100px" label-position="top" :model="dataForm" :rules="dataRule">
                <el-row>
                  <el-col :span="9" :offset="1">
                    <span style="padding: 10px 0;display: block">考核指标：</span>
                  </el-col>
                  <el-col :span="5" :offset="2">
                    <span style="padding: 10px 0;display: block">百分比标准：</span>
                  </el-col>
                  <el-col :span="5" :offset="2">
                    <span style="padding: 10px 0;display: block">权重分：</span>
                  </el-col>
                </el-row>
                <el-row v-for="(item, index) in addItem.relationEntityList" :key="index">
                  <el-col :span="9" :offset="1">
                    <el-form-item prop="carrierName">
                      <xkl-select style="width: 100%" v-model="item.assessmentStandard" keyType="id" labelType="name" placeholder="考核指标" :selectId="addItem.assessmentProject" assessmentStandardLevel="3" linkage="/performancemanagement/tkpiassessmentstandard/assessmentStandard" @getLabel="getLabel(arguments[0], item, 3)"></xkl-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" :offset="2">
                    <el-form-item>
                      <el-input v-model="item.percentStandard" maxLength="5" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" :offset="2">
                    <el-form-item>
                      <el-input v-model="item.weightScore" maxLength="5" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-form-item>
                <p style="text-align: center">
                  <span style="font-size: 50px;cursor: pointer;color: #3698ce;" @click="addOrRemoveExam(addItem.relationEntityList, 0)">-</span>
                  <span style="font-size: 50px;cursor: pointer;color: #3698ce;margin-left: 20px" @click="addOrRemoveExam(addItem.relationEntityList, 1)">+</span>
                </p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="danger" size="small" plain icon="el-icon-delete" @click="deleteHandle()">删除考核模板</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form style="margin-top: 20px;text-align: center;padding-right: 180px">
      <el-form-item label-width="0">
        <el-button type="success" size="small" icon="el-icon-document" :disabled="!dataForm.kpiTemplateRelationEntityList.length" @click="dataFormSubmit()">保存</el-button>
        <el-button type="success" size="small" icon="el-icon-view" :disabled="!dataForm.kpiTemplateRelationEntityList.length" @click="goPreview()">预览</el-button>
      </el-form-item>
    </el-form>
    <el-form style="margin-top: 20px">
      <el-form-item label-width="50px">
        <el-button type="primary" size="small" plain icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // import contractUpload from './contract-upload'
  import {formatDate} from '../../../../../utils';
  export default {
    data () {
      let verifyPassword = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      return {
        visible: false,
        clickFlag: true,
        linkage: '1',
        dataForm: {
          id: 0,
          templateName: '',
          templateCode: '',
          templateAproveDate: '',
          templateImplementedDate: '',
          templateRemark: '',
          kpiTemplateRelationEntityList: []
        },
        openType: '',
        dataRule: {
          templateName: [
            { required: true, message: '请填写模板名称', trigger: 'change' }
          ],
          templateCode: [
            { required: true, message: '请填写模板编号', trigger: 'change' }
          ],
          templateAproveDate: [
            { required: true, message: '请选择批准日期', trigger: 'blur' }
          ],
          templateImplementedDate: [
            { required: true, message: '请选择实施日期', trigger: 'change' }
          ],
          carrierName: [
            { required: true, message: '请填写合同有效期', trigger: 'blur' }
          ],
          certificatePassword: [
            { required: true, message: '请填写所属项目名称', trigger: 'blur' },
            { validator: verifyPassword, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
    },
    created () {
      this.dataForm.id = this.$route.query.id
      this.init()
    },
    components: {
      // contractUpload
    },
    methods: {
      init () {
        this.clickFlag = true
        this.visible = true
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmenttemplate/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.tKpiAssessmentTemplate
                this.dataForm.kpiTemplateRelationEntityList = data.tKpiAssessmentTemplate.kpiTemplateRelationEntityList
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
              url: this.$http.adornUrl(`/performancemanagement/tkpiassessmenttemplate/${!this.dataForm.id ? 'saveKpiAssessmentTemplate' : 'editKpiAssessmentTemplate'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                ...this.dataForm,
                'templateAproveDate': formatDate(this.dataForm.templateAproveDate),
                'templateImplementedDate': formatDate(this.dataForm.templateImplementedDate)
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
      addTemplate () {
        this.dataForm.kpiTemplateRelationEntityList.push({
          assessmentClassificationName: '',
          assessmentClassification: '',
          assessmentProjectName: '',
          assessmentProject: '',
          relationEntityList: [{assessmentStandard: '', percentStandard: '50%', weightScore: 5}]
        })
      },
      deleteHandle () {
        this.$confirm(`确定删除该模块?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.kpiTemplateRelationEntityList.pop()
        })
      },
      addOrRemoveExam (params, type) {
        if (type === 1) {
          params.push({assessmentStandard: '', percentStandard: '50%', weightScore: 5})
        } else {
          params.pop()
        }
      },
      clearNext (item, type) {
        if (type === 1) {
          this.$set(item, 'assessmentProject', '')
        } else {
          this.$set(item, 'relationEntityList', [{assessmentStandard: '', percentStandard: '50%', weightScore: 5}])
        }
      },
      getLabel (label, item, type) {
        if (type === 1) {
          this.$set(item, 'assessmentClassificationName', label)
        } else if (type === 2) {
          this.$set(item, 'assessmentProjectName', label)
        } else {
          this.$set(item, 'assessmentStandardName', label)
        }
      },
      goPreview () {
        let list = JSON.parse(JSON.stringify(this.dataForm.kpiTemplateRelationEntityList));
        this.$router.push({
          name: 'template-view',
          params: list
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
        // this.$refs['elecSeal'].init()
        // this.$refs['certificate'].init()
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
