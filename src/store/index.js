import { createStore } from 'vuex';

export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: {
                userId: 1, // 存储用户ID
                token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyUm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ4MzU5MTE4LCJ1c2VySWQiOjF9.G8A8bHIb6-OjuzAfRUrR9liY9icptJDe-qpmj5SxCPA'
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
