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
          :value="cat.id"
        />
      </el-select>
      <el-select
        v-model="priceSort"
        placeholder="价格排序"
        clearable
        class="filter-select"
      >
        <el-option label="从低到高" value="asc" />
        <el-option label="从高到低" value="desc" />
      </el-select>
      <el-select
        v-model="stockFilter"
        placeholder="库存状态"
        clearable
        class="filter-select"
      >
        <el-option label="有货" value="in_stock" />
        <el-option label="库存紧张" value="low_stock" />
        <el-option label="缺货" value="out_of_stock" />
      </el-select>
    </div>

    <!-- 商品展示 -->
    <div class="product-grid">
      <div
        class="product-card"
        v-for="prod in products"
        :key="prod.product_id"
      >
        <img :src="prod.image_url" :alt="prod.name" class="product-image" @click="goToDetail(prod.product_id)"/>
        <div class="product-info">
          <div class="product-meta">
            <span>{{ getCategoryName(prod.category) }}</span>
            <span>{{ formatTime(prod.create_time) }}</span>
          </div>
          <div class="product-name" style="font-weight: bold;">{{ prod.name }}</div>
          <!-- <div class="product-desc" v-if="prod.description">
            {{ prod.description }}
          </div> -->
          <div class="product-bottom">
            <div class="price-stock">
              <span class="product-price">¥{{ prod.price.toFixed(2) }}</span>
              <span
                class="product-stock"
                :class="{ 'low-stock': prod.stock < 10 }"
              >
                {{ prod.stock > 0
                  ? prod.stock < 10
                    ? '库存紧张'
                    : '有货'
                  : '缺货' }}
              </span>
            </div>
            <button
              class="add-btn"
              @click="confirmAddToCart(prod)"
              :disabled="prod.stock <= 0"
            >
              {{ prod.stock > 0 ? '加入购物车' : '已售罄' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Search,Back,ShoppingCart as Cart} from '@element-plus/icons-vue'

export default {
  name: "SearchResults",
  components: {
    Search,Back, Cart
  },
  data() {
    return {
      searchQuery: this.$route.query.q || '',
      categoryFilter: this.$route.query.category || null,
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
      ],
      products: [
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        {
          product_id: 101,
          name: "红富士苹果 5斤装",
          category: 1,
          price: 39.8,
          stock: 15,
          description: "新鲜红富士苹果，脆甜多汁，产地陕西",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:00:00"
        },
        // 其他19个商品数据...
      ]
    }
  },
  computed: {
    searchParams() {
      return {
        q: this.searchQuery.trim(),
        category: this.categoryFilter,
        sort: this.priceSort,
        stock: this.stockFilter
      }
    }
  },
  methods: {
    goToDetail(id) {
      this.$router.push({ name: 'ProductDetail', params: { id } })
    },
    handleSearch() {
      this.$router.push({
        name: "SearchResults",
        query: {
          q: this.searchQuery.trim(),
          category: this.categoryFilter,
          sort: this.priceSort,
          stock: this.stockFilter
        }
      })
    },
    confirmAddToCart(prod) {
    if (confirm(`确定将 "${prod.name}" 加入购物车吗？`)) {
      this.addToCart(prod);
    }
  },
    addToCart(prod) {
      console.log("加入购物车：", prod)
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : '未知分类'
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

.nav-buttons {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-section {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  transition: all 0.3s;
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

.product-desc {
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 4px 0;
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
</style>


