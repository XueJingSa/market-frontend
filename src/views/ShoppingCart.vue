<template>
  <div class="cart-page">
    <!-- 购物车头部 -->
    <div class="cart-header">
    <h2>我的购物车（{{ cartItems.length }}件）</h2>
      <div class="header-actions">
        <el-checkbox v-model="selectAll">全选</el-checkbox>
        <el-button type="text" @click="clearCart">清空购物车</el-button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="cart-list">
      <!-- <el-pagination
        v-if="totalItems > 0"
        class="pagination"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      /> -->
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
          <p class="item-spec">{{ item.description }}</p>
          <div class="item-actions">
            <el-button 
                type="primary" 
                size="small"
                @click.stop="goToDetail(item.product_id)"
              >
                商品详情页
              </el-button>
            <el-button type="text" @click.stop="confirmRemove(item.product_id, item.detail_id)">删除</el-button>
          </div>
        </div>

        <div class="item-right">
          <div class="price">¥{{ item.price.toFixed(2) }}</div>
          <div class="quantity-control">
            <el-button 
              :disabled="item.quantity <= 1" 
              @click="updateQuantity(item.product_id, -1)"
            >-</el-button>
            <el-input 
              v-model.number="item.quantity" 
              :min="1" 
              :max="item.stock"
              class="quantity-input"
              @change="handleQuantityChange(item)"
            />
            <el-button 
              :disabled="item.quantity >= item.stock" 
              @click="updateQuantity(item.product_id, 1)"
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
import axios from 'axios'
export default {
  data() {
    return {
      cartItems: []
    }
  },
  async created() {
    await this.fetchCart()
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
    async fetchCart() {
      const resp = await axios.get('/api/api/cart/list', {
        params: { 
          userId: this.$store.state.UserModules.userId
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': this.$store.state.UserModules.token
        }
      });
      
      if (resp.data.code === 1) {
        this.cartItems = resp.data.data.records.map(item => ({
          detail_id: item.detailId,
          product_id: item.productId,
          name: item.productName,
          image: item.imageUrl,
          price: item.unitPrice,
          quantity: item.quantity,
          stockStatus: item.stockStatus,
          stock: item.stockStatus === '库存充足' ? 9999 : 9999,
          description: item.productName,
          checked: true,
          available: item.available,
          totalPrice: item.totalPrice
        }));
      }
    },
    async removeItem(id, detailId) {
      const resp = await axios.post('/api/api/cart/delete', null, {
        params: {
          cartDetailId: detailId,
          // userId: this.$store.state.UserModules.userId
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': this.$store.state.UserModules.token
        }
      });
      if (resp.data.code === 1) {
        this.$message.success("成功删除");
        this.fetchCart();
      } else {
        this.$message.error("删除失败");
      }
    },
    goToDetail(id) {
      this.$router.push({ name: 'ProductDetail', params: { id } })
    },
    confirmRemove(id, detail_id) {
      this.$confirm('确定要删除该商品吗？', '提示', { type: 'warning',confirmButtonText: '确定',   // 确认按钮文字
        cancelButtonText: '取消',     })
        .then(() => this.removeItem(id, detail_id))
        .catch(() => {})
    },

    async clearCart() {
      this.$confirm('确定要清空购物车吗？', '提示', { 
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const resp = await axios.post(`/api/api/cart/deleteAll`, null, { 
          params: {
            userId: this.$store.state.UserModules.userId
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': this.$store.state.UserModules.token
          }
        });
        if (resp.data.code === 1) {
          this.$message.success("成功清空");
          this.cartItems = [];
        } else {
          this.$message.error("清空失败");
        }
      }).catch(() => {});
    },
    async goToCheckout() {
      // 1. 筛选出已勾选的项
      const selectedDetails = this.cartItems
        .filter(item => item.checked)
        .map(item => item.detail_id);

      if (!selectedDetails.length) {
        return this.$message.warning('请先选择要结算的商品');
      }

      // 2. 直接把数组放到 query 里
      this.$router.push({
        name: 'CheckoutPage',
        query: { cartDetailIds: selectedDetails }
      });
    },

    async handleQuantityChange(item) {
      // 确保数量在有效范围内
      item.quantity = Math.max(1, Math.min(item.stock, item.quantity))
      
      // 显示加载状态
      const loading = this.$loading({
        lock: true,
        text: '正在更新数量...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      try {
        // 假装加载0.5秒
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const resp = await axios.post('/api/api/cart/updateQuantity', {
          cartDetailId: item.detail_id,
          quantity: item.quantity
        }, {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });
        
        if (resp.data.code === 1) {
          this.$message.success('修改数量成功');
        } else {
          this.$message.error(resp.data.msg || '修改数量失败');
          // 恢复原数量
          await this.fetchCart();
        }
      } catch (error) {
        this.$message.error('修改数量失败');
        console.error(error);
        // 恢复原数量
        await this.fetchCart();
      } finally {
        loading.close();
      }
    },

    async updateQuantity(id, delta) {
      const item = this.cartItems.find(i => i.product_id === id)
      if (item) {
        const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + delta))
        if (newQuantity !== item.quantity) {
          item.quantity = newQuantity
          await this.handleQuantityChange(item)
        }
      }
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

.pagination {
  margin: 20px 0;
  justify-content: center;
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
