<template>
  <el-container class="dashboard">
    <el-header class="header shadow" style="margin-bottom: -3px;">
      <div class="logo-title">
        <img src="@/assets/1.png" alt="Logo" class="logo-img">
        <h2 style="font-size: 20px; margin-right: 22px;">小型超市在线售卖系统</h2>
        
        <el-menu
          mode="horizontal"
          :ellipsis="false"
          :default-active="activeMenu"
        >
          <el-menu-item index="1" @click="goToHomePage">
            <svg style="margin-right: 8px;" t="1744981842328" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1563" width="20" height="20"><path d="M830.597478 917.26848V376.6272l-318.55104-258.23744L193.413478 376.6272v540.64128h144.1792v-292.87424a40.47872 40.47872 0 0 1 40.57088-40.56576h267.76064a40.52992 40.52992 0 0 1 40.57088 40.56576v292.87424h144.1024z m-411.86304 0h186.624v-252.3136h-186.624v252.3136zM1008.942438 416.8704c17.44896 14.11584 20.1216 39.67488 6.00576 57.0368a40.30976 40.30976 0 0 1-31.48288 15.00672c-9.088 0-18.09408-2.9184-25.55904-9.088l-46.16704-37.4016v515.41504a40.58112 40.58112 0 0 1-40.57088 40.56576H152.842598a40.58112 40.58112 0 0 1-40.57088-40.56576V442.4192l-46.16704 37.4016c-17.2032 14.03904-43.008 11.52-57.04192-5.91872-14.11584-17.36192-11.4432-42.92096 6.00576-57.0368l471.5008-382.19776a40.448 40.448 0 0 1 51.03616 0l471.33696 382.19776z m-392.36608 58.3168a40.58112 40.58112 0 0 1-40.56576-40.56576 40.58112 40.58112 0 0 1 40.56576-40.56576h90.22976c22.4768 0 40.57088 18.176 40.57088 40.56576a40.52992 40.52992 0 0 1-40.57088 40.56576h-90.22976z" fill="#000000" p-id="1564"></path></svg>
            <h3>首页</h3>
          </el-menu-item>
          <el-menu-item index="2" @click="goToCartPage">
            <svg style="margin-right: 8px;" t="1744981926834" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2776" width="21" height="21"><path d="M919.68 704H292.48l-160-576H28.8V64h152.32l160 576h525.12l52.16-288H412.8V288h582.4l-75.52 416zM380.8 960a96 96 0 1 1 96-96 96 96 0 0 1-96 96z m0-128a32 32 0 1 0 32 32 32 32 0 0 0-32-32zM796.8 960a96 96 0 1 1 96-96 96 96 0 0 1-96 96z m0-128a32 32 0 1 0 32 32 32 32 0 0 0-32-32z" fill="#000000" p-id="2777"></path><path d="M476.8 416h64v160h-64zM668.8 416h64v160h-64z" fill="#000000" p-id="2778"></path></svg>
            <h3>购物车</h3>
          </el-menu-item>
          <el-menu-item index="3" @click="goToProfilePage">
            <svg style="margin-right: 8px;" t="1744981960285" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3981" width="21" height="21"><path d="M662.62186 561.268406c68.523788-46.884193 113.609197-126.232559 113.609197-216.401253 0-146.068057-119.020424-265.088481-265.088481-265.088481-146.072307 0-263.289697 119.020424-263.289697 263.284384 0 90.169757 45.08541 169.51706 113.61026 216.401253C206.375662 620.778086 98.177692 770.454336 98.177692 945.37731l0 0 73.936077 0 0 0c0-173.118878 131.641661-317.383901 299.353562-337.221524 1.804096 0 46.885256-3.60713 84.755343 0l3.60713 0 0 0c164.104771 23.441566 290.33733 164.101583 290.33733 335.417427l0 0 75.739111 0 0 0C924.101085 770.454336 815.903115 620.778086 662.62186 561.268406L662.62186 561.268406zM511.142576 541.431845c-110.006317 0-198.367727-88.363535-198.367727-198.36879 0-110.002067 88.362473-198.363477 198.367727-198.363477 110.001004 0 198.363477 88.36141 198.363477 198.363477C709.506053 453.069373 621.14358 541.431845 511.142576 541.431845L511.142576 541.431845zM511.142576 541.431845" fill="#000000" p-id="3982"></path></svg>
            <h3>个人中心</h3>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="search-container">
  <el-input
    v-model="searchQuery"
    placeholder="搜索商品关键词"
    class="elegant-search"
    clearable
    @keyup.enter="handleSearch"
  >
    <template #prefix>
      <el-icon class="search-icon"><Search /></el-icon>
    </template>
    <template #suffix>
      <el-button
        type="primary"
        @click="handleSearch"
        class="search-btn"
        :disabled="!searchQuery.trim()"
        :icon="Search"
      >搜索
    </el-button>
    </template>
  </el-input>
