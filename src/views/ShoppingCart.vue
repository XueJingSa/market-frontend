<template>
  <div class="cart-page">
    <!-- 购物车头部 -->
    <div class="cart-header">
      <h2>我的购物车（{{ selectedItemsCount }}件）</h2>
      <div class="header-actions">
        <el-checkbox v-model="selectAll">全选</el-checkbox>
        <el-button type="text" @click="clearCart">清空购物车</el-button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="cart-list">
      <div
        class="cart-item"
        v-for="item in cartItems"
        :key="item.id"
        :class="{ 'checked': item.checked }"
      >
        <el-checkbox v-model="item.checked" class="item-check" />

        <img :src="item.image" class="item-image" alt="商品图片" />

        <div class="item-info">
          <h3 class="item-title">{{ item.name }}</h3>
          <p class="item-spec">{{ item.specification }}</p>
          <div class="item-actions">
            <el-button 
                type="primary" 
                size="small"
                @click.stop="goToDetail(item.id)"
              >
                商品详情页
              </el-button>
            <el-button type="text" @click.stop="confirmRemove(item.id)">删除</el-button>
          </div>
        </div>

        <div class="item-right">
          <div class="price">¥{{ item.price.toFixed(2) }}</div>
          <div class="quantity-control">
            <el-button 
              :disabled="item.quantity <= 1" 
              @click="updateQuantity(item.id, -1)"
            >-</el-button>
            <el-input 
              v-model.number="item.quantity" 
              :min="1" 
              :max="item.stock"
              class="quantity-input"
            />
            <el-button 
              :disabled="item.quantity >= item.stock" 
              @click="updateQuantity(item.id, 1)"
            >+</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部结算栏 -->
    <div class="checkout-bar">
      <div class="total-info">
        <div class="total-line">
          <span>已选{{ selectedItemsCount }}件</span>
          <span>总金额：<em class="total-price">¥{{ totalPrice.toFixed(2) }}</em></span>
        </div>
        <div class="discount-line" v-if="totalDiscount > 0">
          已优惠：¥{{ totalDiscount.toFixed(2) }}
        </div>
      </div>
      <el-button 
        type="primary" 
        class="checkout-btn"
        :disabled="selectedItemsCount === 0"
        @click="goToCheckout"
      >
        去结算（{{ selectedItemsCount }}件）
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: "新鲜红富士苹果 5斤装",
          image: require("@/assets/products/eggs.png"),
          price: 39.8,
          quantity: 2,
          stock: 10,
          specification: "约500g/个",
          checked: true
        },
        {
          id: 2,
          name: "精选肋排 500g",
          image: require("@/assets/products/eggs.png"),
          price: 45.0,
          quantity: 1,
          stock: 5,
          specification: "冷冻包装",
          checked: true
        },
        // … 其他商品
      ]
    }
  },
  computed: {
    selectAll: {
      get() {
        return this.cartItems.length > 0 && this.cartItems.every(item => item.checked)
      },
      set(value) {
        this.cartItems.forEach(item => item.checked = value)
      }
    },
    selectedItemsCount() {
      return this.cartItems.filter(item => item.checked).length
    },
    totalPrice() {
      return this.cartItems
        .filter(item => item.checked)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    totalDiscount() {
      return this.cartItems
        .filter(item => item.checked)
        .reduce((sum, item) => sum + (item.discount || 0), 0)
    }
  },
  methods: {
    goToDetail(id) {
      this.$router.push({ name: 'ProductDetail', params: { id } })
    },
    updateQuantity(id, delta) {
      const item = this.cartItems.find(i => i.id === id)
      if (item) {
        item.quantity = Math.max(1, Math.min(item.stock, item.quantity + delta))
      }
    },
    confirmRemove(id) {
      this.$confirm('确定要删除该商品吗？', '提示', { type: 'warning',confirmButtonText: '确定',   // 确认按钮文字
        cancelButtonText: '取消',     })
        .then(() => this.removeItem(id))
        .catch(() => {})
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter(i => i.id !== id)
    },
    clearCart() {
      this.$confirm('确定要清空购物车吗？', '提示', { type: 'warning', confirmButtonText: '确定',   // 确认按钮文字
        cancelButtonText: '取消',   })
        .then(() => {
          this.cartItems = []
        })
        .catch(() => {})
    },
    goToCheckout() {
      const selectedIds = this.cartItems
        .filter(i => i.checked)
        .map(i => i.id)
        .join(',')
      this.$router.push({ path: '/checkout', query: { items: selectedIds } })
    }
  }
}
</script>

<style scoped>
.cart-page {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 0;
}

/* 购物车头部 */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* 商品列表 */
.cart-list {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  transition: background 0.3s;
}
.cart-item:last-child {
  border-bottom: none;
}
.cart-item:hover {
  background: #f8fafc;
}

.item-check {
  margin-right: 20px;
}
.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 20px;
}
.item-info {
  flex: 1;
}
.item-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}
.item-spec {
  color: #999;
  font-size: 12px;
}
.item-actions {
  margin-top: 12px;
}

/* 右侧操作区 */
.item-right {
  min-width: 180px;
  text-align: right;
}
.price {
  font-size: 16px;
  color: #e4393c;
  margin-bottom: 12px;
}
.quantity-control {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  padding: 0;
}

.quantity-input {
  width: 50px;
  margin: 0 4px;
}

.quantity-input :deep(.el-input__inner) {
  text-align: center;
  padding: 0 5px;
}

/* 底部结算栏 */
.checkout-bar {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px 24px;
  margin-top: 24px;
  border-radius: 8px;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-price {
  font-size: 24px;
  color: #e4393c;
}

.checkout-btn {
  width: 220px;
  height: 48px;
  font-size: 16px;
}

.discount-line {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
    position: relative;
    padding-left: 40px;
  }
  .item-check {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .item-image {
    width: 80px;
    height: 80px;
  }
  .item-right {
    width: 100%;
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
