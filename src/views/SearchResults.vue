<template>
 <div class="search-page">
    <!-- 搜索头部：返回 / 搜索框 / 购物车 -->
    <div class="search-header">
      <el-button
        type="primary"
        plain
        @click="$router.push('/')"
        class="nav-btn"
      >
        <el-icon><Back /></el-icon>
        返回首页
      </el-button>

      <el-input
        v-model="searchQuery"
        placeholder="搜索商品关键词"
        class="search-input"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #append>
          <el-button @click="handleSearch" class="search-btn">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>

      <el-button
        type="success"
        plain
        @click="$router.push('/cart')"
        class="nav-btn"
      >
        进入购物车
        <el-icon><Cart /></el-icon>
      </el-button>
    </div>

    <!-- 筛选区 -->
    <div class="filter-section">
      <el-select
        v-model="categoryFilter"
        placeholder="分类"
        clearable
        class="filter-select"
      >
        <el-option
          v-for="cat in categories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.name"
        />
      </el-select>
      <el-select
        v-model="orderBy"
        placeholder="排序字段"
        clearable
        class="filter-select"
      >
        <el-option label="价格" value="price" />
      </el-select>
      <el-select
        v-model="sort"
        placeholder="排序方式"
        clearable
        class="filter-select"
      >
        <el-option label="升序" value="asc" />
        <el-option label="降序" value="desc" />
      </el-select>
      <el-select
        v-model="isDiscontinued"
        placeholder="商品状态"
        clearable
        class="filter-select"
      >
        <el-option label="上架" :value="0" />
        <el-option label="下架" :value="1" />
      </el-select>
    </div>

    <!-- 商品展示 -->
    <div class="product-grid">
      <div class="product-card" v-for="prod in products" :key="prod.product_id">
    <!-- 已下架 Badge -->
    <div v-if="prod.isDiscontinued === 1" class="badge-overlay">
      <el-tag type="danger">已下架</el-tag>
    </div>

    <!-- 商品图片 -->
    <img
      :src="prod.image_url"
      :alt="prod.name"
      class="product-image"
      @click="goToDetail(prod.product_id)"
    />

    <!-- 商品信息 -->
    <div class="product-info">
      <div class="product-meta">
        <span>{{ getCategoryName(prod.category) }}</span>
        <span>{{ formatTime(prod.create_time) }}</span>
      </div>

      <div class="product-name">{{ prod.name }}</div>

      <div class="product-bottom">
        <div class="price-stock">
          <span class="product-price">¥{{ prod.price.toFixed(2) }}</span>
          <span
            class="product-stock"
            :class="{
              'low-stock': prod.stock === -1,
              'in-stock': prod.stock === -2,
              'out-of-stock': prod.stock === 0
            }"
          >
            <!-- 根据脱敏后 stock 显示对应文案 -->
            {{ prod.stock === 0
              ? '已售罄'
              : prod.stock === -1
                ? '库存紧张'
                : '库存充足' }}
          </span>
        </div>

        <button
          class="add-btn"
          @click="addToCart(prod)"
          :disabled="prod.stock === 0 || prod.isDiscontinued === 1"
        >
          <!-- 按钮文案 -->
          {{ prod.isDiscontinued === 1
            ? '已下架'
            : prod.stock === 0
              ? '已售罄'
              : '加入购物车' }}
        </button>
      </div>
    </div>
  </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { Search,Back,ShoppingCart as Cart} from '@element-plus/icons-vue'
import axios from 'axios'
export default {
  name: "SearchResults",
  components: {
    Search,Back, Cart
  },
  data() {
    return {
      searchQuery: this.$route.query.q || '',
      categoryFilter: this.$route.query.category ? this.$route.query.category : null,
      orderBy: null,
      sort: null,
      isDiscontinued: null,
      page: 1,
      pageSize: 7,
      total: 0,
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
      ],
      products: []
    }
  },
  computed: {
    searchParams() {
      return {
        page: this.page,
        pageSize: this.pageSize,
        name: this.searchQuery.trim(),
        category: this.getCategoryId(this.categoryFilter),
        orderBy: this.orderBy,
        sort: this.sort,
        isDiscontinued: this.isDiscontinued
      }
    }
  },
  async mounted() {
    await this.handleSearch()
  },
  methods: {
    goToDetail(id) {
      this.$router.push({ name: 'ProductDetail', params: { id } })
    },
    handleSearch(resetPage = false) {
    if (resetPage) this.page = 1;  // ← 每次新查询回到第一页
    axios.get('/api/api/product/search', { params: this.searchParams,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': this.$store.state.UserModules.token
    } }).then(res => {
      // this.products = res.data.data.records
      this.products = res.data.data.records.map(item => ({
        product_id: item.productId,
        name: item.name,
        category: item.category,
        price: item.price,
        stock: item.stock,
        description: item.description,
        image_url: item.imageUrl,
        create_time: item.createTime,
        isDiscontinued: item.isDiscontinued
      }))
      this.total = res.data.data.total
    })
  }
  ,
    handlePageChange(page) {
      this.page = page;
      this.handleSearch();
    },
    async addToCart(prod) {
      try {
        const { value: quantity } = await this.$prompt('请输入购买数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[1-9]\d*$/,
          inputErrorMessage: '请输入有效的数量',
          inputValue: 1,
          inputValidator: () => {
            // if (value > prod.stock) {
            //   return '数量不能超过库存';
            // }
            return true;
          }
        });
        
        const response = await axios.post('/api/api/cart/add', {
          user_id: this.$store.state.UserModules.userId,
          productId: prod.product_id,
          num: parseInt(quantity),
          unitPrice:prod.price
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': this.$store.state.UserModules.token
          }
        });

        if (response.data.code === 0) {
          this.$message.success('加入购物车成功');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('加入购物车失败');
        }
      }
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : '未知分类'
    },
    getCategoryId(categoryName) {
      const category = this.categories.find(c => c.name === categoryName)
      return category ? category.id : '未知分类'
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getMonth()+1}月${date.getDate()}日上架`
    }
  }
}
</script>

<style scoped>
.search-page {
  padding: 20px;
}
/* 搜索头部布局 */
.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto 20px;
}
.nav-btn {
  min-width: 100px;
}
.search-input {
  flex: 1;
  max-width: 500px;
}
.search-input .el-input__inner {
  height: 44px;
  border-radius: 22px;
  padding: 0 16px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}
.search-btn {
  border-radius: 0 22px 22px 0;
  height: 44px;
}

/* 筛选区居中 */
.filter-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto 20px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
}
.filter-select {
  width: 200px;
  border-radius: 4px;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.product-card {
  
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  transition: all 0.3s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  padding: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition: opacity 0.3s;
}
.product-image:hover {
  opacity: 0.9;
}
.product-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.product-name {
  font-size: 18px;
  font-weight: 500;
  margin: 5px 0;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-stock {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-price {
  color: #e64340;
  font-weight: bold;
  font-size: 18px;
}

.product-stock {
  font-size: 14px;
  color: #67c23a;
}
.product-stock.low-stock {
  color: #e6a23c;
}

.add-btn {
  background-color: #409eff;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.add-btn:hover {
  background-color: #307fd6;
}
.add-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .product-card {
    flex-direction: column;
  }
  .product-image {
    width: 100%;
    height: auto;
  }
}
.badge-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 1000;
}

/* 禁用点击的商品图 */
.disabled-click {
  cursor: not-allowed;
  opacity: 0.6;
}
.badge-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}
.product-stock.out-of-stock { color: #f56c6c; }
.product-stock.low-stock { color: #e6a23c; }
.product-stock.in-stock { color: #67c23a; }

</style>
