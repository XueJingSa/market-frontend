<template>
    <el-container class="dashboard">
      <el-header class="header shadow" style="margin-bottom: -3px;">
        <div class="logo-title">
          <img src="@/assets/1.png" alt="Logo" class="logo-img">
          <h2 style="font-size: 20px; margin-right: 22px;">超市管理员界面</h2>
          
          <el-menu
            mode="horizontal"
            :ellipsis="false"
            :default-active="activeMenu"
          >
            <el-menu-item index="1" @click="goToHomePage">
                <svg style="margin-right: 8px;" t="1747569512030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3176" width="22" height="22"><path d="M969.728 877.568L915.968 361.984c-7.68-44.544-46.592-76.8-91.648-76.8h-136.192V221.184c0-98.304-79.872-178.688-178.688-178.688-97.792 0-178.176 80.384-178.176 178.688v64H195.584c-45.568 0-83.968 32.256-92.16 79.36L50.176 875.008c-4.608 27.136 2.56 54.784 20.48 76.288 17.92 20.992 43.52 33.28 71.168 33.28h735.744c27.648 0 53.76-12.288 71.168-33.28 17.92-21.504 25.6-49.152 20.992-73.728zM399.872 221.184c0-60.928 49.664-110.08 110.08-110.08 60.928 0 110.08 49.664 110.08 110.08v64h-220.16V221.184z m497.152 686.08c-2.56 3.584-9.216 8.704-18.944 8.704H141.824c-10.24 0-16.384-5.632-18.944-8.704-2.56-3.584-7.168-10.24-5.12-22.528L171.008 373.76c2.048-11.776 12.288-20.48 24.576-20.48H824.32c12.288 0 22.528 8.704 24.064 18.432l53.76 515.584c2.048 9.728-2.56 16.384-5.12 19.968zM413.696 476.672c0 26.624-21.504 48.128-48.128 48.128S317.44 503.296 317.44 476.672s21.504-48.128 48.128-48.128 48.128 21.504 48.128 48.128z m288.768 0c0 26.624-21.504 48.128-48.128 48.128s-48.128-21.504-48.128-48.128 21.504-48.128 48.128-48.128 48.128 21.504 48.128 48.128z" p-id="3177" fill="#000000"></path></svg>
              <h3>商品管理</h3>
            </el-menu-item>
            <el-menu-item index="2" @click="goToCartPage">
              <svg style="margin-right: 8px;" t="1747569561027" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4439" width="22" height="22"><path d="M800.037628 928.016126 223.962372 928.016126c-52.980346 0-95.983874-43.003528-95.983874-95.983874l0-639.892491c0-52.980346 43.003528-95.983874 95.983874-95.983874l575.903242 0c52.980346 0 95.983874 43.003528 95.983874 95.983874l0 639.892491C896.021502 884.840585 852.84596 928.016126 800.037628 928.016126zM223.962372 159.973123c-17.545439 0-31.994625 14.449185-31.994625 31.994625l0 639.892491c0 17.717453 14.449185 31.994625 31.994625 31.994625l575.903242 0c17.717453 0 31.994625-14.277171 31.994625-31.994625l0-639.892491c0-17.545439-14.277171-31.994625-31.994625-31.994625L223.962372 159.973123z" fill="#575B66" p-id="4440"></path><path d="M640.924576 544.768688 287.779607 544.768688c-17.717453 0-31.994625-14.277171-31.994625-31.994625 0-17.717453 14.277171-31.994625 31.994625-31.994625l353.144969 0c17.717453 0 31.994625 14.277171 31.994625 31.994625C672.9192 530.491517 658.642029 544.768688 640.924576 544.768688z" fill="#575B66" p-id="4441"></path><path d="M734.84428 735.532337l-447.236687 0c-17.717453 0-31.994625-14.277171-31.994625-31.994625s14.277171-31.994625 31.994625-31.994625l447.236687 0c17.717453 0 31.994625 14.277171 31.994625 31.994625S752.561734 735.532337 734.84428 735.532337z" fill="#575B66" p-id="4442"></path><path d="M255.784982 305.325046c0 26.490173 21.501764 47.991937 47.991937 47.991937s47.991937-21.501764 47.991937-47.991937-21.501764-47.991937-47.991937-47.991937S255.784982 278.834873 255.784982 305.325046z" fill="#575B66" p-id="4443"></path><path d="M463.061986 305.325046c0 26.490173 21.501764 47.991937 47.991937 47.991937s47.991937-21.501764 47.991937-47.991937-21.501764-47.991937-47.991937-47.991937S463.061986 278.834873 463.061986 305.325046z" fill="#575B66" p-id="4444"></path><path d="M671.199059 305.325046c0 26.490173 21.501764 47.991937 47.991937 47.991937s47.991937-21.501764 47.991937-47.991937-21.501764-47.991937-47.991937-47.991937S671.199059 278.834873 671.199059 305.325046z" fill="#000000" p-id="4445"></path></svg>
              <h3>订单管理</h3>
            </el-menu-item>
            <el-menu-item index="3" @click="goToCommentPage">
              <svg style="margin-right: 8px;" t="1748592710650" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2365" width="20" height="20"><path d="M885.134222 487.651556c34.986667 0 63.772444 26.510222 67.527111 60.529777l0.455111 7.395556v220.615111a67.982222 67.982222 0 0 1-60.586666 67.470222l-7.395556 0.455111-65.649778-0.682666-98.816 74.069333a29.696 29.696 0 0 1-30.890666 2.958222l-4.721778-2.958222-96.881778-73.386667h-67.697778a67.925333 67.925333 0 0 1-67.413333-60.472889l-0.455111-7.395555v-220.728889c0-34.986667 26.510222-63.829333 60.529778-67.527111l7.395555-0.398222h364.657778l-0.056889 0.113777z m-141.084444-423.651556c48.583111 0 87.950222 43.804444 87.950222 97.905778v190.065778a32.028444 32.028444 0 0 1-64 0V153.144889a24.974222 24.974222 0 0 0-20.138667-24.746667l-4.551111-0.398222H152.689778a24.746667 24.746667 0 0 0-24.234667 20.593778l-0.398222 4.494222v653.767111c0 12.174222 8.533333 22.584889 20.138667 24.746667l4.551111 0.398222h263.281777a32.028444 32.028444 0 0 1 0 64h-263.964444c-48.64 0-88.007111-43.804444-88.007111-97.905778V161.905778c0-54.158222 39.424-97.905778 88.007111-97.905778h592.042667z m141.084444 482.986667H520.533333a8.533333 8.533333 0 0 0-8.021333 5.916444L512 555.52v220.615111c0 3.811556 2.446222 7.054222 5.802667 8.135111l2.730666 0.455111h76.458667c4.778667 0 9.500444 1.137778 13.653333 3.299556l4.152889 2.56 86.129778 67.470222 89.998222-67.470222a29.696 29.696 0 0 1 13.084445-5.575111l4.721777-0.341334h76.458667a8.419556 8.419556 0 0 0 8.078222-5.859555l0.455111-2.673778V555.52a8.533333 8.533333 0 0 0-8.590222-8.533333z m-304.64 92.387555a32.028444 32.028444 0 1 1 0 64 32.028444 32.028444 0 0 1 0-64z m123.050667-0.341333a32.028444 32.028444 0 1 1 0 64 32.028444 32.028444 0 0 1 0-64z m125.838222 0a31.971556 31.971556 0 1 1 0 64 31.971556 31.971556 0 0 1 0-64zM351.971556 448a32.028444 32.028444 0 1 1 0 64h-128a32.028444 32.028444 0 1 1 0-64h128zM544.028444 256a32.028444 32.028444 0 1 1 0 64H224.085333a32.028444 32.028444 0 1 1 0-64h319.943111z" p-id="2366" fill="#000000"></path></svg>            <h3>评论管理</h3>
            </el-menu-item>
          </el-menu>
        </div>
      </el-header>
  
      <router-view></router-view>
    </el-container>
  </template>
  
  <script>
  
  export default {
    name: 'Dash-board',
    components: {
      
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
        if (currentPath === '/adminProduct') return '1';
        if (currentPath === '/adminOrder') return '2';
        return '1';
      }
    },
    methods: {
      goToHomePage() {
        this.$router.push("/adminProduct");
      },
      goToCartPage() {
        this.$router.push("/adminOrder");
      },
      goToProfilePage() {
        this.$router.push("/profile");
      },
      toggleSearchPanel() {
        this.showSearchPanel = !this.showSearchPanel;
      },
      goToCommentPage() {
        this.$router.push("/commentsManagement");
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