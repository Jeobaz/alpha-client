import ClientService from '../services/client.service';

const initialState = {};

export const client = {
  namespaced: true,
  state: initialState,
  actions: {
    getAllRecords({ commit }) {
      return ClientService.getAll().then((response) => {
        commit('setAllRecords', response);
        return Promise.resolve(response.data);
      });
    },
    deleteClient({ commit }, indexes) {
      return ClientService.deleteClient(indexes.indexDB).then((response) => {
        commit('deleteClient', indexes.indexState);
        return Promise.resolve(response);
      });
    },
    updateClientInfo({ commit }, data) {
      return ClientService.updateClientInfo(data).then((response) => {
        commit('updateClientInfo', data);
        return Promise.resolve(response);
      });
    },
    createNewClient({ commit }, data) {
      return ClientService.createNewClient(data).then(
        (response) => {
          commit('createNewClient', data);
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
  },
  mutations: {
    setAllRecords(state, clients) {
      state.client = clients.data.clients;
    },
    deleteClient(state, index) {
      state.client.splice(index, 1);
    },
    updateClientInfo(state, data) {
      Object.assign(state.client[data.indexes.indexState], data.clientInfo);
    },
    createNewClient(state, data) {
      const [year, month, day] = data.date_of_birth.split('-');
      data.date_of_birth = `${day.padStart(2, '0')}/${month.padStart(
        2,
        '0',
      )}/${year}`;
      //state.client.push(data);
    },
  },
};
