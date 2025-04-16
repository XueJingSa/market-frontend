<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'NavHeader',
  data() {
    return {
      activeMenu: '1'
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/home')
      this.activeMenu = '1'
    },
    goToCart() {
      this.$router.push('/cart')
      this.activeMenu = '2'
    },
    goToProfile() {
      this.$router.push('/profile')
      this.activeMenu = '3'
    }
  }
}
</script>

<style scoped>
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}

.logo-title {
  font-size: 20px;
  color: #ffffff;
  margin: 0;
}

.nav-menu {
  /* 文本右对齐 */
  text-align: right;
}
</style>
