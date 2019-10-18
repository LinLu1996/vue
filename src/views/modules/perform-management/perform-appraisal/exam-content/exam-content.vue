<template>
  <div class="examCon-config">
    <el-form :model="dataForm" @keyup.enter.native="getDataList()" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="考核分类">
            <xkl-select style="width: 100%" v-model="dataForm.categoryId" :level="1" labelType="name" linkage="/performancemanagement/tkpiassessmentstandard/selectList" placeholder="考核分类"></xkl-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="考核项目">
            <xkl-select style="width: 100%" v-model="dataForm.projectId" :level="2" :parentId="dataForm.categoryId" labelType="name" :linkage="dataForm.categoryId ? '/performancemanagement/tkpiassessmentstandard/selectList' : ''" placeholder="考核项目"></xkl-select>
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
            <el-button v-if="isAuth('sys:dict:save')" icon="el-icon-circle-plus-outline" @click="addOrUpdateHandle()" size="mini" style="background: #3698ce;color: #ffffff">新增分类</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      v-loading="dataListLoading"
      row-key="id"
      :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="60"
        align="center"
        label="No.">
      </el-table-column>
      <el-table-column
        header-align="center"
        prop="name"
        align="left"
        label="名称"
        width="700"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg>
            编辑</el-button>
          <el-button v-if="scope.row.type === 1" type="primary" size="small" @click="addProject(scope.row)">
            <icon-svg name="编辑" style="vertical-align: middle"></icon-svg></el-button>
          <el-button v-if="scope.row.level === 1" type="primary" icon="el-icon-circle-plus-outline" size="small" @click="addProject(scope.row, 'add')">
            新增项目</el-button>
          <el-button v-if="scope.row.level === 2" icon="el-icon-circle-plus-outline" type="primary" size="small" @click="addIndex(scope.row, 'add')">
            新增指标</el-button>
          <el-button v-if="isAuth('sys:dict:delete')" type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 编辑 -->
    <add-or-update-classify v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update-classify>
    <add-or-update-project v-if="addProjectVisible" ref="addProject" @refreshDataList="getDataList"></add-or-update-project>
    <add-or-update-index v-if="addIndexVisible" ref="addIndex" @refreshDataList="getDataList"></add-or-update-index>
  </div>
</template>

<script>
  import AddOrUpdateClassify from './add-or-update-classify'
  import AddOrUpdateProject from './add-or-update-project'
  import AddOrUpdateIndex from './add-or-update-index'
  export default {
    data () {
      return {
        dataForm: {
          categoryId: '',
          projectId: ''
        },
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        addProjectVisible: false,
        addIndexVisible: false
      }
    },
    components: {
      AddOrUpdateClassify,
      AddOrUpdateProject,
      AddOrUpdateIndex
    },
    activated () {
      this.resetForm()
    },
    watch: {
      'dataForm.categoryId' (newVal, oldVal) {
        if (oldVal) {
          this.dataForm.projectId = ''
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
          url: this.$http.adornUrl('/performancemanagement/tkpiassessmentstandard/list'),
          method: 'post',
          data: this.$http.adornData({
            'categoryId': this.dataForm.categoryId,
            'projectId': this.dataForm.projectId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 编辑
      addOrUpdateHandle (id, type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, type)
        })
      },
      // 新增 编辑项目
      addProject (row, type) {
        this.addProjectVisible = true
        this.$nextTick(() => {
          this.$refs.addProject.init(row, type)
        })
      },
      // 新增 编辑指标
      addIndex (row, type) {
        this.addIndexVisible = true
        this.$nextTick(() => {
          this.$refs.addIndex.init(row, type)
        })
      },
      // 编辑
      handleEdit (row) {
        if (row.level === 1) {
          this.addOrUpdateHandle(row.id)
        } else if (row.level === 2) {
          this.addProject(row, 'edit')
        } else {
          this.addIndex(row, 'edit')
        }
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('确定删除这条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/performancemanagement/tkpiassessmentstandard/delete'),
            method: 'post',
            data: this.$http.adornData({
              'id': id
            })
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
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      }
    }
  }
</script>
<style lang="scss">

</style>
