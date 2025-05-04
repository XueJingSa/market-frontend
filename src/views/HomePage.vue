<template>
  <div class="home-page">
    <!-- —— 上方分类栏 —— -->
    <div class="categories-container">
      <div
        class="category-item"
        v-for="cat in categories"
        :key="cat.id"
        @click="goCategory(cat.name)"
      >
        <img :src="cat.icon" :alt="cat.name" class="category-icon" />
        <span class="category-name">{{ cat.name }}</span>
      </div>
    </div>

    <!-- —— 推荐商品区 —— -->
    <section class="recommendation">
      <h2 class="section-title">推荐商品</h2>
      <div class="product-grid">
        <div
          class="product-card"
          v-for="prod in products"
          :key="prod.product_id"
        >
          <img :src="prod.image_url" :alt="prod.name" class="product-image" @click="goToDetail(prod.product_id)"/>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-category">{{ getCategoryName(prod.category) }}</span>
              <span class="product-time">{{ formatTime(prod.create_time) }}</span>
            </div>
            <div class="product-name">{{ prod.name }}</div>
            <div class="product-desc" v-if="prod.description">{{ prod.description }}</div>
            <div class="product-bottom">
              <div class="price-stock">
                <span class="product-price">¥{{ prod.price.toFixed(2) }}</span>
                <span class="product-stock" :class="{ 'low-stock': prod.stock < 10 }">
                  {{ prod.stock > 0 ? (prod.stock < 10 ? '库存紧张' : '有货') : '缺货' }}
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
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      categories: [
        { id: 1, name: "新鲜果蔬", icon: require("@/assets/categories/1.png") },
        { id: 2, name: "肉禽蛋类", icon: require("@/assets/categories/2.png") },
        { id: 3, name: "海鲜水产", icon: require("@/assets/categories/3.png") },
        { id: 4, name: "乳品烘焙", icon: require("@/assets/categories/4.png") },
        { id: 5, name: "熟食即食", icon: require("@/assets/categories/5.png") },
        { id: 6, name: "冷冻食品", icon: require("@/assets/categories/6.png") },
        { id: 7, name: "酒水饮料", icon: require("@/assets/categories/7.png") },
        { id: 8, name: "休闲零食", icon: require("@/assets/categories/8.png") },
        { id: 9, name: "粮油调味", icon: require("@/assets/categories/9.png") },
        { id: 10, name: "日化家居", icon: require("@/assets/categories/10.png") }
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
          product_id: 102,
          name: "新鲜鸡蛋 30枚",
          category: 2,
          price: 29.9,
          stock: 8,
          description: "农家散养土鸡蛋，营养丰富",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-16 09:30:00"
        },
        {
          product_id: 103,
          name: "进口三文鱼 500g",
          category: 3,
          price: 58.0,
          stock: 5,
          description: "挪威进口三文鱼，新鲜切片",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-17 14:20:00"
        },
        {
          product_id: 104,
          name: "牛奶面包 4个装",
          category: 4,
          price: 19.5,
          stock: 20,
          description: "新鲜烘焙，奶香浓郁",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-14 08:15:00"
        },
        {
          product_id: 105,
          name: "酱香鸭脖 200g",
          category: 5,
          price: 25.0,
          stock: 12,
          description: "麻辣鲜香，休闲零食",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-16 11:30:00"
        },
        {
          product_id: 106,
          name: "速冻水饺 1kg",
          category: 6,
          price: 32.0,
          stock: 18,
          description: "三鲜口味，皮薄馅大",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 16:45:00"
        },
        {
          product_id: 107,
          name: "矿泉水 24瓶装",
          category: 7,
          price: 36.0,
          stock: 25,
          description: "天然矿泉水，550ml/瓶",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-13 10:00:00"
        },
        {
          product_id: 108,
          name: "薯片大礼包 5袋",
          category: 8,
          price: 45.0,
          stock: 10,
          description: "多种口味组合装",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-17 13:20:00"
        },
        {
          product_id: 109,
          name: "五常大米 5kg",
          category: 9,
          price: 68.0,
          stock: 7,
          description: "东北五常大米，香糯可口",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-14 09:10:00"
        },
        {
          product_id: 110,
          name: "洗衣液 3kg",
          category: 10,
          price: 42.0,
          stock: 15,
          description: "深层去渍，持久留香",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-16 15:30:00"
        },
        {
          product_id: 111,
          name: "有机菠菜 500g",
          category: 1,
          price: 12.8,
          stock: 6,
          description: "新鲜有机菠菜，无农药残留",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-18 07:00:00"
        },
        {
          product_id: 112,
          name: "澳洲牛排 300g",
          category: 2,
          price: 78.0,
          stock: 3,
          description: "澳洲进口谷饲牛排",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-17 10:15:00"
        },
        {
          product_id: 113,
          name: "冷冻虾仁 500g",
          category: 3,
          price: 45.0,
          stock: 9,
          description: "去壳去虾线，方便烹饪",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-16 14:30:00"
        },
        {
          product_id: 114,
          name: "芝士蛋糕 6寸",
          category: 4,
          price: 88.0,
          stock: 4,
          description: "纽约风味，口感细腻",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-17 16:00:00"
        },
        {
          product_id: 115,
          name: "卤味鸭翅 250g",
          category: 5,
          price: 28.0,
          stock: 11,
          description: "香辣口味，独立包装",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 13:45:00"
        },
        {
          product_id: 116,
          name: "速冻汤圆 500g",
          category: 6,
          price: 18.0,
          stock: 14,
          description: "黑芝麻馅，香甜软糯",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-14 11:20:00"
        },
        {
          product_id: 117,
          name: "橙汁 1L",
          category: 7,
          price: 15.0,
          stock: 22,
          description: "100%纯果汁，无添加",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-13 15:00:00"
        },
        {
          product_id: 118,
          name: "坚果大礼包 800g",
          category: 8,
          price: 98.0,
          stock: 5,
          description: "8种坚果混合，营养丰富",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-16 12:30:00"
        },
        {
          product_id: 119,
          name: "橄榄油 500ml",
          category: 9,
          price: 65.0,
          stock: 8,
          description: "特级初榨橄榄油",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-15 10:45:00"
        },
        {
          product_id: 120,
          name: "抽纸 24包",
          category: 10,
          price: 32.0,
          stock: 30,
          description: "三层加厚，柔软亲肤",
          image_url: require("@/assets/products/eggs.png"),
          create_time: "2025-04-14 14:15:00"
        }
      ]
    };
  },
  methods: {

    goToDetail(id) {
      this.$router.push({ name: 'ProductDetail', params: { id } })
    },
    goCategory(id) {
      this.$router.push({
        name: "SearchResults",
        query: { category: id }
      });
    },
    confirmAddToCart(prod) {
    if (confirm(`确定将 "${prod.name}" 加入购物车吗？`)) {
      this.addToCart(prod);
    }
  },
    addToCart(prod) {
      console.log("加入购物车：", prod);
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : '未知分类';
    },
    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return `${date.getMonth()+1}月${date.getDate()}日上架`;
    }
  }
};
</script>

<style scoped>
.home-page {
  padding: 0 10px;
  background-color: #f5f5f5;
}

/* —— 分类栏 —— */
.categories-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  padding: 24px 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.category-item:hover {
  transform: translateY(-6px);
}

.category-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #fff;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0f2fe;
}
.category-name {
  margin-top: 12px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

/* —— 推荐商品区 —— */
.recommendation {
  margin-top: 16px;
}
.section-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

/* 商品卡片 */
.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: contain;
  padding: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: opacity 0.3s;
}
.product-image:hover {
  opacity: 0.9;
}
.product-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.product-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.product-desc {
  font-size: 12px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-stock {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-price {
  color: #e64340;
  font-weight: bold;
  font-size: 15px;
}

.product-stock {
  font-size: 12px;
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

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media screen and (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .category-item {
    width: 80px;
  }
  .category-icon {
    width: 80px;
    height: 80px;
  }
}
@media screen and (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .category-item {
    width: 70px;
  }
  .category-icon {
    width: 70px;
    height: 70px;
  }
}
</style>
