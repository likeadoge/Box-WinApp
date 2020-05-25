<template>
  <div id="app-view">
    <e-loading />
    <e-main v-if="loginStatus" />
    <e-login v-else />
  </div>
</template>
<script>
import ELoading from "./view/ELoading";
import ELogin from "./view/ELogin";
import EMain from "./view/EMain"
import {mapGetters} from 'vuex'

export default {
  components: { ELogin,EMain ,ELoading},
  computed:{
    ...mapGetters(['loginStatus'])
  },
  data() {
    return {
      collapsed: false,
      nodeVer: process.version,
    };
  }
};
</script>

<style  lang="scss" scoped>
#app-view{
    height: 100%;
    width: 100%;
    position: relative;
}
</style>