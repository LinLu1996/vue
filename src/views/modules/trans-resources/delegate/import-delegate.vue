<template>
  <el-dialog
    title="选择SAVE货主"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="6">
          <el-form-item>
            <el-input v-model="dataForm.type" placeholder="货主名称" clearable  maxlength="20" clearable style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input v-model="dataForm.typeName" placeholder="货主编码" clearable maxlength="16" clearable style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-form-item style="margin-right: 0;">
            <el-button type="warning" icon="el-icon-search" @click="getSearchDataList()">查询</el-button>
            <el-button style="background-color: #30b6aa; color: white" icon="el-icon-circle-plus-outline" @click="importList()">导入</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :header-cell-style="{backgroundColor: '#3698ce', color: '#ffffff', letterSpacing: '2px', fontSize: '16px'}"
      :data="dataList"
      border
      ref="tableList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @sort-change="changeSort"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="65">
      </el-table-column>
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="65">
      </el-table-column>
      <el-table-column
        prop="ownerCode"
        header-align="center"
        align="center"
        width="200"
        label="货主编码">
      </el-table-column>
      <el-table-column
        prop="ownerName"
        header-align="center"
        align="center"
        label="货主名称">
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
   <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>-->
  </el-dialog>
</template>

<script>
  import { toUnderScore, abbreviate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          ownerCode: '',
          ownerName: '',
          list: []
        },
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataList: [],
        dataListLoading: false,
        dataListSelections: [],
        submitFlag: true
      }
    },
    methods: {
      init () {
        this.visible = true
        this.resetForm()
      },
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/transresources/ttrconsignor/consignorList '),
          method: 'post',
          data: this.$http.adornData({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'ownerCode': this.dataForm.ownerCode,
            'ownerName': this.dataForm.ownerName
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
        this.dataListSelections = val.map(res => {
          let json = {
            ownerName: res.ownerName,
            ownerCode: res.ownerCode
          }
          return json
        })
      },
      importList () {
        if (this.submitFlag) {
          this.submitFlag = false
          setTimeout(() => {
            this.submitFlag = true
          }, 2000)
          if (this.dataListSelections.length < 1) {
            this.$message.warning('请至少选择一项')
            return false
          }
          this.$confirm(`是否导入？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/transresources/ttrconsignor/importSave'),
              method: 'post',
              data: this.$http.adornData({
                'page': this.pageIndex,
                'limit': this.pageSize,
                'consignorList': this.dataListSelections
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        if (this.submitFlag) {
          this.submitFlag = false
          setTimeout(() => {
            this.submitFlag = true
          }, 2000)
          if (this.dataListSelections.length < 1) {
            this.$message.warning('请至少选择一项')
            return false
          }
          this.$http({
            url: this.$http.adornUrl('/basic/customer/add'),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id,
              list: this.dataListSelections
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      resetForm () {
        // resetData(this.dataForm)
        this.dataForm = {}
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      getSearchDataList () {
        this.pageIndex = 1;
        this.getDataList();
      },
      changeSort (sortRule) {
        let column = toUnderScore(sortRule.prop)
        if (column === 'type_name') {
          column = 'type'
        }
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
