<template>
  <div class="my-order-container">
    <div class="user-info">
      <el-avatar :size="80" :src="avatarUrl ? avatarUrl : avatars[0]" @click="triggerFileInput"
        style="cursor: pointer;" />
      <!-- file input -->
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" accept="image/*" />
      <div class="user-details">
        <div v-if="isLoggedIn" class="nickname">{{ this.$store.state.UserModules.userName }}</div>
        <router-link v-else to="/login" class="login-text">登录</router-link>
        <div v-if="isLoggedIn" class="address-section">
          <span @click="openAddressDialog">收货地址</span>
          <el-dialog v-model="showAddressDialog" title="修改收货地址">
            <el-input v-model="tempAddress" placeholder="请输入新地址" type="textarea" :rows="3" />
            <div class="dialog-actions" style="margin-top: 15px;">
              <el-button @click="showAddressDialog = false">取消</el-button>
              <el-button type="primary" @click="saveAddress">保存修改</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div v-if="isLoggedIn" class="order-summary">
      <router-link to="/orders" class="order-title">
        <h2>我的订单</h2>
      </router-link>
      <div class="order-status">
        <div class="status-item">
          <span class="count">{{ unpaidCount }}</span>
          <p>待付款</p>
        </div>
        <div class="status-item">
          <span class="count">{{ paidCount }}</span>
          <p>已支付</p>
        </div>
        <div class="status-item">
          <span class="count">{{ completeCount }}</span>
          <p>已完成</p>
        </div>
        <div class="status-item">
          <span class="count">{{ refundCount }}</span>
          <p>退款/售后</p>
        </div>
      </div>
    </div>
    <div v-if="isLoggedIn" class="order-summary">
      <h2>订单统计</h2>
      <div class="order-stats">
        <div class="chart-container">
          <h3>月度订单统计</h3>
          <div ref="monthlyChart" style="width: 100%; height: 300px;"></div>
        </div>

        <div class="chart-container">
          <h3>商品类别分布</h3>
          <div ref="categoryChart" style="width: 100%; height: 300px;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElAvatar, ElInput } from 'element-plus';
import * as echarts from 'echarts';
import { callSuccess, callError } from '@/api/index';
import axios from 'axios';
export default {
  components: {
    ElAvatar,
    ElInput
  },
  data() {
    return {
      // 模拟用户信息和订单状态数据
      isLoggedIn: true,
      address: '',
      avatarUrl: '',
      unpaidCount: 0,
      paidCount: 0,
      completeCount: 0,
      refundCount: 0,
      showAddressDialog: false,
      tempAddress: '',
      avatars: [
        require('@/assets/images/avatar1.png'),
        require('@/assets/images/avatar2.png'),
        require('@/assets/images/avatar3.png'),
        require('@/assets/images/avatar4.png')
      ],
      monthlyChart: null,
      categoryChart: null,
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
              "subTotal": 10,
              "category": 2,
            },
            {
              "detailId": 2,
              "orderId": "251984203822",
              "productId": 1,
              "quantity": 1,
              "unitPrice": 10,
              "productName": "商品2",
              "imageUrl": "",
              "subTotal": 10,
              "category": 1,
            }
          ],
          "statusDesc": "待付款"
        }
      ],
    };
  },
  // mounted() {

  // },
  methods: {

    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 处理文件上传
    async handleFileUpload(event) {
      const file = event.target.files[0]; // 获取选中的文件
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        callError('请选择图片文件！');
        return;
      }

      // 显示预览（可选）
      this.avatarUrl = URL.createObjectURL(file);

      // 构造 FormData
      const formData = new FormData();
      formData.append('file', file); // 参数名必须和后台一致（这里是 'file'）

      try {
        // 调用上传接口
        const response = await axios.post('/api/api/user/avatar/upload', formData, {
          headers: {
            'token': this.$store.state.UserModules.token
          },
        });
        console.log(response.data)
        if (response.data.code === 1) {
          callSuccess('头像上传成功！');
          this.avatarUrl = response.data.data;
        } else {
          callError(response.data.message || '上传失败');
        }
      } catch (error) {
        callError('上传失败，请重试');
        console.error('上传错误:', error);
      } finally {
        event.target.value = '';
      }
    },
    initCharts() {
      // 初始化月度订单柱状图
      this.monthlyChart = echarts.init(this.$refs.monthlyChart);
      this.updateMonthlyChart();

      // 初始化商品类别饼图
      this.categoryChart = echarts.init(this.$refs.categoryChart);
      this.updateCategoryChart();
    },

    updateMonthlyChart() {
      // 按月份统计订单量
      const monthCount = {};
      const months = []; // 用于保存已排序的月份

      this.orders.forEach(order => {
        const month = order.createTime.substring(0, 7); // 提取年月部分
        if (!monthCount[month]) {
          monthCount[month] = 0;
          months.push(month);
        }
        monthCount[month]++;
      });

      // 对月份进行排序
      months.sort();
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '订单量'
        },
        series: [{
          data: months.map(month => monthCount[month]),
          type: 'bar',
          itemStyle: {
            color: '#409EFF'
          },
          label: {
            show: true,
            position: 'top'
          }
        }]
      };

      this.monthlyChart.setOption(option);
    },
    updateCategoryChart() {
      // 统计各商品类别的数量
      const categoryCount = {};
      this.orders.forEach(order => {
        order.orderDetails.forEach(product => {
          categoryCount[product.category] = (categoryCount[product.category] || 0) + product.quantity;
        });
      });

      // 类别名称
      const categoryNames = {
        1: '新鲜果蔬',
        2: '肉禽蛋类',
        3: '海鲜水产',
        4: '乳品烘焙',
        5: '熟食即食',
        6: '冷冻食品',
        7: '酒水饮料',
        8: '休闲零食',
        9: '粮油调味',
        10: '日化家居',
      };

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: Object.keys(categoryCount).map(key => categoryNames[key] || `类别 ${key}`)
        },
        series: [
          {
            name: '商品类别',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: Object.entries(categoryCount).map(([key, value]) => ({
              value,
              name: categoryNames[key] || `类别 ${key}`
            })),
            color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
          }
        ]
      };
      this.categoryChart.setOption(option);
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
    updateOrderStatusCounts() {
      // 遍历订单数组统计状态
      console.log(this.orders);
      this.orders.forEach(order => {
        switch (order.status) {
          case 'PAY_WAIT':
            this.unpaidCount++;
            break;
          case 'PAY_SUCCESS':
            this.paidCount++;
            break;
          case 'DEAL_DONE':
            this.completeCount++;
            break;
          default:
            console.warn('未知订单状态:', order.status);
        }
      });
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
        console.log(this.orders)

        callSuccess('获取订单成功')
        // 移进去
        this.formatOrdersTime();
        this.updateOrderStatusCounts();

        this.initCharts();
      } catch (error) {
        callError('获取订单列表失败，请稍后重试');
        console.error('获取订单列表失败:', error);
      } finally {
        this.loading = false;
      }
    },
    formatOrdersTime() {
      this.orders = this.orders.map(order => ({
        ...order,
        createTime: this.formatTime(order.createTime) // 格式化时间戳
      }));
    },

    openAddressDialog() { // 重命名方法，避免与 data 属性冲突
      this.tempAddress = this.address || '';
      this.showAddressDialog = true;
    },

    // 保存地址修改
    saveAddress() {
      if (!this.tempAddress.trim()) {
        this.$message.warning('地址不能为空');
        return;
      }
      this.address = this.tempAddress;
      this.updateAddr();

      this.showAddressDialog = false;
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
        callSuccess('更新地址成功');
      } catch (error) {
        callError('更新地址失败，请稍后重试');
        console.error('更新地址失败:', error);
      }
    },
  },
  watch: {
    orders: {
      handler() {
        if (this.monthlyChart && this.categoryChart) {
          this.updateMonthlyChart();
          this.updateCategoryChart();
        }
      },
      deep: true
    }
  },
  beforeUnmount() {
    if (this.monthlyChart) {
      this.monthlyChart.dispose();
    }
    if (this.categoryChart) {
      this.categoryChart.dispose();
    }
  },
  created() {
    if (!this.$store.state.UserModules.token) {
      // 跳转到登录页面
      this.$router.push('/login');
      return;
    }
    console.log(this.$store.state.UserModules.userName);
    this.address = this.$store.state.UserModules.userAddr;
    console.log(this.address);
    this.fetchOrders();
  },

};
</script>

<style scoped>
.my-order-container {
  width: 1000px;
  margin: 20px auto;
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-title {
  display: inline-block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.order-title h2 {
  display: inline-block;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 5px;
  margin-bottom: 15px;
}

.order-title:hover h2 {
  border-bottom-color: #e4e7ed;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left: 20px;
}

.user-details {
  margin-left: 30px;
}

.nickname {
  font-size: 20px;
  margin-bottom: 5px;
}

.login-text {
  color: #409EFF;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

.login-text:hover {
  text-decoration: underline;
}


.user-id {
  color: #666;
  margin-bottom: 5px;
}

.address-section {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}

.existing-address {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.order-summary {
  margin-top: 20px;
}

.order-status {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.status-item {
  text-align: center;
}

.count {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
</style>