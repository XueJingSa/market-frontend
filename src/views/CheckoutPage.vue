<template>
  <div class="container">
    <h1 class="order-title">提交订单</h1>
    <!-- 确认收货地址部分 -->
    <div class="address-section">
      <h3 class="section-title">确认收货地址</h3>
      <div class="address-list">
        <el-select v-model="selectedAddress" placeholder="请选择收货地址">
          <el-option v-for="(address, index) in addressList" :key="index"
            :label="`${address.address} - ${address.contactName} ${address.contactPhone}`" :value="address" />
        </el-select>
      </div>
    </div>
    <!-- 确认订单信息部分 -->
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
                <img :src="product.image" alt="product" width="50">
                <span class="product-name">{{ product.name }}</span>
              </td>
              <td>{{ categoryList[product.attr] }}</td>
              <td>¥{{ product.price }}</td>
              <td>
                <el-button size="small" @click="decreaseQuantity(index)">-</el-button>
                <span style="margin: 0 5px;">{{ product.quantity }}</span>
                <el-button size="small" @click="increaseQuantity(index)">+</el-button>
              </td>
              <td>¥{{ (product.price * product.quantity).toFixed(2) }}</td>
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
      <div class="return-insurance">
        <el-checkbox v-model="isReturnInsurance">退货宝</el-checkbox>
        <span v-if="isReturnInsurance" class="insurance-desc">免费</span>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import 'element-plus/dist/index.css';
const selectedAddress = ref(null)
// 模拟收货地址列表
const addressList = ref([
  {
    address: '北京 北京市 海淀区 花园路街道 海淀区花园路街道37号北京航空航天...',
    contactName: '林艺涵',
    contactPhone: '18518559617'
  },
  {
    address: '广东省 广州市 番禺区 小谷围街道 华南理工大学大学城校区',
    contactName: '李思颖',
    contactPhone: '18500638009'
  },
  {
    address: '北京 北京市 朝阳区 来广营镇 清苑路 华贸城8号院5号楼三单元3...',
    contactName: '林艺涵',
    contactPhone: '18518559617'
  }
])

// 模拟商品列表
const products = ref([
  {
    image: '@/assets/images/bread.jpg',
    name: '马来西亚oldtown老街场旧街场白咖啡榛果味经典原味',
    attr: 1,
    price: 40.8,
    quantity: 1,
  },
  {
    image: '@/assets/images/bread.jpg',
    name: '马来西亚oldtown老街场旧街场白咖啡榛果味经典原味',
    attr: 2,
    price: 40.8,
    quantity: 3,
  }
])

const categoryList = [
  '新鲜果蔬',
  '肉禽蛋类',
  '海鲜水产',
  '乳品烘焙',
  '熟食即食',
  '冷冻食品',
  '酒水饮料',
  '休闲零食',
  '粮油调味',
  '日化家居']

// 订单备注
const orderNote = ref('')
// 配送服务
const deliveryService = ref({
  name: '快递 包邮',
  price: 0
})
// 是否购买退货宝
const isReturnInsurance = ref(true)

// 减少商品数量
const decreaseQuantity = (index) => {
  if (products.value[index].quantity > 1) {
    products.value[index].quantity--
  }
}
// 增加商品数量
const increaseQuantity = (index) => {
  products.value[index].quantity++
}

// 计算商品总价
const totalProductPrice = computed(() => {
  return products.value.reduce((acc, product) => acc + (product.price * product.quantity), 0)
})
// 计算总费用
const totalCost = computed(() => {
  return totalProductPrice.value + deliveryService.value.price
})
// 返回上一页
const goBack = () => {
  console.log('返回上一页')
}
// 提交订单
const submitOrder = () => {
  console.log('提交订单')
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
</style>