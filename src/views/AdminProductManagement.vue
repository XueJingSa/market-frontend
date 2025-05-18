<template>
    <div class="admin-product">
      <!-- 搜索和新增 -->
      <div class="toolbar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="名称">
            <el-input v-model="searchForm.name" placeholder="商品名称" style="width: 150px;"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.category" placeholder="请选择分类" style="width: 150px;">
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态"> 
            <el-select v-model="searchForm.isDiscontinued" placeholder="请选择上下架" style="width: 150px;">
              <el-option :label="'上架'" :value="0" />
              <el-option :label="'下架'" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序字段">
            <el-select v-model="searchForm.orderBy" placeholder="选择排序字段" style="width: 120px">
              <el-option label="价格" value="price" />
              <el-option label="库存" value="stock" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序方向">
            <el-select v-model="searchForm.sort" placeholder="选择排序方向" style="width: 120px">
              <el-option label="升序" value="asc" />
              <el-option label="降序" value="desc" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="openDialog()" class="add-btn">添加商品</el-button>
      </div>
  
      <!-- 商品列表 -->
      <el-table :data="tableData" stripe border style="width:100%">
        <el-table-column prop="product_id" label="ID" width="80"/>
        <el-table-column prop="name" label="名称"/>
        <el-table-column prop="category" label="分类" :formatter="formatCategory"/>
        <el-table-column prop="price" label="价格" width="100"/>
        <el-table-column prop="stock" label="库存" width="80"/>
        <el-table-column prop="isDiscontinued" label="状态" width="100" :formatter="formatStatus"/>
        <el-table-column prop="createTime" label="上架时间" width="180"/>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="warn" @click="toggleStatus(row)">{{ row.isDiscontinued===0 ? '下架' : '上架' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="onPageChange"
        :current-page="page"
      />
  
      <!-- 新增/编辑 对话框 -->
      <el-dialog :title="dialogTitle" v-model="dialogVisible">
        <el-form :model="form" label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="form.category" placeholder="请选择分类">
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-input-number v-model="form.price" :min="0" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input-number v-model="form.stock" :min="0" />
          </el-form-item>
          <!-- <el-form-item label="单位">
            <el-input v-model="form.unit" />
          </el-form-item> -->
          <el-form-item label="图片URL">
            <el-input v-model="form.imageUrl" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.description" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        // 列表数据
        tableData: [], total: 0, page: 1, pageSize: 10,
        isSearching: false, // 标记是否在搜索状态
        // 搜索表单
        searchForm: { 
          name: '', 
          category: null, 
          isDiscontinued: null,
          orderBy: null,
          sort: null
        },
        // 分类静态
        categories: [
          { id: 1, name: '新鲜果蔬' },{ id: 2, name: '肉禽蛋类' },
          { id: 3, name: '海鲜水产' },{ id: 4, name: '乳品烘焙' },
          { id: 5, name: '熟食即食' },{ id: 6, name: '冷冻食品' },
          { id: 7, name: '酒水饮料' },{ id: 8, name: '休闲零食' },
          { id: 9, name: '粮油调味' },{ id:10, name: '日化家居' }
        ],
        // 对话框
        dialogVisible: false,
        isEdit: false,
        form: {
          product_id: null, name:'', category:null, price:0, stock:0,
          unit:'', imageUrl:'', description:'', isDiscontinued:0, createTime:''
        }
      }
    },
    mounted() {
      this.onSearch()
    },
    methods: {
      formatCategory(row) {
        const cat = this.categories.find(c=>c.id===row.category)
        return cat? cat.name : '-'
      },
      formatStatus(row) {
        return row.isDiscontinued===0? '已上架':'已下架'
      },
      // 拉列表
      async fetchList() {
        try {
          const resp = await axios.get('/api/api/product/admin/getAll', {
            params: {
              page: this.page,
              pageSize: this.pageSize
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': this.$store.state.UserModules.token
            }
          })
          if(resp.data.code === 1) {
            this.tableData = resp.data.data.records.map(item => ({
              ...item,
              product_id: item.productId, // 统一字段名
              createTime: item.createTime || ''
            }))
            this.total = resp.data.data.total
          } else {
            this.$message.error(resp.data.msg || '获取商品列表失败')
          }
        } catch (error) {
          this.$message.error('请求失败，请稍后重试')
          console.error('获取商品列表失败:', error)
        }
      },
      onPageChange(p) {
        this.page = p;
          this.onSearch();

      },
      async onSearch() {
        try {
          const params = {
            page: this.page,
            pageSize: this.pageSize,
            name: this.searchForm.name,
            category: this.searchForm.category,
            isDiscontinued: this.searchForm.isDiscontinued
          };
          // 添加排序参数（当两个选项都选择时）
          if (this.searchForm.orderBy && this.searchForm.sort) {
            params.orderBy = this.searchForm.orderBy;
            params.sort = this.searchForm.sort;
          }
          const resp = await axios.get('/api/api/product/admin/search', {
            params,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': this.$store.state.UserModules.token
            }
          });
          if(resp.data.code === 1) {
            this.tableData = resp.data.data.records.map(item => ({
              ...item,
              product_id: item.productId,
              createTime: item.createTime || ''
            }));
            this.total = resp.data.data.total;
          } else {
            this.$message.error(resp.data.msg || '搜索失败');
          }
        } catch (error) {
          this.$message.error('搜索请求失败');
          console.error('搜索商品失败:', error);
        }
      },
      onReset() {
        this.searchForm = { 
          name: '', 
          category: null, 
          isDiscontinued: null,
          orderBy: null,
          sort: null
        }
        this.fetchList()
      },
      openDialog(row) {
        if(row) {
          this.isEdit=true
          this.form = {
            productId: row?.product_id || null,
            name: '',
            category: null,
            price: null,
            stock: null,
            imageUrl: '',
            description: '',
            isDiscontinued: null
          };
        } else {
          this.isEdit=false
          this.form = { product_id:null, name:'', category:null, price:0, stock:0, unit:'', imageUrl:'', description:'', isDiscontinued:0 }
        }
        this.dialogTitle = this.isEdit ? '修改商品' : '添加商品';
        this.dialogVisible = true
      },
      async onSubmit() {
        try {
          let payload = {};
          if (!this.isEdit) {
              payload = {
              category: this.form.category,
              description: this.form.description,
              imageUrl: this.form.imageUrl,
              name: this.form.name,
              price: this.form.price,
              stock: this.form.stock,
              isDiscontinued: 0
            }
          }
          else{
            payload.productId = this.form.productId;
            if (this.form.name)           payload.name = this.form.name;
            if (this.form.category !== null) payload.category = this.form.category;
            if (this.form.price !== null)  payload.price = this.form.price;
            if (this.form.stock !== null)  payload.stock = this.form.stock;
            if (this.form.imageUrl)       payload.imageUrl = this.form.imageUrl;
            if (this.form.description)    payload.description = this.form.description;
            // if (this.form.isDiscontinued !== null) payload.isDiscontinued = this.form.isDiscontinued;
          }
          // const payload = {
          //   category: this.form.category,
          //   description: this.form.description,
          //   imageUrl: this.form.imageUrl,
          //   name: this.form.name,
          //   price: this.form.price,
          //   productId: this.form.product_id,
          //   stock: this.form.stock,
          //   isDiscontinued: 0
          // }
          
          const endpoint = this.isEdit 
            ? '/api/api/product/updateProduct' 
            : '/api/api/product/addProduct'
            
          const resp = await axios.post(endpoint, payload, {
            headers: {
              'Content-Type': 'application/json',
              'token': this.$store.state.UserModules.token
            }
          })
          
          if(resp.data.code === 1) {
            this.$message.success(this.isEdit ? '修改成功' : '添加成功')
            this.dialogVisible = false
            this.onSearch()
          } else {
            this.$message.error(resp.data.msg || (this.isEdit ? '修改失败' : '添加失败'))
          }
        } catch (error) {
          this.$message.error(this.isEdit ? '修改失败' : '添加失败')
          console.error('操作失败:', error)
        }
      },
      async toggleStatus(row) {
        try {
          const isDiscontinued = row.isDiscontinued === 0 ? 1 : 0
          const endpoint = isDiscontinued === 0 ? '/api/api/product/listProduct' : '/api/api/product/removeProduct'
          
          const resp = await axios.post(endpoint, null, {
            params: {
              productId: row.product_id
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'token': this.$store.state.UserModules.token
            }
          })
          
          if(resp.data.code === 1) {
            row.isDiscontinued = isDiscontinued
            this.$message.success(isDiscontinued === 0 ? '商品已上架' : '商品已下架')
            this.onSearch()
          } else {
            this.$message.error(resp.data.msg || (isDiscontinued === 0 ? '上架失败' : '下架失败'))
          }
        } catch (error) {
          this.$message.error('操作失败')
          console.error('商品状态更新失败:', error)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-product { padding:20px; }
  .toolbar { display:flex; justify-content:space-between; margin-bottom:16px; }
  .search-form .el-form-item { margin-right:12px; }
  .add-btn { }
  .pagination { margin-top:16px; text-align:right; }
  </style>
