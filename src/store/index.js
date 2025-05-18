import { createStore } from 'vuex';

export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: {
                userId: 1, // 存储用户ID
                token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyUm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ3NTU5MTY2LCJ1c2VySWQiOjF9.s4_0Adlp4Nz5_d4J_3jRclREtchFGASkQOI6ODjhk3U'
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
