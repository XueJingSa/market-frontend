<template>
  <div class="my-order-container">
    <div class="user-info">
      <el-avatar :size="80" :src="avatars[0]" @click="triggerFileInput" style="cursor: pointer;" />
      <!-- file input -->
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" accept="image/*" />
      <div class="user-details">
        <div v-if="isLoggedIn" class="nickname">{{ this.$store.state.UserModules.userName }}</div>
        <router-link v-else to="/login" class="login-text">登录</router-link>
        <div v-if="isLoggedIn" class="address-section">
          <span @click="showAddressDialog = true">收货地址</span>
          <el-dialog v-model="showAddressDialog" title="管理收货地址">
            <div v-for="(addr, index) in addresses" :key="index" class="existing-address">
              {{ addr }}
            </div>
            <el-input v-model="newAddress" placeholder="请输入新地址" />
            <el-button type="primary" @click="addAddress" style="margin-top: 15px;">添加新地址</el-button>
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
      paidCount: 1,
      completeCount: 1,
      refundCount: 0,
      showAddressDialog: false,
      addresses: ['地址1'],
      newAddress: '',
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
          date: '2025-05-04',
          orderNumber: '4324793401278053717',
          address: '北京市朝阳区 XX 路 XX 号',
          products: [
            {
              image: require('@/assets/images/bread.jpg'),
              name: '防染色吸色护色吸色片',
              originalPrice: 54.00,
              price: 24.90,
              quantity: 1,
              category: 1,
            }
          ],
          totalPrice: 19.90,
          shippingFee: 0.00,
          status: '买家已付款',
        },
        {
          date: '2025-04-04',
          orderNumber: '4324793401278053717',
          address: '北京市朝阳区 XX 路 XX 号',
          products: [
            {
              image: require('@/assets/images/bread.jpg'),
              name: '防染色吸色护色吸色片',
              originalPrice: 54.00,
              price: 24.90,
              quantity: 1,
              category: 1,
            }
          ],
          totalPrice: 19.90,
          shippingFee: 0.00,
          status: '买家已付款',
        },
        {
          date: '2025-03-04',
          orderNumber: '4324793401278053717',
          address: '北京市朝阳区 XX 路 XX 号',
          products: [
            {
              image: require('@/assets/images/bread.jpg'),
              name: '防染色吸色护色吸色片',
              originalPrice: 54.00,
              price: 24.90,
              quantity: 1,
              category: 1,
            }
          ],
          totalPrice: 19.90,
          shippingFee: 0.00,
          status: '买家已付款',
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
              quantity: 6,
              category: 2,
            },
            {
              image: require('@/assets/images/bread.jpg'),
              name: '【活动价】Word 排版格式修改生成目录页眉页脚页码整篇排版字体段落人工服务 [交易快照]',
              originalPrice: 10.00,
              price: 5.00,
              quantity: 1,
              category: 3,
            }
          ],
          totalPrice: 28.00,
          shippingFee: 0.00,
          status: '买家已付款',
        }
      ],
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    async addAddress() {
      if (this.newAddress.trim() !== '') {
        this.addresses.push(this.newAddress);
        const response = await axios.post('/api/user/update', {
          address: this.newAddress,
          userId: this.$store.state.UserModules.userId
        });
        if (response.data.code != 1) {
          callError(response.data.message || '添加失败');
        }
        this.newAddress = '';
      }
    },
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
        const response = await axios.post('/api/user/avatar/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.code === 1) {
          callSuccess('头像上传成功！');
          this.avatarUrl = response.data.data.url;
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
        const month = order.date.substring(0, 7); // 提取年月部分
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
        order.products.forEach(product => {
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
    }
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
  }
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