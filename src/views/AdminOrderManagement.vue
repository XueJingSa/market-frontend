<template>
  <div class="admin-order">
    <!-- 工具栏 -->
    <div class="toolbar" style="width: 100%">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderId" placeholder="订单号" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.userId" placeholder="用户ID" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="待支付" value="0" />
            <el-option label="已支付" value="1" />
            <el-option label="已完成" value="2" />
            <el-option label="已取消" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table :data="orders" :fit="true" stripe border style="width: 100%" row-key="orderId">
      <el-table-column prop="orderId" label="订单号" min-width="180" />
      <el-table-column prop="userId" label="用户ID" min-width="100" />
      <el-table-column prop="totalAmount" label="总金额" min-width="100" />
      <el-table-column prop="statusDesc" label="状态" min-width="100" />
      <el-table-column prop="createTime" label="创建时间" min-width="180" :formatter="formatTime" />
      <el-table-column prop="payTime" label="支付时间" min-width="180" :formatter="formatTime" />
      <!-- <el-table-column prop="paymentStatus" label="是否支付" min-width="100">
        <template #default="{ row }">
          <span>{{ getOrderStatusText(row.status) }}</span>
        </template>
</el-table-column> -->
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button v-if="row.status == 'PAY_WAIT'" type="danger" size="small" @click="cancelOrder(row.orderId)">
            取消订单
          </el-button>
          <el-button v-if="row.status == 'PAY_SUCCESS'" type="danger" size="small" @click="refundOrder(row.orderId)">
            退款
          </el-button>
        </template>
      </el-table-column>
      <!-- 展开订单详情 -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-table :data="row.orderDetails" border size="small" style="width: 100%;">
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="unitPrice" label="单价" width="80" />
            <el-table-column prop="subTotal" label="小计" width="80" />
          </el-table>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination class="pagination" background layout="total, prev, pager, next" :total="total" :page-size="pageSize"
      @current-change="onPageChange" :current-page="page" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      orders: [],
      allOrders: [],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      searchForm: {
        orderId: '',
        userId: '',
        status: ''
      }
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    formatTime(row, column, cellValue) {
      if (!cellValue) return '-'
      const date = new Date(cellValue)
      return date.toLocaleString()
    },
    async fetchOrders() {
      try {
        this.loading = true
        const response = await axios.get('/api/api/statistics/all', {
          headers: {
            token: this.$store.state.UserModules.token
          }
        })
        let data = response.data.data || []
        console.log(data)
        const statusMap = {
          'PAY_WAIT': '待支付',
          'PAY_SUCCESS': '已支付',
          'DEAL_DONE': '已完成',
          'CLOSE': '已取消',
        };

        data = data.map(order => ({
          ...order,
          statusDesc: statusMap[order.status] || '未知状态'
        }))

        this.allOrders = data
        this.allOrders.sort((a, b) => b.createTime - a.createTime);
        this.applyFilters()
      } catch (err) {
        console.error('订单获取失败:', err)
        this.$message.error('获取订单失败')
      } finally {
        this.loading = false
      }
    },
    getOrderStatusText(status) {
      const statusMap = {
        'PAY_WAIT': '待支付',
        'PAY_SUCCESS': '已支付',
        'DEAL_DONE': '已完成',
        'CLOSE': '已取消',
      };
      return statusMap[status] || status;
    },
    applyFilters() {
      let filtered = [...this.allOrders]
      const statusMap = {
        0: 'PAY_WAIT',
        1: 'PAY_SUCCESS',
        2: 'DEAL_DONE',
        3: 'CLOSE',
      };
      // const status = ['待支付', '已支付', '已完成', '已取消'];
      if (this.searchForm.orderId) {
        filtered = filtered.filter(o => o.orderId.includes(this.searchForm.orderId))
      }
      if (this.searchForm.userId) {
        filtered = filtered.filter(o => o.userId.toString() === this.searchForm.userId.toString())
      }
      console.log(statusMap[this.searchForm.status])
      if (this.searchForm.status !== '') {
        filtered = filtered.filter(o => String(o.status) === statusMap[this.searchForm.status])
      }

      this.total = filtered.length
      const start = (this.page - 1) * this.pageSize
      const end = start + this.pageSize
      this.orders = filtered.slice(start, end)
    },
    async cancelOrder(id) {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        console.log(this.$store.state.UserModules.token)
        const response = await axios.post(
          '/api/api/order/cancel',
          { orderId: String(id) },
          {
            headers: {
              'token': this.$store.state.UserModules.token,
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        );
        console.log(response.data)
        this.$message.success('订单已取消')
        this.fetchOrders()
      } catch (err) {
        if (err !== 'cancel') {
          this.$message.error('取消失败，请稍后再试')
          console.error('取消订单失败:', err)
        }
      }
    },
    async refundOrder(id) {
      try {
        await this.$confirm('确定要申请退款吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        console.log(this.$store.state.UserModules.token)
        const response = await axios.post(
          '/api/api/order/refund',
          { orderId: String(id) },
          {
            headers: {
              'token': this.$store.state.UserModules.token,
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        );
        console.log(response.data)
        this.$message.success('订单已退款')
        this.fetchOrders()
      } catch (err) {
        if (err !== 'cancel') {
          this.$message.error('退款失败，请稍后再试')
          console.error('退款失败:', err)
        }
      }
    },
    onSearch() {
      this.page = 1
      this.applyFilters()
    },
    onReset() {
      this.searchForm = { orderId: '', userId: '', status: '' }
      this.page = 1
      this.applyFilters()
    },
    onPageChange(p) {
      this.page = p
      this.applyFilters()
    }
  }
}
</script>

<style scoped>
.admin-order {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.search-form .el-form-item {
  margin-right: 12px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
