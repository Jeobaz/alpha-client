import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:3333/';

class ClientService {
  getAll() {
    return axios
      .get(API_URL + 'clients/get_all_clients', {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.data) {
        }
        return response;
      });
  }
  deleteClient(index) {
    return axios
      .delete(`${API_URL}clients/delete_client/${index}`, {
        headers: authHeader(),
        params: { id: index },
      })
      .then((response) => {
        if (response.data) {
        }
        return response;
      });
  }
  updateClientInfo(data) {
    return axios
      .put(
        `${API_URL}clients/update_client_info/${data.indexes.indexDB}`,
        { data: data.clientInfo },
        {
          headers: authHeader(),
        },
      )
      .then((response) => {
        if (response.data) {
        }
        return response;
      });
  }
  createNewClient(data) {
    return axios
      .post(
        `${API_URL}clients/create_new_client`,
        { data: data },
        {
          headers: authHeader(),
        },
      )
      .then((response) => {
        if (response.data) {
        }
        return response;
      });
  }
}

export default new ClientService();
