<template>
  <div class="loading" v-show="globeLoading.status" @click="e=>changeSpinning()">
    <a-spin :size="'large'" :spinning="globeLoading.status" :delay="delayTime" :tip="globeLoading.text"></a-spin>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "ELoading",
  data() {
    return {
      spinning: false,
      delayTime: 500
    };
  },
  mounted(){
      console.log(this.globeLoading)
  },
  computed:{
      ...mapGetters(['globeLoading'])
  },
  methods: {
    changeSpinning() {
      this.spinning = !this.spinning;
    }
  }
};
</script>

<style scope>
.loading {
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 100;
}
</style>