<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="委托方名称">
            <el-input v-model="dataForm.ownerName" placeholder="委托方名称" clearable></el-input>
            <!--<xkl-select style="width: 100%" v-model="dataForm.ownerName" keyType="ownerName" labelType="ownerName" placeholder="委托方名称" linkage="/transresources/ttrconsignor/list"></xkl-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称">
            <el-input v-model="dataForm.shortOwnerName" placeholder="简称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="save货主编码">
            <el-input v-model="dataForm.saveOwnerCode" placeholder="save货主编码" clearable></el-input>
            <!--<xkl-select style="width: 100%" v-model="dataForm.ownerName" keyType="ownerName" labelType="ownerName" placeholder="委托方名称" linkage="/transresources/ttrconsignor/list"></xkl-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流货主编码">
            <el-input v-model="dataForm.logisticsOwnerCode" placeholder="物流货主编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内部货主">
            <el-select style="width: 100%" v-model="dataForm.isInsideOwner" placeholder="内部货主" clearable>
              <el-option value="0" label="是"></el-option>
              <el-option value="1" label="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;padding-right: 5px">
          <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          <el-button style="background-color: #30b6aa; color: white" icon="el-icon-refresh" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="dbGetDelegateInfo"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        prop="consignorNo"
        header-align="center"
        align="center"
        label="委托方编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="consignorNo"
        header-align="center"
        align="center"
        label="save货主编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="logisticsOwnerCode"
        header-align="center"
        align="center"
        label="物流货主编码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortOwnerName"
        header-align="center"
        align="center"
        label="简称"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="isInsideOwner"
        header-align="center"
        align="center"
        label="是否内部货主"
        show-overflow-tooltip>
          <template slot-scope="{row}">
            <el-tag size="mini" v-if="row.isInsideOwner === 0">是</el-tag>
            <el-tag type="info" size="mini" v-if="row.isInsideOwner === 1">否</el-tag>
          </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="是否启用"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-switch
            @change="(val) => handleStatus(val, row.id)"
            v-model="row.status"
            active-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getDelegateInfo(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
          <el-button type="primary" size="small" @click="getProductList('delegate', scope.row)" style="width: 100px!important;">
            <icon-svg name="备案列表" style="vertical-align: middle"></icon-svg>
            委托产品</el-button>
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
    <!-- 导入弹窗 -->
    <import-delegate v-if="importDelegateVisible" ref="importDelegate" @refreshDataList="getDataList"></import-delegate>
    <!-- 详情弹窗 -->
    <delegate-info  v-if="delegateInfoVisible" ref="delegateInfo"></delegate-info>
  </div>
</template>

<script>
  import ImportDelegate from './import-delegate'
  import DelegateInfo from './delegate-info'
  export default {
    data () {
      return {
        dataForm: {
          ownerName: '',
          shortOwnerName: '',
          logisticsOwnerCode: '',
          saveOwnerCode: '',
          isInsideOwner: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        importDelegateVisible: false,
        delegateInfoVisible: false
      }
    },
    components: {
      ImportDelegate,
      DelegateInfo
    },
    activated () {
      this.resetForm()
    },
    watch: {
      '$route.params' (newVal) {
        if (this.$route.params.length) {
          this.productLists = this.$route.params
          this.dataForm.contractProductIds = this.productLists.map(res => {
            return res.id
          })
        }
      }
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
          url: this.$http.adornUrl('/transresources/ttrconsignor/list'),
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
              res.status === 0 ? res.status = true : res.status = false
              return res
            })
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
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
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 备案
      recordHandle (params) {
        this.$router.push({
          name: 'record-list',
          params: params
        })
      },
      recordListHandle (params) {
        this.$router.push({
          name: 'record-list',
          params: params
        })
      },
      importSave () {
        this.importDelegateVisible = true
        this.$nextTick(() => {
          this.$refs.importDelegate.init()
        })
      },
      getDelegateInfo (id) {
        this.delegateInfoVisible = true
        this.$nextTick(() => {
          this.$refs.delegateInfo.init(id)
        })
      },
      // 双击显示详情
      dbGetDelegateInfo (row) {
        this.delegateInfoVisible = true
        this.$nextTick(() => {
          this.$refs.delegateInfo.init(row.id)
        })
      },
      getProductList (type, params) {
        this.$router.push({
          name: 'product-list',
          params: {
            type: type,
            id: params.id,
            isSelected: params.trConsignorProductEntityList
          }
        })
      },
      handleStatus (val, id) {
        const isEnabled = val === true ? 0 : 1
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/isEnable'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'status': isEnabled
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
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-table__body-wrapper{
    button{
      width: auto;
      height: 25px;
      line-height: 25px;
      padding: 0;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
</style>
