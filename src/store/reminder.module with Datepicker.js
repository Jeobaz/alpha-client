import ReminderService from '../services/reminder.service';

const initialState = {};

export const reminder = {
  namespaced: true,
  state: initialState,
  actions: {
    getAllRecords({ commit }) {
      ReminderService.getAll().then((response) => {
        commit('setAllRecords', response);
        return Promise.resolve(response.data);
      });
    },
    deleteReminder({ commit }, indexes) {
      return ReminderService.deleteReminder(indexes.indexDB).then(
        (response) => {
          commit('deleteReminder', indexes.indexState);
          return Promise.resolve(response);
        },
      );
    },
    updateReminderInfo({ commit }, data) {
      return ReminderService.updateReminderInfo(data).then((response) => {
        commit('updateReminderInfo', data);
        return Promise.resolve(response);
      });
    },
    createNewRemind({ commit }, data) {
      return ReminderService.createNewRemind(data).then(
        (response) => {
          commit('createNewRemind', data);
          return Promise.resolve(response.data);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
  },
  mutations: {
    setAllRecords(state, reminders) {
      state.reminder = reminders.data.reminders;
    },
    deleteReminder(state, index) {
      state.reminder.splice(index, 1);
    },
    updateReminderInfo(state, data) {
      const remindData = {
        id: data.remindInfo.id,
        client_id: data.remindInfo.client_id,
        description: data.remindInfo.description,
        date_of_remind: data.remindInfo.date_of_remind_state,
        date_of_birth: data.remindInfo.date_of_birth,
        email: data.remindInfo.email,
        phone: data.remindInfo.phone,
        name: data.remindInfo.name,
      };
      Object.assign(state.reminder[data.indexes.indexState], remindData);
    },
    createNewRemind(state, data) {
      const [year, month, day] = data.date_of_remind.split('-');
      data.date_of_remind = `${day.padStart(2, '0')}/${month.padStart(
        2,
        '0',
      )}/${year}`;
      state.reminder.push(data);
    },
  },
};
