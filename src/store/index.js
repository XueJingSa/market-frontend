import { createStore } from 'vuex';

export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: {
                userId: 1, // 存储用户ID
                token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyUm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ3OTIxOTMwLCJ1c2VySWQiOjF9.iAaV6xt9HRtayl8wn65JPUCEknB_CuCB3I7oNWaQ2jY',
                userName: '12345678',
                userAddr:'北航',
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
                }
            },
            actions: {
                login({ commit }, { userId, token, name, addr }) {
                    commit('setUserId', userId);
                    commit('setToken', token);
                    commit('setUserName', name);
                    commit('setAddr', addr);
                },
            },
            getters: {

            },
            methods: {

            }
        },
    },
});
