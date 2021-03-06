import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.VUE_APP_API_URL;

class AuthService {
  register(user) {
    return axios.post(API_URL + 'register', {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  login(user) {
    
    console.log(API_URL);

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
