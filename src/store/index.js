import { createStore } from 'vuex';
const loadUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {
      userId: 0,
      token: '',
      userName: '',
      userAddr: '',
      avatar: '',
    };
  } catch (error) {
    console.error('Failed to load user from storage:', error);
    return {
      userId: 0,
      token: '',
      userName: '',
      userAddr: '',
      avatar: '',
    };
  }
};
export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: loadUserFromStorage(),
            mutations: {
                // 设置 userId
                setUserId(state, userId) {
                    state.userId = userId;
                    this.commit('UserModules/saveUserToStorage');
                },
                // 设置 token
                setToken(state, token) {
                    state.token = token;
                    this.commit('UserModules/saveUserToStorage');
                },
                // 设置 name
                setUserName(state, userName) {
                    state.userName = userName;
                    this.commit('UserModules/saveUserToStorage');
                },
                // 设置 addr
                setAddr(state, userAddr) {
                    state.userAddr = userAddr;
                    this.commit('UserModules/saveUserToStorage');
                },
                // 设置 avatar
                setAvatar(state, userAvatar) {
                    state.avatar = userAvatar;
                    this.commit('UserModules/saveUserToStorage');
                },
                // 将用户信息保存到本地存储
                saveUserToStorage(state) {
                try {
                    localStorage.setItem('user', JSON.stringify({
                    userId: state.userId,
                    token: state.token,
                    userName: state.userName,
                    userAddr: state.userAddr,
                    avatar: state.avatar,
                    }));
                } catch (error) {
                    console.error('Failed to save user to storage:', error);
                }
                },
            },
            actions: {
                login({ commit }, { userId, token, userName, userAddr,userAvatar }) {
                    commit('setUserId', userId);
                    commit('setToken', token);
                    commit('setUserName', userName);
                    commit('setAddr', userAddr);
                    commit('setAvatar',userAvatar);
                },
            },
            getters: {

            },
            methods: {

            }
        },
    },
});
