import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://127.0.0.1:3333/';

class ReminderService {
  getAll() {
    return axios
      .get(API_URL + 'reminders/get_all_reminders', {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.data) {
        }
        return response;
      });
  }
  deleteReminder(index) {
    return axios
      .delete(`${API_URL}reminders/delete_reminder/${index}`, {
        headers: authHeader(),
        params: { id: index },
      })
      .then((response) => {
        if (response.data) {
        }
        return response.data;
      });
  }
  updateReminderInfo(data) {
    return axios
      .put(
        `${API_URL}reminders/update_reminder_info/${data.indexes.indexDB}`,
        { data: data.remindInfo },
        {
          headers: authHeader(),
        },
      )
      .then((response) => {
        if (response.data) {
        }
        return response.data;
      });
  }
  createNewRemind(data) {
    return axios
      .post(
        `${API_URL}reminders/create_new_remind`,
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

export default new ReminderService();
