<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号">
            <el-input v-model="dataForm.carrierCode" placeholder="合同编号" maxlength="20" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运商">
            <xkl-select style="width: 100%" v-model="dataForm.shortName" keyType="carrierName" labelType="carrierName" linkage="/transresources/trcarrier/noPowerList" placeholder="承运商名称"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称">
            <el-input v-model="dataForm.carrierName" placeholder="合同名称" maxlength="30" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型">
            <xkl-select style="width: 100%" v-model="dataForm.carrierType" keyType="carrierType" select-type="CONTRACT_TYPE" placeholder="合同类型"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订部门">
            <xkl-select style="width: 100%" v-model="dataForm.signDep" keyType="departId" labelType="departName" linkage="/sys/sysdepart/getByCompanyId" placeholder="签订部门"></xkl-select>
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
            <el-button type="success" size="mini" :disabled="currentStatus === 1" @click="toORBackExamine(1)">
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
            <el-button type="success" size="mini" :disabled="currentStatus === 0" @click="toORBackExamine(0)">
              <icon-svg name="反审核" style="vertical-align: middle"></icon-svg>
              反审核</el-button>
            <el-button type="danger" size="mini" @click="toORBackExamine(2)">
              <icon-svg name="作废" style="vertical-align: middle"></icon-svg>
              作废</el-button>

            <el-button type="primary" size="mini" :disabled="currentStatus === ''|| this.selectionDataList.length>1"
                       @click="addAgreement()">
              <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
              补充协议</el-button>
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
      @select-all="selectAll"
      @row-dblclick="dbShowDetails"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="60"
        :selectable="selectable">
      </el-table-column>
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
        label="合同编号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="合同名称"
        min-width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortName"
        header-align="center"
        align="center"
        label="承运商名称"
        min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="contractTypeName"
        header-align="center"
        align="center"
        label="合同类型"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierEndDtm"
        header-align="center"
        align="center"
        label="履行期限"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="signDtm"
        header-align="center"
        align="center"
        label="签订日期"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="departName"
        header-align="center"
        align="center"
        label="签订部门"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierStatus"
        header-align="center"
        align="center"
        label="状态"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag v-if="row.carrierStatus === 0" size="mini">待审核</el-tag>
          <el-tag v-if="row.carrierStatus === 1" size="mini" type="success">已审核</el-tag>
          <el-tag v-if="row.carrierStatus === 2" size="mini" type="info">已作废</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="200"
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <!--<el-button icon="el-icon-circle-plus-outline" type="success" size="mini" @click="addAgreement(scope.row.id)">添加补充协议</el-button>-->
          <el-button type="warning" size="small" @click="showDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <!--<el-button v-if="isAuth('sys:dict:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>-->
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
    <contract-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></contract-details>
    <agreement-list v-if="isShowAgreement" ref="agreementList" @refreshDataList="getDataList"></agreement-list>
  </div>
</template>

<script>
  import { formatDate } from '@/utils';
  import ContractDetails from './contract-details'
  import AgreementList from './agreement-list'
  export default {
    data () {
      return {
        dataForm: {
          carrierCode: '',
          shortName: '',
          carrierName: '',
          carrierType: '',
          signDep: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dateValue: [],
        dataListLoading: false,
        selectionDataList: [],
        addOrUpdateVisible: false,
        isShowDetails: false,
        isShowAgreement: false,
        currentStatus: ''
      }
    },
    components: {
      ContractDetails,
      AgreementList
    },
    activated () {
      this.resetForm()
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init () {
        if (this.$route.params.id) {
          this.showAgreement(this.$route.params.id)
        }
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontract/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.dataList = this.dataList.map(res => {
              if (res.signDtm) {
                res.signDtm = formatDate(res.signDtm)
              }
              if (res.carrierEndDtm) {
                res.carrierEndDtm = formatDate(res.carrierEndDtm)
              }
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
        if (val.length) {
          this.currentStatus = val[0].carrierStatus
        } else {
          this.currentStatus = ''
        }
        this.selectionDataList = val
      },
      selectAll () {
        this.selectionDataList = this.selectionDataList.filter(res => res.carrierStatus === this.currentStatus)
      },
      selectable (row) {
        if (row.carrierStatus === 2) {
          return false
        }
        if (this.selectionDataList.length && row.carrierStatus !== this.currentStatus) {
          return false
        }
        return true
      },
      toORBackExamine (status) {
        if (!this.selectionDataList.length) {
          this.$message({
            type: 'warning',
            message: '请至少选择一条合同'
          })
          return false
        }
        let ids = this.selectionDataList.map(item => {
          return item.id
        })
        let carrierNames = this.selectionDataList.map(item => {
          return item.carrierName
        })
        this.$confirm(`合同名称：${carrierNames}`, `确定${status === 2 ? '作废' : (status === 0 ? '反审核' : '审核')}该合同？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/transresources/trcontract/audit'),
            method: 'post',
            data: this.$http.adornData({
              ids,
              carrierStatus: status
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `${status === 2 ? '作废' : (status === 0 ? '反审核' : '审核')}成功`,
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
          path: '/contract/contract-add-or-update',
          query: {
            id: id
          }
        })
      },
      addAgreement (id) {
        this.$router.push({
          path: '/contract/agreement-add',
          query: {
            contractId: this.selectionDataList[0].id
          }
        })
      },
      showAgreement (id) {
        this.isShowAgreement = true
        this.$nextTick(() => {
          this.$refs.agreementList.init(id)
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
            url: this.$http.adornUrl('/transresources/trcontract/delete'),
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
      resetForm () {
        this.dataForm = {}
        this.dateValue = []
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>
