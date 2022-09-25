<template>
  <div class="home">
    <!-- 凡是js外使用别名都需加~激活别名 -->
    <div id="demo"></div>
    <img src="~assets/images/bngd.jpg">
    <img :src="images" alt="">
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data(){
    return {
      images:require('assets/images/jiaolv.jpg')
    }
  }
}
</script>

<style scoped>
  img{
    width:200px;
    height: 300px;
  }
  #demo{
    width:200px;
    height: 300px;
    background:url('~assets/images/shijing.jpg')
  }
</style>