import { createStore } from 'vuex';

export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: {
                userId: 1, // 存储用户ID
                token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyUm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ4MTc4ODk1LCJ1c2VySWQiOjF9.21HdbE3Q05i7Cm9RBlvxbyglrY8mf9Sx4cDfpiCkvGs',
                userName: '12345678',
                userAddr:'北航',
                avatar:'',
            },
            mutations: {
                // 设置 userId
                setUserId(state, userId) {
                    state.userId = userId;
                },
                // 设置 token
                setToken(state, token) {
                    state.token = token;
                },
                // 设置 name
                setUserName(state, name) {
                    state.userName = name;
                },
                // 设置 addr
                setAddr(state, addr) {
                    state.userAddr = addr;
                },
                // 设置 avatar
                setAvatar(state, avatar) {
                    state.avatar = avatar;
                }
            },
            actions: {
                login({ commit }, { userId, token, name, addr,avatar }) {
                    commit('setUserId', userId);
                    commit('setToken', token);
                    commit('setUserName', name);
                    commit('setAddr', addr);
                    commit('setAvatar',avatar);
                },
            },
            getters: {

            },
            methods: {

            }
        },
    },
});
