import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:3333/';

class AuthService {
  register(user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  getUserData() {
    return axios
      .get(API_URL + 'account/me', {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.data) {
        }
        return response.data.data;
      });
  }
  logout() {
    localStorage.removeItem('user');
  }
}

export default new AuthService();
