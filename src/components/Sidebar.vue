<template>
  <div class="side-nav">
    <h1 class="side-nav-name">Z'vonty Flugence</h1>
    <span>
      Motivated and Determined Sophomore at the University of Pittsburgh. <br/>
      Effective multitasker capable of finding dynamic solutions for software issues. <br />
      Proficient in several programming languages and technologies. <br />
      A quick learner and able to adapt in a fast paced environment.
    </span>
    <el-row class="side-nav-actions">
      <el-button round>Experience</el-button>
      <el-button round>Portfolio</el-button>
    </el-row>
    <el-row class="side-nav-social">
      <el-button circle><font-awesome-icon :icon="['fab', 'linkedin']" /></el-button>
      <el-button circle><font-awesome-icon :icon="['fab', 'github']" /></el-button>
      <el-button icon="el-icon-message" circle/>
    </el-row>
  </div>
</template>

<style scoped>
.side-nav {
  background-color: #409EFF;
  color: white;
  width: 50vw;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  text-align: center;
}
.side-nav-name {
  margin-top: 20vh;
}
.side-nav-actions, .side-nav-social {
  margin-top: 5vh;
}
</style>

<script>
export default {
  name: 'Sidebar'
}
</script>