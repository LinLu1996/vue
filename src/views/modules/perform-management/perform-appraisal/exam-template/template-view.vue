<template>
  <div class="table-wrap">
    <h2>承运商考核表(市外公路)</h2>
    <p>
      <span>承运商名称：点通</span>
      <span>2019年9月</span>
    </p>
    <el-table
      :data="tableData"
      show-summary
      :summary-method="getSummaries"
      :span-method="objectSpanMethod"
      @row-dblclick="rowChange"
      style="width: 100%"
      align="center">
      <el-table-column
        prop="assessmentClassificationName"
        align="center"
        label="分类"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="assessmentProjectName"
        align="center"
        label="考核项目"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="考核标准">
        <el-table-column
          prop="assessmentStandardName"
          header-align="center"
          label="项目说明">
        </el-table-column>
        <el-table-column
          prop="num"
          align="center"
          label="发生次数"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="!row.seen">
              {{ row.accurTimes || 0 }}
            </span>
            <el-input
              v-else
              v-model="row.accurTimes"
              size="mini"
              @change="getScore(row)"
              @keyup.enter.native="row.seen = false">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="sum"
          align="center"
          label="汇总"
          width="80"
          show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="!row.seen">
              {{ row.sum || 0}}
            </span>
            <el-input
              v-else
              v-model="row.sum"
              @change="getScore(row)"
              size="mini"
              @keyup.enter.native="row.seen = false">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="percentStandard"
          align="center"
          label="百分比标准"
          width="100"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="standard"
          align="center"
          label="实际百分比"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ realPercent(row) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="weightScore"
        align="center"
        label="权重分"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="score"
        align="center"
        label="得分"
        width="100"
        show-overflow-tooltip>
        <!--<template slot-scope="{ row }">-->
          <!--{{ realScore }}-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        prop="remarks"
        align="center"
        label="备注"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
            <span v-if="!row.seen">
              {{ row.num }}
            </span>
          <el-input
            v-else
            v-model="row.num"
            size="mini"
            @keyup.enter.native="row.seen = false">
          </el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-form style="margin-top: 20px">
      <el-form-item label-width="50px">
        <el-button type="primary" size="small" plain icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    templateData: {
      type: Array
    }
  },
  data () {
    return {
      tableData: [],
      initialData: [],
      spanArr: [],
      position: 0,
      currenTypeId: '',
      chooseMap: [],
      clickDisabled: false
    }
  },
  watch: {
    '$route' () {
      if (this.$route.name === 'template-view') {
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  created () {
    this.init()
  },
  computed: {
    realPercent () {
      return function (row) {
        let last = (row.sum - row.accurTimes) / row.sum || 0
        return (last * 100).toFixed(2) > 0  ?  (last * 100).toFixed(2) + '%' : '0.00%'
      }
    }
  },
  methods: {
    init () {
      if (this.$route.name === 'template-view') {
        this.clickDisabled = true
      }
      this.tableData = []
      this.initialData = []
      if (JSON.stringify(this.$route.params) === '{}') {
        this.$router.go(-1)
      } else {
        this.initialData = this.templateData || this.$route.params
        this.changeData()
      }
      let projectIds = [];
      const map = new Map();
      this.tableData.map(item => {
        map.set(item.assessmentProject, item)
      });
      for (let key of map.keys()) {
        projectIds.push(key)
      }
      projectIds.map(item => {
        let project = [];
        let id = item;
        this.tableData.map(item => {
          if (item.assessmentProject === id) {
            project.push(item)
          }
        });
        let weightScore = 0
        project.map(item => {
          weightScore += Number(item.weightScore)
        });
        this.tableData.map(item => {
          if (item.assessmentProject === id) {
            item.weightScore = weightScore
          }
        });
      })
    },
    changeData () {
      this.initialData.map(res => {
        res.relationEntityList.map(resExam => {
          resExam.assessmentClassificationName = res.assessmentClassificationName
          resExam.assessmentClassification = res.assessmentClassification
          resExam.assessmentProjectName = res.assessmentProjectName
          resExam.assessmentProject = res.assessmentProject
          resExam.realScore = resExam.weightScore
          this.getScore(resExam)
          this.tableData.push(resExam)
        })
        return res
      })
      this.tableData.sort(this.sortData)
      this.rowspan(0, 'assessmentClassification')
      this.rowspan(1, 'assessmentProject')
      // this.rowspan(7, 'weightScore')
      this.rowspan(8, 'score')
    },
    sortData (a, b) {
      return a.assessmentClassification > b.assessmentClassification ? 1 : -1
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      switch (columnIndex) {
        case 0:
          const _row0 = this.spanArr[0][rowIndex];
          return {
            rowspan: _row0,
            colspan: _row0 > 0 ? 1 : 0
          }
        case 1:
          const _row1 = this.spanArr[1][rowIndex];
          return {
            rowspan: _row1,
            colspan: _row1 > 0 ? 1 : 0
          }
        // case 7:
        //   const _row7 = this.spanArr[7][rowIndex];
        //   return {
        //     rowspan: _row7,
        //     colspan: _row7 > 0 ? 1 : 0
        //   }
        case 8:
          const _row8 = this.spanArr[8][rowIndex];
          return {
            rowspan: _row8,
            colspan: _row8 > 0 ? 1 : 0
          }
      }
    },
    rowspan (idx, prop) {
      this.spanArr[idx] = [];
      this.position = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr[idx].push(1);
          this.position = 0;
        } else {
          if (prop === 'assessmentClassification') {
            if (this.tableData[index][prop] === this.tableData[index - 1][prop]) {
              this.spanArr[idx][this.position] += 1;
              this.spanArr[idx].push(0);
            } else {
              this.spanArr[idx].push(1);
              this.position = index;
            }
          } else {
            if (this.tableData[index]['assessmentProject'] === this.tableData[index - 1]['assessmentProject'] && this.tableData[index][prop] === this.tableData[index - 1][prop]) {
              this.spanArr[idx][this.position] += 1;
              this.spanArr[idx].push(0);
            } else {
              this.spanArr[idx].push(1);
              this.position = index;
            }
          }
        }
      })
    },
    rowChange (row, column, cell, event) {
      if (this.clickDisabled) {
        return false
      }
      this.$set(row, 'seen', true)
      this.getScore(row)
    },
    getScore (row) {
      if (row.percentStandard > this.realPercent(row)) {
        this.$set(row, 'realScore', 0)
      } else {
        this.$set(row, 'realScore', row.weightScore)
      }
      this.$nextTick(() => {
        let realScore = []
        this.tableData.map(res => {
          if (res.assessmentClassification === row.assessmentClassification && res.assessmentProject === row.assessmentProject) {
            realScore.push(parseInt(res.realScore))
          }
        })
        let s = 0;
        realScore.forEach(function (val, idx, arr) {
          s += val;
        }, 0);
        this.tableData = this.tableData.map(res => {
          if (res.assessmentClassification === row.assessmentClassification && res.assessmentProject === row.assessmentProject) {
            res.score = s
          }
          return res
        })
        this.$forceUpdate()
      })
    },
    getSummaries (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '得分';
          return;
        }
        if (index === 8) {
          const map = new Map();
          data.map(item => {
            map.set(item.assessmentProject, item.score)
          })
          let total = 0;
          for (let value of map.values()) {
            total += value;
          }
          sums[index] = total;
        }
      });
      return sums;
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrap{
  h2{
    text-align: center;
    letter-spacing: 5px;
  }
  p{
    letter-spacing: 5px;
    span:nth-child(1) {
      margin-left: 10px;
    }
    span:nth-child(2) {
      float: right;
      margin-right: 20px;
    }
  }
  /deep/.el-table__body tr:hover>td{
    background-color: #ffffff!important;
  }
}
</style>
