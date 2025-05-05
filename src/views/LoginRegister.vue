<template>
  <div class="login-page">
    <div class="main-content">
      <div class="avatar-section">
        <el-card style="width: 400px;height: 350px;margin-left: 30px;">
          <template #header>
            <div style="font-size: 22px; text-align: center;">选择头像</div>
          </template>
          <!-- 默认显示的大头像 -->
          <div style="text-align: center; margin-bottom: 20px;margin-top: 30px;">
            <el-avatar :src="selectedAvatar || avatars[0]" :size="100" @click="dialogVisible = true"
              style="cursor: pointer;" />
          </div>

          <!-- 头像选择对话框 -->
          <el-dialog v-model="dialogVisible" title="选择头像" width="30%" :before-close="handleClose">
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
              <el-avatar v-for="(avatar, index) in avatars" :key="index" :src="avatar" :size="60"
                @click="handleAvatarSelect(avatar)" style="cursor: pointer; margin: 10px;" />
            </div>
            <template #footer>
              <el-button @click="dialogVisible = false">取消</el-button>
            </template>
          </el-dialog>

          <div style="text-align: center;">注册可选头像</div>
        </el-card>
      </div>
      <div class="login-register-section">
        <el-card style="width: 400px;height: 350px;margin-right: 20px;">
          <el-tabs v-model="activeTab" class="custom-tabs">
            <el-tab-pane label="登录" name="login" class="custom-tab-pane">
              <el-form label-width="0px">
                <el-form-item>
                  <el-input placeholder="账号名" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input type="password" placeholder="请输入登录密码" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 10px;">
                  <el-button type="primary" style="width: 100%;height: 40px;">登录</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register" class="custom-tab-pane">
              <el-form label-width="0px">
                <el-form-item>
                  <el-input placeholder="账号名" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input type="password" placeholder="请设置登录密码" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input type="password" placeholder="请再次输入密码验证" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 10px;">
                  <el-button type="primary" style="width: 100%;height: 40px;">注册</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'login',
      dialogVisible: false,
      selectedAvatar: '',
      avatars: [
        require('@/assets/images/avatar1.png'),
        require('@/assets/images/avatar2.png'),
        require('@/assets/images/avatar3.png'),
        require('@/assets/images/avatar4.png')
      ]
    };
  },
  methods: {
    handleAvatarSelect(avatar) {
      this.selectedAvatar = avatar;
      this.dialogVisible = false;
    },
    handleClose(done) {
      done();
    }
  }
};
</script>

<style scoped>
.login-page {
  background-color: #f4f4f4;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #ff6a00;
  font-size: 24px;
}

.header-links {
  display: flex;
  gap: 20px;
}

.main-content {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 1000px;
  height: 500px;
  margin-top: 20px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.avatars {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.avatar-section {
  flex: 1;
}

.avatars {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}

.avatars .el-avatar {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatars .el-avatar:hover {
  transform: scale(1.1);
}

.login-register-section {
  flex: 1;
}

.password-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-button.primary {
  background-color: #ff6a00;
  border-color: #ff6a00;
  color: white;
}

.el-button.primary:hover {
  background-color: #e65c00;
  border-color: #e65c00;
}

/* 自定义 tabs 样式 */
:deep(.custom-tabs .el-tabs__nav) {
  width: 100%;
  display: flex;
  justify-content: center;

}

:deep(.custom-tabs .el-tabs__item) {
  flex: 0 1 auto;
  padding: 0 30px;
  text-align: center;
  font-size: 22px;
  font-weight: 400;
}

/* 表单样式 */
.custom-tab-pane {
  padding: 20px;
}

/* 自定义输入框样式 */
:deep(.custom-input .el-input__inner) {
  height: 40px;
  padding: 0 10px;
  border: none;
  border-color: #e0e0e0;
  border-radius: 4px;
  color: #333;
  font-size: 16px;
}

:deep(.custom-input .el-input__inner:focus) {
  border-color: #409eff;
  background-color: #fff;
}
</style>