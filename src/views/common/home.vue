<template>
  <div class="mod-home" style="display: none;">
    <el-row :gutter="20">
      <el-col :span="8" class="home-list" style="margin-right: 20px">
        <div class="list-title" @click="handleToDoList()">待办事项</div>
      </el-col>
      <el-col :span="8" class="home-list">
        <div class="list-title" @click="handleDoList()">已办事项</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    methods: {
      handleToDoList () {
        this.$router.push({
          path: '/todoList'
        })
      },
      handleDoList () {
        this.$router.push({
          path: '/doList'
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-home {
    .home-list{
      height: 150px;
      background: #0BB2D4;
      font-size: 24px;
      cursor: pointer;
      color: #fff;
      .list-title{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

