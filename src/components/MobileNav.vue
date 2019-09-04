<template>
  <div class="mobile-nav">
    <el-row>
      <el-col :span="22">
        <router-link class="mobile-nav-link" to="/">
          <h2 class="mobile-nav-name">Z'vonty Flugence </h2>
        </router-link>
      </el-col>
      <el-col :span="2">
        <h2>
          <el-button class="mobile-nav-bars" type="text" @click="drawer = true">
            <font-awesome-icon :icon="['fas', 'bars' ]" />
          </el-button>
        </h2>
      </el-col>
    </el-row>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="75%"
    >
      <div class="drawer-content">
        <el-row>
          <router-link to="experience">
            <el-button type="text">Experience</el-button>
          </router-link>
        </el-row>
        <el-row>
          <router-link to="portfolio">
            <el-button type="text">Portfolio</el-button>
          </router-link>
        </el-row>
        <el-divider />
        <el-row>
          <el-button @click="navigate(linkedInPage)" type="text">LinkedIn</el-button>
        </el-row>
        <el-row>
          <el-button @click="navigate(githubPage)" type="text">Github</el-button>
        </el-row>
        <el-row>
          <a href="mailto:zaf17@pitt.edu">
            <el-button type="text">Email</el-button>
          </a>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.mobile-nav {
  background-color: #409EFF;
  color: white;
  width: 100vw;
  overflow: hidden;
  margin: 0 auto;
}
.mobile-nav-name {
  padding-left: 2vh;
}
.mobile-nav-bars {
  color: white;
  margin-top: -5vh;
}
.mobile-nav-link {
  color: white;
  text-decoration: none;
}
.drawer-content {
  text-align: center;
}
</style>

<script>
export default {
  name: 'MobileNav',
  data: () => ({
    drawer: false,
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