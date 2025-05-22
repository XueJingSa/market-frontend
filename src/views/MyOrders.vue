<template>
  <div class="order-list-container">
    <!-- 搜索栏和筛选条件 -->
    <div class="search-filter-bar">
      <el-input v-model="searchKeyword" placeholder="输入商品标题或订单号进行搜索"></el-input>
      <el-button @click="searchOrder">订单搜索</el-button>
    </div>

    <!-- 订单列表 -->
    <el-card v-for="(order, index) in filteredOrders" :key="index" class="order-item">
      <!-- 订单头部信息 -->
      <template #header>
        <div class="order-header">
          <span>{{ formatTime(order.createTime) }}</span>
          <span>订单号: {{ order.orderId }}</span>
          <span>收货地址: {{ order.address }}</span>
        </div>
      </template>
      <!-- 商品信息 -->
      <div class="order-products">
        <div v-for="(product, productIndex) in (isExpanded[index] ? order.orderDetails : [order.orderDetails[0]])"
          :key="productIndex" class="product-item">
          <img :src="product.imageUrl" alt="product" class="product-image" />
          <el-table :data="[{ name: product.productName, price: product.unitPrice, quantity: product.quantity }]" border
            style="width: 100%;">
            <el-table-column label="商品名称" prop="name" align="left"></el-table-column>
            <el-table-column label="单价" align="left">
              <template #default="scope">
                <span>¥{{ scope.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity" align="left"></el-table-column>
          </el-table>
        </div>
        <div class="order-total">
          实付款: ¥{{ order.totalAmount }}
        </div>
        <div class="order-status">
          <span>交易状态: {{ order.status }}</span>
        </div>
        <div class="order-actions">
          <el-button size="mini">申请退款</el-button>
        </div>
      </div>
      <!-- 展开/收起按钮 -->
      <div v-if="order.orderDetails.length > 1" class="expand-collapse-btn">
        <el-button @click="toggleExpand(index)">
          {{ isExpanded[index] ? '收起' : '展开' }}
        </el-button>
      </div>
    </el-card>
    <!-- 分页按钮 -->
    <div class="pagination">
      <el-button @click="prevPage">上一页</el-button>
      <el-button @click="nextPage">下一页</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchKeyword: '',
      orders: [
        {
          "orderId": "251984203822",
          "userId": 1,
          "totalAmount": 20,
          "status": "PAY_WAIT",
          "createTime": 1747882707000,
          "address": null,
          "paymentStatus": false,
          "payUrl": null,
          "payTime": null,
          "orderDetails": [
            {
              "detailId": 1,
              "orderId": "251984203822",
              "productId": 1,
              "quantity": 1,
              "unitPrice": 10,
              "productName": "商品2",
              "imageUrl": "",
              "subTotal": 10
            },
            {
              "detailId": 2,
              "orderId": "251984203822",
              "productId": 1,
              "quantity": 1,
              "unitPrice": 10,
              "productName": "商品2",
              "imageUrl": "",
              "subTotal": 10
            }
          ],
          "statusDesc": "待付款"
        }
      ],
      page: 1,
      pageSize: 10,
      isExpanded: []
    };
  },
  computed: {
    filteredOrders() {
      if (!this.searchKeyword) {
        return this.orders;
      }
      return this.orders.filter((order) => {
        const searchFields = [
          order.orderId,
          ...order.orderDetails.map((product) => product.productName)
        ];
        return searchFields.some((field) =>
          field.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      });
    }
  },
  created() {
    this.fetchOrders();
    // this.orders.forEach(() => {
    //   this.isExpanded.push(false);
    // });
  },
  methods: {
    searchOrder() {
      // 搜索功能在 computed 中已经实现，这里可添加其他逻辑
      console.log('搜索关键词:', this.searchKeyword);
    },
    toggleExpand(index) {
      this.isExpanded[index] = !this.isExpanded[index];
    },
    prevPage() {
      if (this.page > 1) {
        this.page--;
      }
    },
    nextPage() {
      const totalPages = Math.ceil(this.orders.length / this.pageSize);
      if (this.page < totalPages) {
        this.page++;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);

      // 提取年、月、日
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需 +1
      const day = String(date.getDate()).padStart(2, '0');

      // 组合成 YYYY-MM-DD 格式
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate
    },
    async fetchOrders() {
      try {
        this.loading = true;
        const userId = this.$store.state.UserModules.userId;
        const response = await axios.get('/api/api/order/list', {
          params: { userId },
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });
        this.orders = response.data.data || [];

        // 初始化展开状态数组
        this.orders.forEach(() => {
          this.isExpanded.push(false);
        });
      } catch (error) {
        this.$message.error('获取订单列表失败，请稍后重试');
        console.error('获取订单列表失败:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.order-list-container {
  font-family: Arial, sans-serif;
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.search-filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-filter-bar input {
  flex: 1;
  height: 30px;
  padding: 0 5px;
}

.search-filter-bar button {
  height: 34px;
  margin-left: 5px;
}

.more-filter {
  margin-left: 10px;
}

.order-item {
  border: 1px solid #fff;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
}

.order-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.order-header span {
  margin-right: 10px;
}

.order-flag {
  background-color: #ff6600;
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  margin-right: 5px;
}

.order-products {
  display: flex;
  flex-direction: column;
  /* 让商品项垂直排列 */
}

.product-item {
  border: 1px solid #eee;
  /* margin-bottom: 10px; */
  margin: 5px auto;
  padding: 10px;
  width: 100%;
  /* 让商品项占满一行 */
  display: flex;
  align-items: center;
}

.product-image {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.order-total,
.order-status,
.order-actions {
  margin-top: 10px;
  width: 100%;
  /* 让这些元素也占满一行 */
}

.status-operations {
  font-size: 12px;
}

.order-actions {
  margin-top: 10px;
  margin-left: auto;
  text-align: left;
}

.repurchase-btn {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.expand-collapse-btn {
  text-align: right;
  margin-top: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
}
</style>