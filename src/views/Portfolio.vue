<template>
  <div class="portfolio-container">
    <h1 class="portfolio-title">Portfolio</h1>
    <el-row class="portfolio-grid" :gutter="20" >
      <el-col class="hidden-sm-and-down" :span="12" v-for="(project, index) in projects" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix portfolio-card">
            <span>{{ project.name }}</span>
          </div>
          <span>{{ project.desc }}</span>
        </el-card>
      </el-col>
      <el-col class="hidden-md-and-up" :span="24" v-for="(project, index) in projects" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix portfolio-card">
            <span>{{ project.name }}</span>
          </div>
          <span>{{ project.desc }}</span>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.portfolio-container {
  background-color: white;
  height: 100vh;
  padding-left: 2vw;
  padding-right: 2vw;
  overflow: hidden;
}
.portfolio-title {
  color: #303133;
  text-align: center;
}
.portfolio-grid {
  margin: 0 auto;
  padding: 2vh 0 2vh 0;
}
</style>

<script>
export default {
  name: 'Portfolio',
  data() {
    return {
      projects: [
        {
          name: 'State of Turmoil',
          desc: 'State of Turmoil is a browser-based simulated geo-political MMORPG' +
            ' developed using the MERN development stack and the real-time capabilities of Socket.io.' +
            ''
        },
      ],
    }
  },
}
</script>