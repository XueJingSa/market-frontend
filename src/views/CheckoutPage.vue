<template>
  <div class="container">
    <h1 class="order-title">提交订单</h1>
    <!-- 收货地址 -->
    <div class="address-list">
      <div class="address-card" v-if="!isEditing">
        <div class="address-content">{{ address || '未设置地址' }}</div>
        <el-button type="primary" class="edit-btn" @click="startEditing">修改</el-button>
      </div>

      <div class="address-form" v-else>
        <input v-model="editedAddress" type="text" class="address-input" placeholder="请输入地址">
        <div class="form-actions">
          <el-button type="primary" @click="saveAddress">保存</el-button>
          <el-button type="default" @click="cancelEditing">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="order-info-section">
      <h3 class="section-title">确认订单信息</h3>
      <div class="order-table">
        <table>
          <thead>
            <tr>
              <th>店铺宝贝</th>
              <th>商品类别</th>
              <th>原价</th>
              <th>数量</th>
              <th>小计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="index">
              <td class="product-td">
                <img :src="product.imageUrl" alt="product" width="50">
                <span class="product-name">{{ product.productName }}</span>
              </td>
              <td>{{ categoryList[product.category - 1] }}</td>
              <td>¥{{ product.unitPrice }}</td>
              <td>
                <el-button size="small" @click="decreaseQuantity(index)">-</el-button>
                <span style="margin: 0 5px;">{{ product.quantity }}</span>
                <el-button size="small" @click="increaseQuantity(index)">+</el-button>
              </td>
              <td>¥{{ (product.unitPrice * product.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4 class="section-title">订单备注</h4>
      <div class="order-note">
        <el-input v-model="orderNote" placeholder="请输入，付款后商家可见，建议和商家协商一致" type="textarea" :rows="2" :maxlength="200" />
        <span class="input-count">{{ orderNote.length }} / 200</span>
      </div>
      <div class="delivery-service">
        <span>配送服务</span>
        <span class="service-name">{{ deliveryService.name }}</span>
        <span class="service-price">¥{{ deliveryService.price }}</span>
      </div>
    </div>
    <!-- 付款详情部分 -->
    <div class="payment-section">
      <h3 class="section-title">付款详情 共 {{ products.length }} 件商品</h3>
      <div class="payment-item">
        <span>商品总价</span>
        <span class="price">¥{{ (totalProductPrice).toFixed(2) }}</span>
      </div>
      <div class="payment-item">
        <span>共减</span>
        <span class="price">-</span>
      </div>
      <div class="payment-total">
        <span>实付款</span>
        <span class="price">¥{{ (totalCost).toFixed(2) }}</span>
      </div>
      <div class="payment-actions">
        <el-button type="primary" @click="goBack">返回</el-button>
        <el-button type="danger" @click="submitOrder">提交订单</el-button>
      </div>
    </div>
  </div>
  <div v-if="showAlipayPage" class="alipay-container">
    <div v-if="loading" class="loading-mask">
      <el-loading-spinner size="large"></el-loading-spinner>
    </div>
    <div v-else ref="alipayContainer"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { callError, callSuccess } from '@/api/index';
export default {
  data() {
    return {
      selectedAddress: null,
      address: "",
      products: [
        {
          "detailId": 1,
          "cartId": 1,
          "productId": 1,
          "productName": "商品2",
          "imageUrl": '',
          "unitPrice": 10,
          "quantity": 1,
          "totalPrice": 10,
          "category": 0,
          "stockStatus": "库存充足",
          "available": true,
          "createTime": null,
          "updateTime": null
        },
      ],
      categoryList: [
        '新鲜果蔬',
        '肉禽蛋类',
        '海鲜水产',
        '乳品烘焙',
        '熟食即食',
        '冷冻食品',
        '酒水饮料',
        '休闲零食',
        '粮油调味',
        '日化家居'
      ],
      orderNote: '',
      deliveryService: {
        name: '快递 包邮',
        price: 0
      },
      isReturnInsurance: true,
      carts: [],
      cartDetailIds: [],
      loading: false,
      showAlipayPage: false,
      alipayHtml: '',
      isEditing: false,
      editedAddress: ''
    }
  },

  watch: {
    address(newVal) {
      this.editedAddress = newVal;
    }
  },

  computed: {
    // 计算商品总价
    totalProductPrice() {
      return this.products.reduce((acc, product) => acc + (product.unitPrice * product.quantity), 0);
    },

    // 计算总费用
    totalCost() {
      return this.totalProductPrice + this.deliveryService.price;
    }
  },

  methods: {
    // 减少商品数量
    decreaseQuantity(index) {
      if (this.products[index].quantity > 1) {
        this.products[index].quantity--;
      }
    },

    // 增加商品数量
    increaseQuantity(index) {
      this.products[index].quantity++;
    },

    // 返回上一页
    goBack() {
      this.$router.push('/cart');
      return;
    },

    // 提交订单
    async submitOrder() {
      if (this.loading) return;
      console.log(this.cartDetailIds);
      this.loading = true;
      try {
        const response = await axios.post('/api/api/pay/create_pay_order', {
          cartDetailIds: this.cartDetailIds,
          userId: this.$store.state.UserModules.userId
        }, {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });

        console.log(response.data);
        if (response.data.code == 1) {
          this.alipayHtml = response.data.data;
          this.showAlipayPage = true;

          // 延迟执行渲染，确保DOM已更新
          this.$nextTick(() => {
            this.renderAlipayPage();
          });
        } else {
          callError(response.data.msg);
        }

      } catch (error) {
        callError('创建支付订单失败，请稍后重试');
        console.error('创建支付订单失败:', error);
      } finally {
        this.loading = false;
      }
    },

    renderAlipayPage() {
      const newWindow = window.open('', '_blank');
      newWindow.document.write(this.alipayHtml);
      newWindow.document.close();
      // const container = this.$refs.alipayContainer;
      // container.innerHTML = this.alipayHtml;

      // const scripts = container.querySelectorAll('script');
      const scripts = newWindow.document.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    },

    async fetchCart() {
      try {
        const userId = this.$store.state.UserModules.userId;
        console.log(userId, this.$store.state.UserModules.token)
        const response = await axios.get('/api/api/cart/list', {
          params: { userId },
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });
        this.carts = response.data.data.records || [];
        // console.log(this.carts)
        // 筛选products
        const paramArray = this.$route.query.cartDetailIds || [];
        this.cartDetailIds = Array.isArray(paramArray)
          ? paramArray.map(Number)
          : [Number(paramArray)];

        this.products = this.carts.filter(item =>
          this.cartDetailIds.includes(item.detailId)
        );
        // console.log(this.products);
      } catch (error) {
        callError('获取购物车列表失败，请稍后重试');
        console.error('获取购物车列表失败:', error);
      }
    },

    startEditing() {
      this.editedAddress = this.address;
      this.isEditing = true;
    },
    cancelEditing() {
      this.editedAddress = this.address;
      this.isEditing = false;
    },
    saveAddress() {
      if (!this.editedAddress.trim()) {
        alert('地址不能为空');
        return;
      }
      this.isEditing = false;
      this.address = this.editedAddress;
      this.updateAddr();
    },
    async updateAddr() {
      try {
        await axios.post('/api/api/user/update', {
          address: this.address,
          userId: this.$store.state.UserModules.userId
        }, {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });
        this.$store.commit('UserModules/setAddr', this.address);
        callSuccess('更新地址成功');
      } catch (error) {
        callError('更新地址失败，请稍后重试');
        console.error('更新地址失败:', error);
      }
    },
  },



  created() {
    this.address = this.$store.state.UserModules.userAddr;
    this.fetchCart();
  }

}
</script>

<style scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.order-title {
  text-align: center;
  color: #333;
  margin: 20px 0;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
}

.address-actions {
  text-align: right;
  margin-bottom: 10px;
}

.address-list {
  margin-bottom: 20px;
}

.default-tag {
  background-color: #ff4500;
  color: #fff;
  padding: 2px 5px;
  border-radius: 2px;
  margin-right: 5px;
}

.address {
  display: block;
  margin-bottom: 5px;
}

.order-table {
  width: 100%;
}

.order-table table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th,
.order-table td {
  border: 1px solid #e0e0e0;
  padding: 10px 15px;
  text-align: left;
}

.product-td {
  display: flex;
  align-items: center;
}

.product-name {
  margin-left: 10px;
}

.product-desc {
  display: block;
  font-size: 12px;
  color: #757575;
}

.order-note {
  margin-bottom: 15px;
}

.input-count {
  float: right;
  color: #999;
}

.delivery-service {
  margin-bottom: 10px;
  margin-top: 20px;
}

.service-name {
  margin-left: 5px;
}

.service-price {
  float: right;
  color: #ff4500;
}

.return-insurance {
  margin-bottom: 20px;
}

.insurance-desc {
  color: green;
  margin-left: 5px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.price {
  color: #ff4500;
}

.payment-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin-bottom: 15px;
}

.payment-actions {
  text-align: right;
}

.payment-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.alipay-container {
  margin-top: 20px;
  min-height: 600px;
  position: relative;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.address-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  min-height: 44px;
  transition: all 0.3s ease;
}

.address-content {
  margin-right: 60px;
  word-break: break-all;
}

.address-form {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  background-color: #fff;
}

.address-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
}
</style>