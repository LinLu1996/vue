<template>
  <div>
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" labelType="carrierName" placeholder="承运商名称" linkage="/transresources/trcarrier/findList"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="KPI月度">
            <el-date-picker
              v-model="dataForm.kpiMonth"
              style="width: 100%;"
              type="month"
              placeholder="KPI月度">
            </el-date-picker>
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
            <el-button type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
            <el-button icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @sort-change="changeSort"
      ref="tableList"
      @row-dblclick="dbGetVehicleInfo"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="kpiMonth"
        header-align="center"
        align="center"
        label="KPI月度"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="承运商"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="planedCarNum"
        header-align="center"
        align="center"
        label="计划车次数"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="supportCarNum"
        header-align="center"
        align="center"
        label="支援车次数"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="realityCarNum"
        width="120"
        header-align="center"
        align="center"
        label="实际车次数">
      </el-table-column>
      <el-table-column
        prop="fillRate"
        width="150"
        header-align="center"
        align="center"
        label="运力满足率">
        <template slot-scope="{row}">{{row.fillRate + '%'}}</template>
      </el-table-column>
      <el-table-column
        prop="unprotectedNumber"
        width="140"
        header-align="center"
        align="center"
        label="未保障车次数">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button type="warning" size="small" @click="getVehicleInfo(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <!--<el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">-->
            <!--删除-->
          <!--</el-button>-->
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
    <upload-page
      v-if="importVisible"
      ref="uploadPage"
      title="车辆保障率导入"
      fileName="车辆保障率导入模板.xlsx"
      uploadUrl="/transmanagement/tmcarensurerate/importCarEnsurerate"
      submitUrl="/transmanagement/tmcarensurerate/trueExport"
      @refreshDataList="getDataList"></upload-page>
    <!-- 弹窗, 新增 / 编辑 -->
    <vehicle-add-or-update v-if="vehicleAddOrUpdateVisible" ref="vehicleAddOrUpdate" @refreshDataList="getDataList"></vehicle-add-or-update>
    <!-- 弹窗, 详情 -->
    <vehicle-support-rate-info  v-if="vehicleSupportRateInfoVisible" ref="vehicleSupportRateInfo"></vehicle-support-rate-info>
  </div>
</template>

<script>
  import VehicleAddOrUpdate from './vehicle-add-or-update'
  import VehicleSupportRateInfo from './vehicle-support-rate-Info'
  import uploadPage from '@/components/upload/upload-page'
  import { toUnderScore, abbreviate, formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          id: '',
          carrierId: '',
          kpiMonth: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        vehicleAddOrUpdateVisible: false,
        vehicleSupportRateInfoVisible: false,
        sort: {},
        importVisible: false,
        urls: ''
      }
    },
    components: {
      VehicleAddOrUpdate,
      VehicleSupportRateInfo,
      uploadPage
    },
    activated () {
      this.urls = this.$http.adornUrl(`/transmanagement/tmcarensurerate/importCarEnsurerate?token=${this.$cookie.get('token')}`)
      this.resetForm()
    },
    methods: {
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transmanagement/tmcarensurerate/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.carrierId,
            'kpiMonth': this.dataForm.kpiMonth ? formatDate(this.dataForm.kpiMonth, 'Month').split('-').join('') : ''
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list && data.page.list.length ? data.page.list.map(item => {
              const kpiYear = item.kpiMonth.substring(0, 4)
              const kpiMon = item.kpiMonth.substring(4)
              item.kpiMonth = `${kpiYear}-${kpiMon}`
              return item
            }) : []
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.vehicleAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.vehicleAddOrUpdate.init(id)
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      // 详情
      getVehicleInfo (id) {
        this.vehicleSupportRateInfoVisible = true
        this.$nextTick(() => {
          this.$refs.vehicleSupportRateInfo.init(id)
        })
      },
      // 双击查看详情
      dbGetVehicleInfo (row) {
        this.vehicleSupportRateInfoVisible = true
        this.$nextTick(() => {
          this.$refs.vehicleSupportRateInfo.init(row.id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transmanagement/tmcarensurerate/delete'),
            method: 'delete',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
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
        }).catch(() => {
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
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.$refs['tableList'].clearSort()
        this.getDataList()
      },
      changeSort (sortRule) {
        const column = toUnderScore(sortRule.prop)
        const order = abbreviate(sortRule.order)
        this.dataForm.sort = {
          column: column,
          order: order
        }
        this.getDataList()
      },
      checkUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.warning('文件不能大于50M')
          return false
        }
      },
      handleChange (file) {
        this.dataListLoading = true
        if (file.status === 'success') {
          this.dataListLoading = true
        }
      },
      handleAvatarSuccess (response) {
        this.getSearchDataList()
      }
    }
  }
</script>
