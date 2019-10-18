<template>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label-width="0">
      <el-tag>基本信息</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="12"  v-if="!editFlag">
        <el-form-item label="承运商：" prop="carrierId">
          <xkl-select style="width: 100%" v-model="dataForm.carrierId" keyType="carrierId" labelType="carrierName" linkage="/transresources/trcarrierarea/carrierList " placeholder="请选择或者输入查找"></xkl-select>
        </el-form-item>
      </el-col>
      <el-col :span="12"  v-if="editFlag">
        <!--<el-form-item label="承运商名称：">
          <el-select class="removeArrow" style="width: 100%" v-model="dataForm.carrierId" filterable clearable placeholder="请选择或者输入查找">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.carrierName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="承运商名称：">
            <span style="width: 100%; display: block">
                {{dataForm.carrierName}}
            </span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" rows="4" maxlength="100"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0">
      <el-tag>承运区域</el-tag>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <div class="shuttle">
          <div class="shuttle_item">
            <span>所有区域</span>
            <ul class="school">
              <el-input placeholder="请输入" v-model="inputVal" size="mini" clearable style="margin-top: 10px">
              </el-input>
              <li v-for="(item,index) in allArea" :key="index">
                <input type="checkbox" :id="item.id" :value="item.id"
                       v-model="schoolsNames"
                       :disabled="teamName.length>0||teamLeader.length>0?true:false"
                >
                <label :for="item.id">{{item.name}}</label>
              </li>
            </ul>
          </div>
          <div class="shuttle_arrow">
            <el-button icon="el-icon-d-arrow-right" type="primary" plain @click="toRightTeam"
                       :disabled="schoolsNames.length==0?true:false">
            </el-button>
            <el-button icon="el-icon-d-arrow-left" type="primary" plain class="go_left"
                       :disabled="teamName.length==0?true:false" @click="toLeftSchools">
            </el-button>
          </div>
          <div class="shuttle_item">
            <span>已选区域</span>
            <ul class="school">
              <li v-for="(item ,index ) in areaList" :key="index">
                <input type="checkbox" :id="item.id" :value="item.id"
                       v-model="teamName"
                       :disabled="schoolsNames.length>0||teamLeader.length>0?true:false"
                >
                <label :for="item.id">{{item.name}}</label>
              </li>
            </ul>
          </div>
          <div class="shuttle_arrow">
            <el-button icon="el-icon-d-arrow-right" type="primary" plain
                       :disabled="teamName.length==0?true:false"
                       @click="toRightLeader"
            >
            </el-button>
            <el-button icon="el-icon-d-arrow-left" type="primary" plain class="go_left"
                       :disabled="teamLeader.length==0?true:false"
                       @click="toLeftTeam"
            >
            </el-button>
          </div>
          <div class="shuttle_item">
            <span>优势区域</span>
            <ul class="school">
              <li v-for="(item,index) in goodArea" :key="index">
                <input type="checkbox" :id="item.id" :value="item.id"
                       v-model="teamLeader"
                       :disabled="schoolsNames.length>0||teamName.length>0?true:false"
                >
                <label :for="item.id">{{item.name}}</label>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;text-align: right">
      <el-col>
        <el-form-item>
          <el-button @click="$router.push({name: 'trans-resources-carrier-area/carrier-area'})">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  /* import { formatDate } from '@/utils'
  import attachmentUpload from '@/components/upload/attachmentUpload'
  import ProductDrawer from '../product/product-drawer' */
  export default {
    data () {
      let verifyChar = (rule, value, callback) => {
        let patrn = /^(\w){0,30}$/;
        if (!patrn.exec(value)) {
          callback(new Error('只能输入字母、数字、下划线'))
        }
        callback()
      }
      return {
        editFlag: false,
        inputVal: '',
        pageIndex: 1,
        visible: false,
        allArea: [],
        allAreaList: [],
        areaList: [],
        goodArea: [],
        schoolsNames: [],
        teamName: [],
        teamLeader: [],
        schoolInfo: '',
        teamInfo: '',
        leaderInfo: '',
        dataForm: {
          id: 0,
          /* carrierCode: '',
          carrierType: '',
          carrierName: '',
          shortName: '', */
          carrierId: '',
          carrierName: '',
          remark: ''
        },
        dataRule: {
          carrierId: [
            { required: true, message: '请填写承运商名称', trigger: 'change' },
            { validator: verifyChar, trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      schoolInfo (val) {   //  编辑时用来回显，添加时的默认数据
        this.schoolInfo = val;
        this.allArea = val;
      },
      teamInfo (val) {   //  编辑时用来回显
        this.teamInfo = val;
        this.areaList = val;
      },
      leaderInfo (val) {   //  编辑时用来回显
        this.leaderInfo = val;
        this.goodArea = val;
      },
      'inputVal' () {
        this.handleSearch()
      }
    },
    activated () {
      const carrierId = this.$route.query.carrierId || null
      if (carrierId && carrierId.trim() !== '') {
        this.editFlag = true;
      } else {
        this.editFlag = false;
      }
      this.init(carrierId)
    },
    methods: {
      handleSearch () {
        const areaList = this.areaList
        const goodArea = this.goodArea
        const otherArea = areaList.concat(goodArea)
        let currentArea = [].concat(this.allAreaList)
        if (otherArea.length > 0) {
          for (let i = 0; i < otherArea.length; i++) {
            const item = otherArea[i]
            for (let j = 0; j < currentArea.length; j++) {
              const item2 = currentArea[j]
              if (item.name === item2.name) {
                currentArea.splice(j, 1)
              }
            }
          }
        }
        this.allArea = [].concat(currentArea)
        if ((this.inputVal).trim()) {
          const searhList = this.allArea.filter(item => item.name.indexOf(this.inputVal) > -1)
          this.allArea = searhList
        } else {
          this.allArea = this.allArea
        }
      },
      init (carrierId) {
        this.clickFlag = true
        if (carrierId && carrierId.trim() !== '') {
          this.dataForm.carrierId = carrierId
        }
        this.dataForm.remark = '';
        this.areaList = [];
        this.goodArea = [];
        this.visible = true
        this.inputVal = ''
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/sysregion/noPowerList'),
            method: 'post',
            data: this.$http.adornData({
              'page': this.pageIndex,
              'limit': 999,
              'status': 0,
              'type': undefined,
              'level': 1
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.allArea = data.page.list;
              this.allAreaList = [].concat(data.page.list);
            } else {
            }
          }).then(() => {
            if (carrierId && carrierId.trim() !== '') {
              this.$http({
                url: this.$http.adornUrl(`/transresources/trcarrierarea/area/${this.dataForm.carrierId}`),
                method: 'get'
              }).then(({data}) => {
                console.log(data);
                if (data && data.code === 0) {
                  if (data.areaList && data.areaList.length > 0) {
                    this.dataForm.remark = data.areaList[0].remark;
                    this.dataForm.carrierName = data.areaList[0].carrierName;
                    data.areaList.forEach((item, index) => {
                      // this.areaList.push(item);
                      if (item.isGoodArea && item.isGoodArea === 1) {
                        this.goodArea.push(item)
                      } else {
                        this.areaList.push(item);
                      }
                    });
                    this.spliceArea()
                  }
                } else {
                }
              })
            }
          })
        })
      },
      spliceArea () {
        const areaList = this.areaList
        const goodArea = this.goodArea
        const otherArea = areaList.concat(goodArea)
        let currentArea = [].concat(this.allAreaList)
        if (otherArea.length > 0) {
          for (let i = 0; i < otherArea.length; i++) {
            const item = otherArea[i]
            for (let j = 0; j < currentArea.length; j++) {
              const item2 = currentArea[j]
              if (item.name === item2.name) {
                currentArea.splice(j, 1)
              }
            }
          }
        }
        this.allArea = [].concat(currentArea)
      },
      async toRightTeam () {
        this.inputVal = ''
        this.handleSearch()
        let moveName = await this.matching(this.allArea, this.schoolsNames)
        let allArr = await this.myFilter(this.allArea, moveName)
        this.allArea = allArr
        for (let i = 0; i < moveName.length; i++) {
          this.areaList.push(moveName[i])
        }
        this.schoolsNames = []
        // await this.putParentsTeams()
      },
      async toLeftSchools () {
        this.inputVal = ''
        this.handleSearch()
        let moveName = await this.matching(this.areaList, this.teamName)
        let allArr = await this.myFilter(this.areaList, moveName)
        this.areaList = allArr
        for (let i = 0; i < moveName.length; i++) {
          this.allArea.push(moveName[i])
        }
        this.teamName = [];
        // await this.putParentsTeams()
      },
      async toRightLeader () {
        let moveName = await this.matching(this.areaList, this.teamName)
        let allArr = await this.myFilter(this.areaList, moveName)
        this.areaList = allArr
        for (let i = 0; i < moveName.length; i++) {
          this.goodArea.push(moveName[i])
        }
        this.teamName = []
        // await this.putParentsTeams()
      },
      async toLeftTeam () {
        let moveName = await this.matching(this.goodArea, this.teamLeader)
        let allArr = await this.myFilter(this.goodArea, moveName)
        this.goodArea = allArr;
        for (let i = 0;  i < moveName.length; i++) {
          this.areaList.push(moveName[i])
        }
        this.teamLeader = [];
        // await this.putParentsTeams()
      },
      // 过滤 相同选项
      async myFilter (allArr, selArr) {
        for (let i = 0; i < allArr.length; i++) {
          for (let j = 0; j < selArr.length; j++) {
            if (allArr[i].id === selArr[j].id) {
              allArr.splice(i, 1)
            }
          }
        }
        return allArr;
      },
      //  匹配 移动的 选项
      async matching (allArr, matchArr) {
        let matArr = [];
        for (let i = 0; i < allArr.length; i++) {
          for (let j = 0; j < matchArr.length; j++) {
            if (allArr[i].id === matchArr[j]) {
              matArr.push(allArr[i])
            }
          }
        }
        return matArr;
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (!this.clickFlag) {
              return;
            }
            console.log(this.areaList);
            console.log(this.goodArea);
            this.clickFlag = false
            // const newRoad = []
            this.$http({
              url: this.$http.adornUrl('/transresources/trcarrierarea/saveArea'),
              method: 'post',
              data: this.$http.adornData({
                ...this.dataForm,
                areaList: this.areaList,
                goodAreaList: this.goodArea
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({name: 'trans-resources-carrier-area/carrier-area'})
                  }
                })
              } else {
                this.clickFlag = true
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/.el-checkbox-button {
    .el-checkbox-button__inner{
      min-width: 280px!important;
      border-color: #ffffff!important;
      padding: 0;
    }
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .box-card{
    /deep/.el-card__header {
      background-color: #3e8ef76b;
    }
  }
  ul li {
    list-style: none;
  }

  .shuttle {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .shuttle_item {
      width: 20%;

      span {
        font-size: 16px;
        margin-left: 50px;
      }
    }

    .shuttle_arrow {
      width: 10%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 10px 0 40px;

      .go_left {
        margin-left: 0;
        margin-top: 15px;
      }
    }

    .school {
      border: 1px solid #c8c9cc;
      padding: 0 10px;
      border-radius: 5px;
      width: 120%;
      height: 300px;
      overflow: auto;
      li {
        padding-top: 10px;
      }
    }
  }
</style>
