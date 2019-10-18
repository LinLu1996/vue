<template>
  <el-dialog
    title="补充协议列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
  <div class="mod-config">
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
        prop="effectDtm"
        header-align="center"
        width="120"
        align="center"
        label="生效日期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="agreementName"
        header-align="center"
        align="center"
        label="协议名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="signDtm"
        header-align="center"
        align="center"
        label="签订日期"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="状态"
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.status === 0 ? '生效中' : '已失效'}}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="showAgreementDetails(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            协议详情</el-button>
          <el-button v-if="scope.row.status === 0" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 编辑 -->
    <contract-details v-if="isShowDetails" ref="showDetails" @refreshDataList="getDataList"></contract-details>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils';
  import ContractDetails from './contract-details'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          contractId: ''
        },
        dataList: [{name: 1}],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dateValue: [],
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        isShowDetails: false
      }
    },
    components: {
      ContractDetails
    },
    created () {
      const id = this.$route.query.id || null
      this.init(id)
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.contractId = id
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontractsideagreement/list'),
          method: 'post',
          data: this.$http.adornData({
            'contractId': this.dataForm.contractId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
            this.dataList = this.dataList ? this.dataList.map(res => {
              if (res.signDtm) {
                res.signDtm = formatDate(res.signDtm)
              }
              if (res.effectDtm) {
                res.effectDtm = formatDate(res.effectDtm)
              }
              return res
            }) : [];
          }
          this.dataListLoading = false
        })
      },
      showAgreementDetails (id) {
        this.$router.push({
          path: '/contract/agreement-details',
          query: {
            id: id,
            contractId: this.dataForm.contractId
          }
        })
      },
      deleteHandle (id) {
        this.$http({
          url: this.$http.adornUrl('/transresources/trcontractsideagreement/updateStatus'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'status': 1
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success(data.msg)
            this.init(this.dataForm.contractId)
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>
