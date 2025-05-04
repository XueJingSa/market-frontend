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
          <span>{{ order.date }}</span>
          <span>订单号: {{ order.orderNumber }}</span>
          <span>收货地址: {{ order.address }}</span>
        </div>
      </template>
      <!-- 商品信息 -->
      <div class="order-products">
        <div v-for="(product, productIndex) in (isExpanded[index] ? order.products : [order.products[0]])"
          :key="productIndex" class="product-item">
          <img :src="product.image" alt="product" class="product-image" />
          <el-table
            :data="[{ name: product.name, price: product.price, originalPrice: product.originalPrice, quantity: product.quantity }]"
            border style="width: 100%;">
            <el-table-column label="商品名称" prop="name" align="left"></el-table-column>
            <el-table-column label="单价" align="left">
              <template #default="scope">
                <span>¥{{ scope.row.price }}</span>
                <span style="color: #999; text-decoration: line-through; margin-left: 4px;">¥{{ scope.row.originalPrice
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="quantity" align="left"></el-table-column>
          </el-table>
        </div>
        <div class="order-total">
          实付款: ¥{{ order.totalPrice }} (含运费: ¥{{ order.shippingFee }})
        </div>
        <div class="order-status">
          <span>交易状态: {{ order.status }}</span>
        </div>
        <div class="order-actions">
          <el-button size="mini">申请退款</el-button>
        </div>
      </div>
      <!-- 展开/收起按钮 -->
      <div v-if="order.products.length > 1" class="expand-collapse-btn">
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
export default {
  data() {
    return {
      searchKeyword: '',
      orders: [
        {
          date: '2025-05-04',
          orderNumber: '4324793401278053717',
          address: '北京市朝阳区 XX 路 XX 号',
          products: [
            {
              image: require('@/assets/images/bread.jpg'),
              name: '防染色吸色护色吸色片',
              originalPrice: 54.00,
              price: 24.90,
              quantity: 1
            }
          ],
          totalPrice: 19.90,
          shippingFee: 0.00,
          status: '买家已付款',
          repurchase: false
        },
        {
          date: '2025-05-04',
          orderNumber: '4324721905719053717',
          address: '上海市浦东新区 XX 街道 XX 小区',
          products: [
            {
              image: require('@/assets/images/bread.jpg'),
              name: 'Word 排版表格代做制作文档格式修改打字服务文字录入 PDF 转换编辑',
              originalPrice: 10.00,
              price: 5.00,
              quantity: 6
            },
            {
              image: require('@/assets/images/bread.jpg'),
              name: '【活动价】Word 排版格式修改生成目录页眉页脚页码整篇排版字体段落人工服务 [交易快照]',
              originalPrice: 10.00,
              price: 5.00,
              quantity: 1
            }
          ],
          totalPrice: 28.00,
          shippingFee: 0.00,
          status: '买家已付款',
          repurchase: true
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
          order.orderNumber,
          ...order.products.map((product) => product.name)
        ];
        return searchFields.some((field) =>
          field.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      });
    }
  },
  created() {
    this.orders.forEach(() => {
      this.isExpanded.push(false);
    });
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