</div>

      <el-button  @click="logIn" type="primary" style="width: 52px; height: 52px;" circle>
          未登录
          </el-button>
    </el-header>

    <router-view></router-view>
  </el-container>
</template>

<script>
import { Search, } from '@element-plus/icons-vue'

export default {
  name: 'Dash-board',
  components: {
    Search,
    
  },
  data() {
    return {
      showSearchPanel: false,
      searchQuery: '',
      categoryFilter: null,
      priceSort: null,
      stockFilter: null,
      categories: [
        { id: 1, name: "新鲜果蔬" },
        { id: 2, name: "肉禽蛋类" },
        { id: 3, name: "海鲜水产" },
        { id: 4, name: "乳品烘焙" },
        { id: 5, name: "熟食即食" },
        { id: 6, name: "冷冻食品" },
        { id: 7, name: "酒水饮料" },
        { id: 8, name: "休闲零食" },
        { id: 9, name: "粮油调味" },
        { id: 10, name: "日化家居" }
      ]
    }
  },
  computed: {
    activeMenu() {
      const currentPath = this.$route.path;
      if (currentPath === '/home') return '1';
      if (currentPath === '/cart') return '2';
      if (currentPath === '/profile') return '3';
      return '1';
    }
  },
  methods: {
    goToHomePage() {
      this.$router.push("/");
    },
    goToCartPage() {
      this.$router.push("/cart");
    },
    goToProfilePage() {
      this.$router.push("/profile");
    },
    toggleSearchPanel() {
      this.showSearchPanel = !this.showSearchPanel;
    },
    handleSearch() {
      const keyword = this.searchQuery.trim()
      if (keyword) {
        this.$router.push({
          name: 'SearchResults',
          query: { q: keyword }
        })
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-img {
  width: 35px;
  height: 35px;
}

.search-container {
  margin-right: 20px;
}

.filter-panel {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.search-btn-container {
  margin-top: 15px;
  text-align: center;
}

.el-input__suffix {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.shadow {
  box-shadow: 0 4px 8px rgba(122, 119, 119, 0.555);
}

.el-menu-item {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
.elegant-search {
  transition: all 0.3s ease;
  border-radius: 24px;
}

.elegant-search:hover {
  box-shadow: 0 2px 8px rgba(100, 100, 100, 0.1);
}

.elegant-search :deep(.el-input__wrapper) {
  border-radius: 24px;
  padding: 0 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

.elegant-search :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 12px rgba(32, 160, 255, 0.2);
  border-color: #409eff;
}

.search-icon {
  color: #909399;
  font-size: 16px;
  margin-left: 8px;
}

.filter-panel {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h4 {
  color: #303133;
  font-size: 16px;
  margin: 0;
}

.close-btn {
  cursor: pointer;
  padding: 4px;
  color: #909399;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #409eff;
}

.filter-row {
  margin-bottom: 20px;
}

.filter-select {
  width: 100%;
}

.filter-select :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.action-btns {
  text-align: right;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.search-container {
  padding: 16px;
  text-align: center;
}

.elegant-search {
  width: 500px;
  transition: 0.3s;
}

.elegant-search .el-input__wrapper {
  padding: 0 16px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.elegant-search .el-input__wrapper:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.elegant-search .el-input__wrapper.is-focus {
  box-shadow: 0 2px 12px rgba(63, 136, 248, 0.2);
}

.search-icon {
  color: #666;
  margin-right: 8px;
}

.search-btn {
  margin-left: 8px;
  border-radius: 20px;
  padding: 8px 20px;
  background: #3f88f8;
  transition: 0.3s;
}

.search-btn:hover {
  background: #2c6fd6;
  transform: scale(1.05);
}

.search-btn:disabled {
  background: #eee;
  color: #999;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .elegant-search {
    width: 100%;
  }
  
  .elegant-search .el-input__wrapper {
    border-radius: 20px;
  }
  
  .search-btn {
    padding: 6px 16px;
  }
}
</style>