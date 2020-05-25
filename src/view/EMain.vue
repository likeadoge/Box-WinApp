<template>
  <a-layout id="main">
    <a-layout-header class="header">
      <div
        class="logo"
      >欢迎进入综合办公平台 - 交换中心</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :selectedKeys="[]"
        :style="{ lineHeight: '64px' ,float:'right'}"
      >
        <a-menu-item key="1" @click="logout">
          <a-icon type="logout" />退出
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout style="padding: 24px 24px">
        <!-- <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>-->
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px',overflow:'auto' }"
        >
        <!-- Node Version: {{nodeVer}} -->
          <file-list></file-list>
        
        
        
        
        
        
        
        
        
        
        
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import { mapActions } from "vuex";
import FileList from './FileList'

export default {
  components:{FileList},
  data() {
    return {
      collapsed: false,
      nodeVer: process.version
    };
  },
  methods: {
    ...mapActions(["Logout"]),
    logout() {
      this.$confirm({
        title: "提示",
        content: "真的要注销登录吗 ?",
        onOk: () => this.Logout()
      });
    }
  }
};
</script>

<style  lang="scss" scoped>
#main {
  height: 100%;
  .logo {
    line-height: 64px;
    float: left;
    color: rgba(255, 255, 255,0.95);
    font-size: 16px;
    margin-left: -24px;
    font-weight: bolder;
    text-shadow: 0 2px 3px rgba(255, 255, 255, 0.4);
  }
}
</style>