<template>
  <div class="mod-config">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="代码">
            <el-input v-model="dataForm.carrierCode" maxlength="50" placeholder="代码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="名称">
            <el-input v-model="dataForm.carrierName" maxlength="33" placeholder="名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="简称">
            <el-input v-model="dataForm.shortName" maxlength="16" placeholder="简称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <xkl-select style="width: 100%" v-model="dataForm.type" select-type="CARRIER_TYPE" placeholder="请选择"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="质量审计结果" prop="qualityAuditResult">
            <el-select v-model="dataForm.qualityAuditResult" style="width: 100%;" :clearable="true">
              <el-option key="0" label="通过" :value="0">
              </el-option>
              <el-option key="1" label="不通过" :value="1">
              </el-option>
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
            <el-button
              @click="handleStatus"
              :disabled = "selected.length==0" size="mini"
              style="background: rgb(245, 93, 84);color: #ffffff">启用</el-button>
            <el-button
              @click="handleStatus"
              :disabled = "selected.length==0" size="mini"
              style="background: rgb(245, 93, 84);color: #ffffff">禁用</el-button>
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
      @row-dblclick="dbAddDetailHandle"
      @select="selectCheck"
      @selection-change="tableSelectionChange"
      style="width: 100%;">
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
        prop="carrierCode"
        header-align="center"
        align="center"
        width="120"
        label="代码"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carrierName"
        header-align="center"
        align="center"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="shortName"
        header-align="center"
        align="center"
        label="简称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="carsNumber"
        header-align="center"
        align="center"
        width="100"
        label="车辆数">
        <template slot-scope="scope">
          <a @click="$router.push({ path: '/trans-resources-car/car', query: { id: scope.row.id} })" href="javascript:;">{{scope.row.carsNumber}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="driversNumber"
        header-align="center"
        align="center"
        width="100"
        label="司机数">
        <template slot-scope="scope">
          <a @click="$router.push({ path: '/trans-resources-driver/driver', query: { id: scope.row.id} })" href="javascript:;">{{scope.row.driversNumber}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="qualityAuditResult"
        header-align="center"
        align="center"
        width="100"
        label="审计结果">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.qualityAuditResult === 0" size="small">通过</el-tag>
          <el-tag v-else size="small" type="danger">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isEnabled"
        header-align="center"
        align="center"
        width="100"
        label="状态">
        <template slot-scope="scope">
          <label class="el-form-item__label" v-if="scope.row.isEnabled== 1">有效</label>
          <label class="el-form-item__label" v-if="scope.row.isEnabled== 0">无效</label>
         <!-- <el-switch
            @change="(val) => handleStatus(val, scope.row.id)"
            v-model="scope.row.isEnabled"
            active-color="#13ce66">
          </el-switch>-->
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.id)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑
          </el-button>
          <el-button type="warning" size="mini" @click="addDetailHandle(scope.row.id)">
            <icon-svg name="详情" style="vertical-align: middle"></icon-svg>
            详情</el-button>
<!--          <el-button v-if="isAuth('sys:config:delete')" size="mini" type="success" @click="handleRoad(scope.row.id)">-->
<!--            <icon-svg name="承运线路" style="vertical-align: middle"></icon-svg>-->
<!--            承运线路</el-button>-->
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
    <carrier-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></carrier-add-or-update>
    <carrier-detail v-if="addDetailVisible" ref="detailUpdate" @refreshDataList="getDataList"></carrier-detail>
    <carrier-road v-if="roadVisible" ref="roadUpdate" @refreshDataList="getDataList"></carrier-road>
  </div>
</template>

<script>
  import CarrierAddOrUpdate from './carrier-add-or-update'
  import CarrierDetail from './carrier-detail'
  import CarrierRoad from './carrier-road'
  export default {
    data () {
      return {
        dataForm: {
          carrierCode: '',
          carrierName: '',
          shortName: '',
          type: '',
          qualityAuditResult: ''
        },
        openIsDisabled: true,
        closeIsDisabled: true,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        selectIndex: [], // table勾选存放数据
        selected: [],
        addOrUpdateVisible: false,
        addDetailVisible: false,
        roadVisible: false,
        status: 1
      }
    },
    components: {
      CarrierAddOrUpdate,
      CarrierDetail,
      CarrierRoad
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
          url: this.$http.adornUrl('/transresources/trcarrier/list'),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            ...this.dataForm
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list.length > 0 ? data.page.list.map(item => {
              item.isEnabled === 0 ? item.isEnabled = true : item.isEnabled = false
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
        // eslint-disable-next-line no-undef,eqeqeq
        if (selection.length != 0) {
          // eslint-disable-next-line no-undef
          for (let i = 0; i < selection.length; i++) {
            // eslint-disable-next-line no-undef
            this.selectIndex[i] = selection[i].id
          }
        } else {
          this.selectIndex = [];
        }
      },
      // 选中触发
      selectCheck (selection, row) {
        for (let i = 0; i < this.selectIndex.length + 1; i++) {
          if (this.selectIndex.length < selection.length) {
            this.selectIndex[this.selectIndex.length] = row.id;
            break;
          } else if (this.selectIndex.length > selection.length) {
            // eslint-disable-next-line eqeqeq
            if (this.selectIndex[i] == row.id) {
              this.selectIndex.splice(i, 1);
              break;
            }
          }
        }
      },
      tableSelectionChange (val) {
        this.selected = val;
      },
      // 编辑状态
      handleStatus (val, id) {
        const isEnabled = val === true ? 0 : 1
        this.$http({
          url: this.$http.adornUrl('/transresources/trcarrier/updateIsEnabledById'),
          method: 'post',
          data: this.$http.adornData({
            'id': id,
            'carrierName': this.dataForm.carrierName,
            'isEnabled': isEnabled
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data)
            this.isEnabled = !isEnabled
          } else {
            this.$message.error(data.msg)
          }
          this.getDataList()
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id) {
        // this.addOrUpdateVisible = true
        this.$router.push({
          path: '/carrierAdd',
          query: {
            id: id
          }
        })
      },
      // 详情
      addDetailHandle (id) {
        this.addDetailVisible = true
        this.$nextTick(() => {
          this.$refs.detailUpdate.init(id)
        })
      },
      // 双击table行显示详情
      dbAddDetailHandle (row) {
        this.addDetailVisible = true
        this.$nextTick(() => {
          this.$refs.detailUpdate.init(row.id)
        })
      },
      // 承运线路
      handleRoad (id) {
        this.$router.push({
          path: '/carrierRoad',
          query: {
            id: id
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
      width: auto!important;
      height: 25px;
      line-height: 25px;
      padding: 0 4px;
      text-align: center;
      background: none;
      color: #3E8EF7;
      border: none;
    }
  }
  /deep/.el-form-item__label{
    font-family: Roboto;
    font-weight: 400;
    font-size: 12px;
    color: rgb(16, 142, 233);
    font-style: normal;
    letter-spacing: 0px;
    line-height: 17px;
    text-decoration: none;
    float: none;
    padding: 0;
  }
</style>
