export const state = () => ({
    client: null,
    depots: [],
    depot: null
});

export const mutations = {
    RESET_CLIENT(state) {
        state.client = null
    },
    SET_CLIENT(state, client) {
        state.client = client;
    },
    SET_DEPOTS(state, depots) {
        state.depots = depots;
    },
    SET_DEPOT(state, depot) {
        state.depot = depot;
    }
}

export const actions = {
    async get({ commit }, { idClient }) {
        await this.$axios.get('/client/' + idClient).then(response => {
            commit('SET_CLIENT', response.data.client);
        })
    },
    async getDepots({ commit }, { idClient }) {
        await this.$axios.get('/client/' + idClient + '/depots').then(response => {
            commit('SET_DEPOTS', response.data.depots);
        })
    },
    async getDepot({ commit }, { idClient, idDepot }) {
        await this.$axios.get('/client/' + idClient + '/depot/' + idDepot).then(response => {
            commit('SET_DEPOT', response.data.depot);
        })
    },
    // async updateDepot({ commit }, { params, depot }) {
    //     await this.$axios.put('/client/' + idClient + '/depot/' + idDepot).then(response => {
    //         commit('SET_DEPOT', response.data.depot);
    //     })
    // }
}

export const getters = {
    client(state) {
        return state.client
    },
    depots(state) {
        return state.depots
    },
    depot(state) {
        return state.depot
    }
}
