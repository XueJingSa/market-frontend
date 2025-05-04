<template>
  <div class="product-detail">
    <!-- 商品主图 -->
    <div class="image-section">
      <img 
        :src="product.image_url || 'https://via.placeholder.com/600x600.png?text=Product+Image'" 
        class="product-image"
        alt="商品主图"
      />
    </div>

    <!-- 商品信息 -->
    <div class="info-section">
      <h1 class="product-name">{{ product.name }}</h1>
      
      <div class="meta-info">
        <el-tag type="info">{{ categoryName }}</el-tag>
        <span class="create-time">上架时间：{{ formatTime(product.create_time) }}</span>
      </div>

      <div class="price-stock">
        <div class="price">¥{{ product.price.toFixed(2) }}</div>
        <div class="stock" :class="stockStatus">
          {{ stockText }}
        </div>
      </div>

      <el-divider />

      <div class="description">
        <h3>商品描述</h3>
        <p>{{ product.description || '暂无详细描述' }}</p>
      </div>

      <div class="action-bar">
        <el-input-number 
          v-model="quantity"
          :min="1" 
          :max="product.stock"
          size="large"
          :disabled="product.stock <= 0"
        />
        <el-button 
          type="primary" 
          size="large"
          :disabled="product.stock <= 0"
          @click="addToCart"
        >
          {{ product.stock > 0 ? '加入购物车' : '已售罄' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quantity: 1,
      product: {
        product_id: 101,
        name: "红富士苹果 5斤装",
        category: 1,
        price: 39.8,
        stock: 15,
        description: "新鲜红富士苹果，脆甜多汁，产地陕西",
        image_url: require("@/assets/products/eggs.png"),
        create_time: "2024-03-20 14:30:00"
      },
      categories: [
        { id: 1, name: "新鲜果蔬" },
        { id: 2, name: "肉禽蛋类" },
        // ...其他分类
      ]
    }
  },
  computed: {
    categoryName() {
      return this.categories.find(c => c.id === this.product.category)?.name || '未知分类'
    },
    stockStatus() {
      if(this.product.stock <= 0) return 'out-of-stock'
      return this.product.stock < 10 ? 'low-stock' : 'in-stock'
    },
    stockText() {
      if(this.product.stock <= 0) return '已售罄'
      return this.product.stock < 10 ? `仅剩${this.product.stock}件` : '库存充足'
    }
  },
  methods: {
    formatTime(timeStr) {
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    addToCart() {
      console.log('加入购物车', {
        product_id: this.product.product_id,
        quantity: this.quantity
      })
    }
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.image-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.product-image {
  max-width: 100%;
  height: 500px;
  object-fit: contain;
}

.info-section {
  padding: 20px;
}

.product-name {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.create-time {
  color: #666;
  font-size: 14px;
}

.price-stock {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin: 25px 0;
}

.price {
  color: #e4393c;
  font-size: 36px;
  font-weight: 700;
}

.stock {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
}
.stock.in-stock { background: #f0f9eb; color: #67c23a; }
.stock.low-stock { background: #fdf6ec; color: #e6a23c; }
.stock.out-of-stock { background: #fef0f0; color: #f56c6c; }

.description {
  color: #666;
  line-height: 1.6;
  margin: 25px 0;
}
.description h3 {
  color: #333;
  margin-bottom: 10px;
}

.action-bar {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}
.action-bar .el-input-number {
  width: 150px;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 20px;
  }
  
  .product-image {
    height: 300px;
  }
  
  .price {
    font-size: 28px;
  }
  
  .action-bar {
    flex-direction: column;
  }
}
</style>