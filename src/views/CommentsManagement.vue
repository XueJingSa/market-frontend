<template>
  <div class="comments-management">
    <h2>评论管理</h2>
    
    <!-- 评论列表 -->
    <el-table :data="comments" stripe border style="width:100%">
      <el-table-column prop="commentId" label="ID" width="80"/>
      <el-table-column prop="productId" label="商品ID" width="100"/>
      <el-table-column prop="userName" label="用户" width="120"/>
      <el-table-column prop="comment" label="评论内容"/>
      <el-table-column prop="createTime" label="时间" width="180"/>
      <el-table-column prop="approvalStatus" label="状态" width="120">
        <template #default="{row}">
          <el-tag :type="getStatusType(row.isApproved)">
            {{ row.approvalStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <div style="display: flex; gap: 8px;">
            <el-button 
              v-if="row.isApproved === 0"
              size="small" 
              type="success"
              @click="approveComment(row.commentId, 1)"
            >
              通过
            </el-button>
            <el-button 
              v-if="row.isApproved === 0"
              size="small" 
              type="warning"
              @click="approveComment(row.commentId, 0)"
            >
              拒绝
            </el-button>
            <el-button 
              size="small" 
              type="danger"
              @click="deleteComment(row.commentId)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      comments: []
    }
  },
  async created() {
    await this.fetchComments()
  },
  methods: {
    async fetchComments() {
      try {
        const resp = await axios.get('/api/api/comment/admin/all', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': this.$store.state.UserModules.token
          }
        })
        
        if(resp.data.code === 1) {
          this.comments = resp.data.data
        } else {
          this.$message.error(resp.data.msg || '获取评论失败')
        }
      } catch (error) {
        this.$message.error('获取评论失败')
        console.error(error)
      }
    },
    
    getStatusType(isApproved) {
      return isApproved === 1 ? 'success' : isApproved === 0 ? 'warning' : 'info'
    },
    
    async approveComment(commentId, isApproved) {
      try {
        const resp = await axios.post('/api/api/comment/censor', {
          commentId,
          isApproved
        }, {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        })
        
        if(resp.data.code === 1) {
          this.$message.success('审核操作成功')
          await this.fetchComments()
        } else {
          this.$message.error(resp.data.msg || '审核操作失败')
        }
      } catch (error) {
        this.$message.error('审核操作失败')
        console.error(error)
      }
    },
    
    async deleteComment(commentId) {
      try {
        const resp = await axios.post('/api/api/comment/delete', {
          commentId
        }, {
          headers: {
            'token': this.$store.state.UserModules.token
          }
        })
        
        if(resp.data.code === 1) {
          this.$message.success('删除评论成功')
          await this.fetchComments()
        } else {
          this.$message.error(resp.data.msg || '删除评论失败')
        }
      } catch (error) {
        this.$message.error('删除评论失败')
        console.error(error)
      }
    }
  }
}
</script>

<style scoped>
.comments-management {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}
</style>
