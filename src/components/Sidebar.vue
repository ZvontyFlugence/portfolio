<template>
  <div class="side-nav">
    <router-link class="side-nav-link" to="/">
      <h1 class="side-nav-name">Z'vonty Flugence</h1>
    </router-link>
    <span>
      Motivated and Determined Sophomore at the University of Pittsburgh. <br/>
      Effective multitasker capable of finding dynamic solutions for software issues. <br />
      Proficient in several programming languages and technologies. <br />
      A quick learner and able to adapt in a fast paced environment.
    </span>
    <el-row class="side-nav-actions">
      <router-link to="experience">
        <el-button style="margin-right: 5px;" round>Experience</el-button>
      </router-link>
      <router-link to="portfolio">
        <el-button round>Portfolio</el-button>
      </router-link>
    </el-row>
    <el-row class="side-nav-social">
      <el-button @click="navigate(linkedInPage)" circle><font-awesome-icon :icon="['fab', 'linkedin']" /></el-button>
      <el-button @click="navigate(githubPage)" circle><font-awesome-icon :icon="['fab', 'github']" /></el-button>
      <a class="side-nav-email" href="mailto:zaf17@pitt.edu">
        <el-button icon="el-icon-message" circle/>
      </a>
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
.side-nav-email {
  margin-left: 10px;
}
.side-nav-link {
  color: white;
  text-decoration: none;
}
</style>

<script>
export default {
  name: 'Sidebar',
  data: () => ({
    linkedInPage: 'https://www.linkedin.com/in/zvonty-flugence/',
    githubPage: 'https://github.com/ZvontyFlugence'
  }),
  methods: {
    navigate: (path) => {
      window.location = path;
    }
  }
}
</script>