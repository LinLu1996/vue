<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="运输证号">
            <el-input v-model="dataForm.transportNo" placeholder="许可证号" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商" prop="carrierId">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList " placeholder="选择或输入查找"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效期">
            <xkl-date-picker v-model="dateValue" value-format="yyyy-MM-dd"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车牌号">
            <el-input v-model="dataForm.carNumber" placeholder="车牌号" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否启用">
            <el-select style="width: 100%" v-model="dataForm.isEnabled" placeholder="状态" clearable>
              <el-option value="0" label="启用"></el-option>
              <el-option value="1" label="禁用"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-right: 5px">
          <el-form-item style="margin-bottom: 5px">
            <el-button v-if="isAuth('sys:dict:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
            <!--<el-button v-if="isAuth('sys:dict:delete')" type="danger" @click="deleteHandle()" size="mini" :disabled="dataListSelections.length <= 0">-->
              <!--<icon-svg name="批量删除" style="vertical-align: middle"></icon-svg>-->
              <!--批量删除</el-button>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      @row-dblclick="dbShowDetails">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="transportNo"
        header-align="center"
        width="120"
        align="center"
        label="运输证号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carNumber"
        header-align="center"
        align="center"
        label="车牌号"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="propertyName"
        header-align="center"
        align="center"
        label="业户名称"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="证件有效期"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.startValidDate + '——' + row.endValidDate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="verifyDate"
        header-align="center"
        align="center"
        label="核发日期"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="verifyOffice"
        header-align="center"
        align="center"
        label="核发机关"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isEnabled"
        header-align="center"
        align="center"
        label="是否启用"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-switch
            @change="(val) => handleStatus(val, row.id)"
            v-model="row.isEnabled"
            active-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button type="warning" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <!--<el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 编辑 -->
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      title="道路运输证导入"
      fileName="道路运输证导入模板.xlsx"
      uploadUrl="/transresources/trroadtransportlicence/importRoadTransportLicence"
      submitUrl="/transresources/trroadtransportlicence/trueExport"
      @refreshDataList="getDataList"></upload-page>
    <certificate-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></certificate-details>
    <upload-road-feedback v-if="uploadRoadFeedbackVisible" ref="uploadRoadFeedback" @refreshDataList="getSearchDataList"></upload-road-feedback>
  </div>
</template>

<script>
  import { formatDate } from '@/utils';
  import CertificateDetails from './certificate-details'
  import uploadPage from '@/components/upload/upload-page'
  import UploadRoadFeedback from '../carrier/upload-road-feedback'

  export default {
    data () {
      return {
        urls: this.$http.adornUrl(`/transresources/trroadtransportlicence/importRoadTransportLicence?token=${this.$cookie.get('token')}`),
        dataForm: {
          transportNo: '',
          carrierId: '',
          begindate: '',
          enddate: '',
          carNumber: '',
          isEnabled: ''
        },
        importVisible: false,
        dataList: [{name: 1}],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dateValue: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        isShowDetails: false,
        uploadRoadFeedbackVisible: false
      }
    },
    components: {
      CertificateDetails,
      UploadRoadFeedback,
      uploadPage
    },
    activated () {
      this.resetForm()
    },
    methods: {
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
      },
      handleChange (file) {
      },
      handleAvatarSuccess (response) {
        this.uploadRoadFeedbackVisible = true
        this.$nextTick(() => {
          this.$refs.uploadRoadFeedback.init(response, 'certificate')
        })
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trroadtransportlicence/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'begindate': this.dateValue[0],
            'enddate': this.dateValue[1]
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.verifyDate) {
                res.verifyDate = formatDate(res.verifyDate)
              }
              if (res.startValidDate) {
                res.startValidDate = formatDate(res.startValidDate)
              }
              if (res.endValidDate) {
                res.endValidDate = formatDate(res.endValidDate)
              }
              res.isEnabled === 0 ? res.isEnabled = true : res.isEnabled = false
              return res
            })
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = [{name: 1}]
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      showDetails (id) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id)
        })
      },
      // 双击显示详情
      dbShowDetails (row) {
        this.isShowDetails = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id)
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        this.$router.push({
          path: '/trans-certificate/certificate-add-or-update',
          query: {
            id: id
          }
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trroadtransportlicence/delete'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      handleStatus (val, id) {
        const isEnabled = val === true ? 0 : 1
        this.$http({
          url: this.$http.adornUrl('/transresources/trroadtransportlicence/isEnable'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'isEnabled': isEnabled
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
          } else {
            this.$message(data.msg)
          }
        })
      },
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      handleImport () {

      }
    }
  }
</script>
