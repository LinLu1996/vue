<template>
  <el-dialog
    title="详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label-width="0">
        <el-tag>基本信息</el-tag>
      </el-form-item>
      <el-row style="border-bottom: 1px solid #CCCCCC;margin-bottom: 20px">
        <el-col :span="22">
          <el-col :span="12">
            <el-form-item label="模板名称：">
              <span style="width: 90%; display: block">
                {{dataForm.templateName}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板编号：">
              <span style="width: 90%; display: block">
                {{dataForm.templateCode}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期：">
              <span style="width: 90%; display: block">
                {{dataForm.templateAproveDate}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实施日期：">
              <span style="width: 90%; display: block">
                {{dataForm.templateImplementedDate}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="模板说明：">
              <span style="width: 90%; display: block">
                {{dataForm.templateRemark}}
              </span>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-form-item label-width="0">
        <el-tag>考核信息</el-tag>
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
              <el-form-item label="考核分类：" prop="type">
                <span style="width: 90%; display: block">
                  {{addItem.assessmentClassificationName}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考核项目：" prop="carrierType">
                <span style="width: 90%; display: block">
                  {{addItem.assessmentProjectName}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form label-width="100px" label-position="top" :model="dataForm">
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
                <el-row v-for="(item, index) in  addItem.relationEntityList" :key="index">
                  <el-col :span="9" :offset="1">
                    <el-form-item prop="carrierName">
                      <span style="width: 90%; display: block">
                        {{item.assessmentStandardName}}
                      </span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" :offset="2">
                    <el-form-item>
                      <span style="width: 90%; display: block">
                        {{item.percentStandard}}
                      </span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5" :offset="2">
                    <el-form-item>
                      <span style="width: 90%; display: block">
                        {{item.weightScore}}
                      </span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeForm()">取消</el-button>
      <el-button type="success" size="small" icon="el-icon-view" :disabled="!dataForm.kpiTemplateRelationEntityList.length" @click="goPreview()">预览</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import contractUpload from './contract-upload'
  export default {
    data () {
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
        openType: ''
      }
    },
    watch: {
    },
    components: {
      // contractUpload
    },
    methods: {
      init (id) {
        this.clickFlag = true
        this.visible = true
        this.dataForm.id = id || 0
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
      goPreview () {
        this.$router.push({
          name: 'template-view',
          params: this.dataForm.kpiTemplateRelationEntityList
        })
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
