<script setup>
import {ref} from "vue";

let Pageshow = ref(true)
const ApkClick= ()=> {
  Pageshow = true
}
const ListClick = ()=> {
  Pageshow = false
}
</script>

<template>
  <div class="home">
    <el-container class="container">
      <el-header class="head">
          <el-container >
            <el-aside style="text-align: center;padding-top: 10px;height: 100%" >
              <img src="@/img/alby.svg " alt="My SVG"  style="top:5px;position: relative; right:5px;width: calc(1.275rem + .3vw)"/>
              <text class="title">ApkDetector</text>
            </el-aside>
            <el-main>
              <el-row :gutter="20" font-size="calc(1rem + .3vw)">
                <el-col :span="3" ><router-link to="/pages/first" >
                  <el-text color="black" style="font-size: 15px">apk解析</el-text>
                </router-link></el-col>
                <el-col :span="3"><router-link to="/pages/BlackList">
                  <el-text color="black" style="font-size: 15px">黑白名单</el-text>
                </router-link></el-col>
              </el-row>
            </el-main>
          </el-container>
      </el-header>
      <el-main class="outside">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style>

#app{
  padding: 0 0 0 0;
  width: 100vw;
  height: 100%;
  background-size: cover;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<style scoped>
.home{
  width: 99vw;
  height: 1200px;
  position: absolute;
  padding:0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fafafa;
}

.container{
  height: 100%;
  width: 100%;
  padding:0
}
.head{
  height: 70px;
  width: 100%;
  border-color: #e9ecef;
  border-bottom:1px solid #dee2e6;
  margin-bottom: 10px;
  padding-bottom: 5px;
  background-color: white;
}
.outside{
  width: 100%;
  height: auto;
  position: relative;
}

.title{
  text-align: center;
  font-size: calc(1.275rem + .3vw);
  font-weight: 600;
  letter-spacing:-1px;
}
</style>
