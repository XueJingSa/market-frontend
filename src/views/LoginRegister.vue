<template>
  <div class="login-page">
    <div class="main-content">
      <div class="login-register-section">
        <el-card style="width: 400px;height: 350px;margin-right: 20px;">
          <el-tabs v-model="activeTab" class="custom-tabs">
            <el-tab-pane label="登录" name="login" class="custom-tab-pane">
              <el-form label-width="0px">
                <el-form-item prop="userName">
                  <el-input v-model="loginForm.userName" placeholder="账号名" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item prop="userPassword">
                  <el-input v-model="loginForm.userPassword" type="password" placeholder="请输入登录密码"
                    class="custom-input"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 10px;">
                  <el-button @click="handleLogin" type="primary" style="width: 100%;height: 40px;">登录</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register" class="custom-tab-pane">
              <el-form label-width="0px">
                <el-form-item prop="userName">
                  <el-input v-model="registerForm.userName" placeholder="账号名" class="custom-input"></el-input>
                </el-form-item>
                <el-form-item prop="userPassword">
                  <el-input v-model="registerForm.userPassword" type="password" placeholder="请设置登录密码"
                    class="custom-input"></el-input>
                </el-form-item>
                <el-form-item prop="checkPassword">
                  <el-input v-model="registerForm.checkPassword" type="password" placeholder="请再次输入密码验证"
                    class="custom-input"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 10px;">
                  <el-button type="primary" style="width: 100%;height: 40px;" @click="handleRegister">注册</el-button>
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
import axios from 'axios';
import { callSuccess, callError } from '@/api/index';
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
      ],
      // 登录表单
      loginForm: {
        userName: '',
        userPassword: ''
      },
      // 注册表单
      registerForm: {
        userName: '',
        userPassword: '',
        checkPassword: ''
      }
    };
  },
  methods: {
    handleAvatarSelect(avatar) {
      this.selectedAvatar = avatar;
      this.dialogVisible = false;
    },
    handleClose(done) {
      done();
    },
    // 处理登录
    async handleLogin() {
      try {
        if (!this.loginForm.userName || !this.loginForm.userPassword) {
          callError('请输入用户名和密码');
          return;
        }

        const response = await axios.post('/api/user/login', {
          userName: this.loginForm.userName,
          password: this.loginForm.userPassword
        });
        console.log(response.data)
        if (response.data.code === 1) {
          callSuccess('登录成功');
          const token = response.data.data.token;
          const userId = response.data.data.userId;
          const userName = response.data.data.username;
          const userAddr = response.data.data.address;

          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userAddr', userAddr);

          this.$store.dispatch('UserModules/login', { userId, token, userName, userAddr });

          console.log(this.$store.state.UserModules.userId, this.$store.state.UserModules.token)
          this.$router.push('/home');
        } else {
          callError(response.data.message || '登录失败');
        }
      } catch (error) {
        callError('网络错误，请稍后重试');
        console.error('登录错误:', error);
      }
    },

    // 处理注册
    async handleRegister() {
      try {
        if (!this.registerForm.userName || !this.registerForm.userPassword) {
          callError('请输入用户名和密码');
          return;
        }

        if (this.registerForm.userPassword !== this.registerForm.checkPassword) {
          callError('两次输入的密码不一致');
          return;
        }

        const response = await axios.post('/api/user/register', {
          userName: this.registerForm.userName,
          userPassword: this.registerForm.userPassword,
          checkPassword: this.registerForm.checkPassword
        });

        if (response.data.code === 1) {
          callSuccess('注册成功');
          this.activeTab = 'login';
          this.registerForm = {
            userName: '',
            userPassword: '',
            checkPassword: ''
          };
        } else {
          callError(response.data.msg || '注册失败');
        }
      } catch (error) {
        callError('网络错误，请稍后重试');
        console.error('注册错误:', error);
      }
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
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 1000px;
  height: 500px;
  margin: 20px auto;
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
  justify-content: center;
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