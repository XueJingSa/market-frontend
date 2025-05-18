import { createStore } from 'vuex';

export default createStore({
    modules: {
        UserModules: {
            namespaced: true,
            state: {
                userId: 1, // 存储用户ID
                token:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyUm9sZSI6IkFkbWluIiwiZXhwIjoxNzQ3NTc2NTQ5LCJ1c2VySWQiOjF9.7kvbD7z3zrRdJb_30gSaWi7_ewoQkBOTNey8HkrTuwM'
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
