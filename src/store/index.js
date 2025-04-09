import { createStore } from 'vuex';

export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: {
                userId: 1, // 存储用户ID
            },
            mutations: {
                
            },
            actions: {
                login({ commit }, userId) {
                    commit('setUserId', userId);
                },
            },
            getters: {

            },
            methods: {

            }
        },
    },
});
