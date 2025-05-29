<template>
  <div class="product-detail">
    <!-- 商品主图 -->
    <div class="image-section">
      <img 
        :src="product.image_url || 'https://via.placeholder.com/600x600.png?text=Product+Image'" 
        class="product-image"
        alt="商品主图"
      />
    </div>

    <!-- 商品信息 -->
    <div class="info-section">
      <h1 class="product-name">{{ product.name }}</h1>
      
      <div class="meta-info">
        <el-tag type="info">{{ categoryName }}</el-tag>
        <el-tag v-if="product.isDiscontinued === 1" type="danger" style="margin-left: 8px;">已下架</el-tag>
        <span class="create-time">上架时间：{{ formatTime(product.create_time) }}</span>
      </div>

      <div class="price-stock">
        <div class="price">¥{{ product.price }}</div>
        <div class="stock" :class="stockStatus">
          {{ product.stockStatus }}
        </div>
      </div>

      <el-divider />

      <div class="description">
        <h3>商品描述</h3>
        <p>{{ product.description || '暂无详细描述' }}</p>
      </div>

      <div class="action-bar">
        <el-input-number 
          v-model="quantity"
          :min="1" 
          :max="50"
          size="large"
        />
        <el-button 
          type="primary" 
          size="large"
          :disabled="product.stockStatus == '无库存' || product.isDiscontinued === 1"
          @click="addToCart"
        >
          {{ product.stockStatus == '无库存' ? '已售罄' : (product.isDiscontinued === 1 ? '已下架' : '加入购物车') }}
        </el-button>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="comment-wrapper">
    <div class="comment-section">
  <h2 class="comment-title">商品评价（{{filteredComments.length}}）</h2>
  
  <!-- 评论列表 -->
  <div class="comment-list" v-if="filteredComments.length > 0">
  <div 
    class="comment-item" 
    v-for="comment in filteredComments" 
    :key="comment.commentId"
  >
      <div class="comment-header">
        <img :src="comment.userAvatar || 'https://via.placeholder.com/40x40'" class="avatar">
        <div class="user-info">
          <span class="username">{{ comment.userName }}</span>
          <span class="time">{{ comment.createTime }}</span>
        </div>
        <el-button 
          v-if="comment.canDelete"
          size="mini" 
          type="danger" 
          plain
          @click="deleteComment(comment.commentId)"
          class="delete-btn"
        >
          删除
        </el-button>
      </div>
      <div class="comment-content">{{ comment.comment }}</div>
    </div>
  </div>
  <el-empty v-else description="还没有人评论哦，快来抢沙发吧～"></el-empty>

      <!-- 发表评论 -->
      <div class="comment-form">
        <div class="form-header">发表你的评价</div>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="写下您的真实体验，帮助更多人选购（200字以内）"
          v-model="newComment"
          maxlength="200"
          show-word-limit
          resize="none"
          class="comment-input"
        ></el-input>
        <div class="form-footer">
          <el-button 
            type="primary" 
            @click="submitComment"
            :disabled="!newComment.trim()"
            class="submit-btn"
            size="medium"
          >
            提交评价
          </el-button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      quantity: 1,
      product: {
        // product_id: 101,
        // name: "红富士苹果 5斤装",
        // category: 1,
        // price: 39.8,
        // stock: 15,
        // description: "新鲜红富士苹果，脆甜多汁，产地陕西",
        // image_url: require("@/assets/products/eggs.png"),
        // create_time: "2024-03-20 14:30:00"
      },
      categories: [
        { id: 1, name: "新鲜果蔬" },
        { id: 2, name: "肉禽蛋类" },
        { id: 3, name: "海鲜水产"},
        { id: 4, name: "乳品烘焙" },
        { id: 5, name: "熟食即食" },
        { id: 6, name: "冷冻食品" },
        { id: 7, name: "酒水饮料" },
        { id: 8, name: "休闲零食" },
        { id: 9, name: "粮油调味" },
        { id: 10, name: "日化家居" }
      ],
      comments: [],
      newComment: ''
    }
  },
  computed: {
    // 已通过评论
  filteredComments() {
    return this.comments.filter(c => c.approvalStatus === '已通过')
  },
    categoryName() {
      return this.categories.find(c => c.id === this.product.category)?.name || '未知分类'
    },
    stockStatus() {
      if(this.product.stockStatus == '无库存') return 'out-of-stock'
      return this.product.stockStatus == '库存紧张' ? 'low-stock' : 'in-stock'
    },
    // stockText() {
    //   if(this.product.stock <= 0) return '已售罄'
    //   return this.product.stock < 10 ? `仅剩${this.product.stock}件` : '库存充足'
    // }
  },
  async created() {
  const id = this.$route.params.id;
  
  try {
    // 改为 GET，请求参数通过 params 传递
    const resp = await axios.get('/api/api/product/detail', {
      params: {
        id
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': this.$store.state.UserModules.token
      }
    });
    const item = resp.data.data
    this.product = {
      product_id: item.productId,
      name: item.name,
      category: item.category,
      price: item.price,
      stockStatus: item.stockStatus,
      description: item.description,
      image_url: item.imageUrl,
      create_time: item.createTimeString,
      isDiscontinued: item.isDiscontinued
    }
  } catch (err) {
    this.$message.error('获取商品详情失败')
    console.error(err)
  }
  this.fetchComments();
},
  methods: {
    formatTime(timeStr) {
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },
    async addToCart() {
      try {
        const response = await axios.post('/api/api/cart/add', {
          productId: this.product.product_id,
          num: this.quantity,
          unitPrice:this.product.price
        },
        {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });

        if (response.data.code === 1) {
          this.$message.success('加入购物车成功');
        } else {
          this.$message.error(response.data.message);
        }
      } catch (error) {
        this.$message.error('加入购物车失败');
      }
    },
    
    // 获取评论
    async fetchComments() {
      try {
        const resp = await axios.get('/api/api/comment/comment', {
          params: {
            productId: this.product.product_id
          },
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });
        
        if (resp.data.code === 1) {
          this.comments = resp.data.data;
        }
      } catch (error) {
        this.$message.error('获取评论失败');
        console.error(error);
      }
    },
    
    // 提交评论
    async submitComment() {
      try {
        const resp = await axios.post('/api/api/comment/post', {
          productId: this.product.product_id,
          comment: this.newComment
        }, {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        });
        
        if (resp.data.code === 1) {
          this.$message.success('评论提交成功，等待审核');
          this.newComment = '';
          await this.fetchComments();
        } else {
          this.$message.error(resp.data.msg || '评论提交失败');
        }
      } catch (error) {
        this.$message.error('评论提交失败');
        console.error(error);
      }
    },
    
    // 删除评论
    // 删除评论
async deleteComment(commentId) {
  try {
    // 添加确认对话框
    await this.$confirm('确定要删除这条评论吗？', '删除提示', {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      customClass: 'delete-comfirm-dialog'
    });

    // 用户确认后执行删除
    const resp = await axios.post('/api/api/comment/delete', {
      commentId
    }, {
      headers: {
        'token': this.$store.state.UserModules.token
      }
    });
    
    if (resp.data.code === 1) {
      this.$message.success('评论删除成功');
      await this.fetchComments();
    } else {
      this.$message.error(resp.data.msg || '评论删除失败');
    }
  } catch (error) {
    // 捕获取消操作（error === 'cancel'）和请求错误
    if (error !== 'cancel') {
      this.$message.error('评论删除失败');
      console.error(error);
    }
  }
}
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.image-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.product-image {
  max-width: 100%;
  height: 500px;
  object-fit: contain;
}

.info-section {
  padding: 20px;
}

.product-name {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.create-time {
  color: #666;
  font-size: 14px;
}

.price-stock {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin: 25px 0;
}

.price {
  color: #e4393c;
  font-size: 36px;
  font-weight: 700;
}

.stock {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
}
.stock.in-stock { background: #f0f9eb; color: #67c23a; }
.stock.low-stock { background: #fdf6ec; color: #e6a23c; }
.stock.out-of-stock { background: #fef0f0; color: #f56c6c; }

.description {
  color: #666;
  line-height: 1.6;
  margin: 25px 0;
}
.description h3 {
  color: #333;
  margin-bottom: 10px;
}

.action-bar {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}
.action-bar .el-input-number {
  width: 150px;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 20px;
  }
  
  .product-image {
    height: 300px;
  }
  
  .price {
    font-size: 28px;
  }
  
  .action-bar {
    flex-direction: column;
  }
}
.comment-section {
  margin-top: 40px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.comment-title {
  font-size: 20px;
  color: #303133;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 24px;
}

.comment-item {
  padding: 20px;
  margin-bottom: 20px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}
.comment-item:hover {
  background: #f5f7fa;
  transform: translateX(4px);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.username {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}
.time {
  font-size: 12px;
  color: #909399;
}
.delete-btn {
  margin-left: auto;
  padding: 5px 12px !important;
}

.comment-content {
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
  padding-left: 52px;
}

.comment-form {
  margin-top: 32px;
}
.form-header {
  font-size: 16px;
  color: #303133;
  margin-bottom: 16px;
}
.comment-input {
  border-radius: 8px;
}
.comment-input :deep(.el-textarea__inner) {
  padding: 12px 16px;
  border-color: #e4e7ed;
}
.form-footer {
  margin-top: 16px;
  text-align: right;
}
.submit-btn {
  width: 120px;
  border-radius: 20px;
  font-weight: 500;
}

.el-empty {
  padding: 40px 0;
}

/* 新增外层容器 */
.comment-wrapper {
  grid-column: 1 / -1; /* 跨所有列 */
  margin: 40px auto;
  width: 100%;
  max-width: 1400px; /* 扩大最大宽度 */
}

.comment-section {
  padding: 32px 40px; /* 增加左右内边距 */
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

/* 评论列表滚动条 */
.comment-list {
  max-height: 60vh; /* 可视区域高度60% */
  overflow-y: auto;
  padding-right: 12px; /* 避免滚动条遮挡内容 */
}

/* 美化滚动条 */
.comment-list::-webkit-scrollbar {
  width: 8px;
}
.comment-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
.comment-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
.comment-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 调整评论项间距 */
.comment-item {
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border: 1px solid #eee;
  transition: transform 0.2s;
}
</style>
