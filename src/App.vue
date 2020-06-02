<template>
  <div id="app" class="app-content">
      <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "app",
    created() {
      if (localStorage.flowToken) {
        // const decode = jwt_decode(localStorage.flowToken);
        // this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));
        // this.$store.dispatch("setUser", decode);
      }
    },
  };

</script>

<style>
    .app-content{
        min-height: 100%;
        height: 100%;
    }
</style>
