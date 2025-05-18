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
        <el-tag v-if="product.isDiscontinued === 1" type="danger" style="margin-left: 8px;">已下架</el-tag>
        <span class="create-time">上架时间：{{ formatTime(product.create_time) }}</span>
      </div>

      <div class="price-stock">
        <div class="price">¥{{ product.price }}</div>
        <div class="stock" :class="stockStatus">
          {{ product.stockStatus }}
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
          :max="50"
          size="large"
        />
        <el-button 
          type="primary" 
          size="large"
          :disabled="product.stockStatus == '无库存' || product.isDiscontinued === 1"
          @click="addToCart"
        >
          {{ product.stockStatus == '无库存' ? '已售罄' : (product.isDiscontinued === 1 ? '已下架' : '加入购物车') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      quantity: 1,
      product: {
        // product_id: 101,
        // name: "红富士苹果 5斤装",
        // category: 1,
        // price: 39.8,
        // stock: 15,
        // description: "新鲜红富士苹果，脆甜多汁，产地陕西",
        // image_url: require("@/assets/products/eggs.png"),
        // create_time: "2024-03-20 14:30:00"
      },
      categories: [
        { id: 1, name: "新鲜果蔬" },
        { id: 2, name: "肉禽蛋类" },
        { id: 3, name: "海鲜水产"},
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
    categoryName() {
      return this.categories.find(c => c.id === this.product.category)?.name || '未知分类'
    },
    stockStatus() {
      if(this.product.stockStatus == '无库存') return 'out-of-stock'
      return this.product.stockStatus == '库存紧张' ? 'low-stock' : 'in-stock'
    },
    // stockText() {
    //   if(this.product.stock <= 0) return '已售罄'
    //   return this.product.stock < 10 ? `仅剩${this.product.stock}件` : '库存充足'
    // }
  },
  async created() {
  const id = this.$route.params.id
  try {
    // 改为 GET，请求参数通过 params 传递
    const resp = await axios.get('/api/api/product/detail', {
      params: {
        id
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': this.$store.state.UserModules.token
      }
    });
    const item = resp.data.data
    this.product = {
      product_id: item.productId,
      name: item.name,
      category: item.category,
      price: item.price,
      stockStatus: item.stockStatus,
      description: item.description,
      image_url: item.imageUrl,
      create_time: item.createTimeString,
      isDiscontinued: item.isDiscontinued
    }
  } catch (err) {
    this.$message.error('获取商品详情失败')
    console.error(err)
  }
},
  methods: {
    formatTime(timeStr) {
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    async addToCart() {
      try {
        const response = await axios.post('/api/api/cart/add', {
          // user_id: this.$store.state.UserModules.userId,
          productId: this.product.product_id,
          num: this.quantity,
          unitPrice:this.product.price
        },
        {
          headers: {
            
            'token': this.$store.state.UserModules.token
          }
        });

        if (response.data.code === 1) {
          this.$message.success('加入购物车成功');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        this.$message.error('加入购物车失败');
      }
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
