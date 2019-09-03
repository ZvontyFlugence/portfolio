<template>
  <div class="site-container">
    <div class="hidden-sm-and-down">
      <el-col :span="12">
        <Sidebar />
      </el-col>
      <el-col :span="12">
        <router-view></router-view>
      </el-col>
    </div>
    <div class="hidden-md-and-up">
      <el-row>
        <MobileNav />
        <router-view></router-view>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.site-container {
  background-color: #409EFF;
  height: 100vh;
  width: 100vw;
  padding: 0;
  overflow: hidden;
}
</style>

<script>
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
export default {
  name: 'App',
  components: {
    MobileNav,
    Sidebar
  },
  data: () => ({
    //
  }),
};
</script>
