<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="审核流编号">
            <el-input v-model="dataForm.approveNo" maxlength="30" placeholder="请输入审核流编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模板类型">
            <xkl-select style="width: 100%" v-model="dataForm.module" select-type="AUDIT_MODULE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-form-item>
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template>
      <el-table
        ref="elTable"
        :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
        <el-table-column
          type="index"
          align="center"
          width="60"
          label="No.">
        </el-table-column>
        <el-table-column
          prop="approveNo"
          header-align="center"
          align="center"
          label="审核流编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="模板名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="moduleName"
          align="center"
          label="模板类型"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleExamine(scope.row)"
            >
              <icon-svg name="审核" style="vertical-align: middle"></icon-svg>
              审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
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
    <!--<cost-upload v-if="importVisible" ref="importUpdate" @refreshDataList="getDataList"></cost-upload>-->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          approveNo: '',
          module: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    components: {
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
        this.$http({
          url: this.$http.adornUrl('/sys/auditrecord/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm,
            'approveStatusList': [1]
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
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
      // 多选
      selectionChangeHandle (val) {
        this.selectionDataList = val
      },
      resetForm () {
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      handleExamine (row) {
        let id = row.id;
        let srcPk = row.srcPk;
        this.$router.push({
          path: '/cost-settlement/cost/detail',
          query: {
            id: id,
            srcPk: srcPk
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-table__body-wrapper{
    button{
      width: auto!important;
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
