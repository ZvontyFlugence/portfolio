<template>
  <div class="image-container">
    <img class="image hidden-sm-and-down" :src="`${base}headshot.jpg`" />
    <img class="mobile-image hidden-md-and-up" :src="`${base}headshot.jpg`" />
  </div>
</template>

<style scoped>
.image-container {
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.image {
  width: 50vw;
  object-fit: scale-down;
  overflow: hidden;
}
.mobile-image {
  width: 100vw;
}
</style>

<script>
export default {
  name: 'Index',
  data: () => ({
    base: process.env.BASE_URL || 'http://localhost:8080/'
  })
}
</script>