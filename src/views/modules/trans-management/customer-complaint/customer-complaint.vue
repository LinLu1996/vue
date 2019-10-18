<template>
  <div>
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="承运商名称">
            <!--<el-input v-model="dataForm.carrierName" placeholder="承运商名称"></el-input>-->
            <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList " placeholder="承运商"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="货主">
            <xkl-select style="width: 100%" v-model="dataForm.consignorId" keyType="id" labelType="ownerName" linkage="/transresources/ttrconsignor/list" placeholder="货主"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题类型">
            <xkl-select style="width: 100%" v-model="dataForm.matterType" select-type="MATTER_TYPE" placeholder="问题类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="投诉日期">
            <xkl-date-picker v-model="complaintTime"></xkl-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发生日期">
            <xkl-date-picker v-model="occurTime"></xkl-date-picker>
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
            <el-button icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增</el-button>
            <el-button type="success" size="mini" icon="el-icon-upload" @click="uploadPageHandle(dataForm.id)">导入</el-button>
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
      @row-dblclick="dbShowDetails"
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
        prop="consignorName"
        header-align="center"
        align="center"
        label="货主"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="warehoseId"
        header-align="center"
        align="center"
        label="仓库"
        width="80"
        show-overflow-tooltip>
      </el-table-column><el-table-column
        prop="complaintDtm"
        header-align="center"
        align="center"
        label="投诉日期"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="occurDtm"
        header-align="center"
        align="center"
        label="发生日期"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="matterValue"
        header-align="center"
        align="center"
        label="问题类型"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isPaperComplaint"
        width="120"
        header-align="center"
        align="center"
        label="书面投诉">
        <template slot-scope="{row}">
          <el-tag v-if="row.isPaperComplaint" type="danger">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small"
                     @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button type="warning" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情
          </el-button>
<!--          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">-->
<!--            删除-->
<!--          </el-button>-->
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
      title="承运商问题汇总导入"
      fileName="承运商问题汇总导入模板.xlsx"
      uploadUrl="/transmanagement/tmcustomercomplaints/export"
      submitUrl="/transmanagement/tmcustomercomplaints/trueExport"
      @refreshDataList="getDataList"></upload-page>
    <!-- 弹窗, 新增 / 编辑 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <show-details v-if="detailsVisible" ref="showDetails"></show-details>
    <customer-complaint-upload v-if="customerComplaintUploadVisible" ref="customerComplaintUpload" @refreshDataList="getDataList"></customer-complaint-upload>
  </div>
</template>

<script>
  import AddOrUpdate from './complaint-add-or-update'
  import uploadPage from '@/components/upload/upload-page'
  import ShowDetails from './customer-complaint-details'
  import CustomerComplaintUpload from './customer-complaint-upload'
  import { toUnderScore, abbreviate, formatDate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          carrierId: '',
          carrierName: '',
          matterType: '',
          consignorId: '',
          consignorName: ''
        },
        importVisible: false,
        occurTime: [],
        complaintTime: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        detailsVisible: false,
        customerComplaintUploadVisible: false,
        selectionDataList: [],
        dataListSelections: [],
        sort: {}
      }
    },
    components: {
      AddOrUpdate,
      ShowDetails,
      CustomerComplaintUpload,
      uploadPage
    },
    activated () {
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
        let afterOccurTime = null
        let beforeOccurTime = null
        let afterComplaintTime = null
        let beforeComplaintTime = null
        if (this.occurTime && this.occurTime.length > 0) {
          beforeOccurTime = this.occurTime[0]
          afterOccurTime = this.occurTime[1]
        }
        if (this.complaintTime && this.complaintTime.length > 0) {
          beforeComplaintTime = this.complaintTime[0]
          afterComplaintTime = this.complaintTime[1]
        }
        this.$http({
          url: this.$http.adornUrl('/transmanagement/tmcustomercomplaints/list '),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'carrierId': this.dataForm.carrierId,
            'carrierName': this.dataForm.carrierName,
            'consignorId': this.dataForm.consignorId,
            'consignorName': this.dataForm.consignorName,
            'matterType': this.dataForm.matterType,
            'beforeOccurTime': beforeOccurTime,
            'afterOccurTime': afterOccurTime,
            'beforeComplaintTime': beforeComplaintTime,
            'afterComplaintTime': afterComplaintTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list && data.page.list.length ? data.page.list.map(item => {
              const kpiYear = item.kpiMonth.substring(0, 4)
              const kpiMon = item.kpiMonth.substring(4)
              item.kpiMonth = `${kpiYear}-${kpiMon}`
              if (item.occurDtm) {
                item.occurDtm = formatDate(item.occurDtm)
              }
              if (item.complaintDtm) {
                item.complaintDtm = formatDate(item.complaintDtm)
              }
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
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, this.values)
        })
      },
      uploadPageHandle (id) {
        this.importVisible = true
        this.$nextTick(() => {
          this.$refs.uploadPage.init(id)
        })
      },
      showDetails (id) {
        this.detailsVisible = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(id, this.values)
        })
      },
      // 双击查看详情
      dbShowDetails (row) {
        this.detailsVisible = true
        this.$nextTick(() => {
          this.$refs.showDetails.init(row.id, this.values)
        })
      },
      customerComplaintUpload () {
        this.customerComplaintUploadVisible = true
        this.$nextTick(() => {
          this.$refs.customerComplaintUpload.init()
        })
      },
      // 删除
      deleteHandle (id) {
        let userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定删除${!this.dataListSelections.length ? '这条' : '选中'}数据?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transmanagement/ttmmatter/delete'),
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
        this.complaintTime = []
        this.occurTime = []
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
      }
    }
  }
</script>
