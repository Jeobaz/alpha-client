<template>
  <v-container class="full-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="3"></v-col>
      <v-col cols="6" sm="6" md="6">
        <Notification
          :message="notification.message"
          :type="notification.type"
          v-if="notification.message"
        ></Notification>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
    <v-card elevation="1">
      <v-data-table
        :headers="headers"
        :items="reminders"
        sort-by="date_of_remind"
        class="elevation-1"
        :custom-sort="customSort"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Напоминания</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >Новое напоминание</v-btn
                >
              </template>
              <ValidationObserver
                ref="form"
                tag="form"
                v-slot="{ invalid, validated, handleSubmit }"
              >
                <v-form @submit.prevent="save">
                  <v-card>
                    <v-card-title>
                      <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <ValidationProvider
                              v-slot="{ errors, valid }"
                              rules="required"
                              name="client"
                            >
                              <v-autocomplete
                                :items="clientNames"
                                v-model="editedItem.name"
                                name="client"
                                label="Клиент"
                                required
                                return-object
                                :error-messages="errors"
                                :success="valid"
                              ></v-autocomplete>
                            </ValidationProvider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <ValidationProvider
                              v-slot="{ errors, valid }"
                              rules="required"
                              name="Описание"
                            >
                              <v-text-field
                                v-model="editedItem.description"
                                label="Описание"
                                name="Описание"
                                required
                                :error-messages="errors"
                                :success="valid"
                              ></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <ValidationProvider
                              v-slot="{ errors, valid }"
                              rules="required"
                              name="Количество дней"
                            >
                              <v-select
                                :error-messages="errors"
                                :success="valid"
                                :items="days"
                                :value="days[0]"
                                :item-text="days.value"
                                :item-value="days.text"
                                v-model="editedItem.date"
                                label="Количество дней"
                                @input="parseDate(editedItem.date)"
                              ></v-select>
                            </ValidationProvider>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close"
                        >Отменить</v-btn
                      >
                      <v-btn
                        color="blue darken-1"
                        text
                        :disabled="invalid || !validated"
                        @click="handleSubmit(save)"
                        >Сохранить</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-form>
              </ValidationObserver>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Сброс</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import dayjs from '../plugins/dayjs';
import Notification from '../components/Notification';

extend('required', {
  ...required,
  message: 'Поле {_field_} не может быть пустым',
});

export default {
  name: 'Reminder',
  components: {
    Notification,
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    notification: {
      message: '',
      type: '',
    },
    dialog: false,
    menu: false,
    headers: [
      {
        text: 'Клиент',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      { text: 'Телефон', value: 'phone', sortable: false },
      { text: 'Email', value: 'email', sortable: false },
      { text: 'Описание', value: 'description', sortable: false },
      {
        text: 'Дата напоминания',
        type: 'date',
        value: 'date_of_remind',
      },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    days: [
      { text: '2 недели', value: 0 },
      { text: 'Месяц', value: 0 },
      { text: '3 месяца', value: 1 },
    ],
    dates: ['2020-11-21'],
    reminders: [],
    clients: [],
    clientNames: [],
    editedIndex: -1,
    editedItem: {
      name: null,
      description: '',
      date_of_remind: null,
      date: null,
    },
    defaultItem: {
      name: null,
      description: '',
      date_of_remind: null,
      date: null,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новая запись' : 'Изменить запись';
    },
    allReminders() {
      return this.$store.state.reminder.reminder;
    },
    allClients() {
      return this.$store.state.client.client;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    editedItem: {
      deep: true,
      handler() {
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
      },
    },
  },

  created() {
    this.initialize();
    this.setDates();
  },

  methods: {
    initialize() {
      this.getAllRecords(() => {});
      this.getAllClients(() => {
        this.clients = this.allClients;
        this.clientNames = this.clients.map((a) => a.name);
        this.reminders = this.allReminders;
      });
    },
    setDates() {
      this.days[0].value = this.$date()
        .add(2, 'week')
        .format('YYYY-MM-DD');
      this.days[1].value = this.$date()
        .add(1, 'month')
        .format('YYYY-MM-DD');
      this.days[2].value = this.$date()
        .add(3, 'month')
        .format('YYYY-MM-DD');
    },
    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      this.editedItem.date_of_remind = `${day.padStart(
        2,
        '0',
      )}/${month.padStart(2, '0')}/${year}`;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    },
    customSort: function(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] == 'date_of_remind') {
          if (!isDesc[0]) {
            return (
              this.$date(b[index], 'DD/MM/YYYY') -
              this.$date(a[index], 'DD/MM/YYYY').toDate()
            );
          } else {
            return (
              this.$date(a[index], 'DD/MM/YYYY').toDate() -
              this.$date(b[index], 'DD/MM/YYYY').toDate()
            );
          }
        } else {
          if (typeof a[index] !== 'undefined') {
            if (!isDesc[0]) {
              return a[index]
                .toLowerCase()
                .localeCompare(b[index].toLowerCase());
            } else {
              return b[index]
                .toLowerCase()
                .localeCompare(a[index].toLowerCase());
            }
          }
        }
      });
      return items;
    },
    getAllRecords(callback) {
      this.$store.dispatch('reminder/getAllRecords').then(
        (response) => {
          callback();
        },
        (error) => {
          const err = {
            message: error.response.data.message,
            type: error.response.data.status,
          };
          this.notification = Object.assign({}, this.notification, {
            message: err.message,
            type: err.type,
          });
        },
      );
    },
    getAllClients(callback) {
      this.$store.dispatch('client/getAllRecords').then(
        (response) => {
          callback();
        },
        (error) => {
          const err = {
            message: error.response.data.message,
            type: error.response.data.status,
          };
          this.notification = Object.assign({}, this.notification, {
            message: err.message,
            type: err.type,
          });
        },
      );
    },
    editItem(item) {
      this.editedIndex = this.reminders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;

      this.editedItem.date = this.days[0].value;
    },
    deleteItem(item) {
      const index = this.reminders.indexOf(item);
      const indexes = { indexDB: item.id, indexState: index };
      if (confirm('Вы точно желаете удалить эту запись?')) {
        this.$store.dispatch('reminder/deleteReminder', indexes).then(
          (response) => {
            this.initialize();
            //this.reminders = this.$store.state.reminder.reminder;
          },
          (error) => {
            const err = {
              message: error.response.data.message,
              type: error.response.data.status,
            };
            this.notification = Object.assign({}, this.notification, {
              message: err.message,
              type: err.type,
            });
          },
        );
      }
    },
    save() {
      if (this.editedIndex > -1) {
        const indexes = {
          indexDB: this.editedItem.id,
          indexState: this.editedIndex,
        };
        const remindInfo = {
          id: this.editedItem.id,
          client_id: this.editedItem.client_id,
          description: this.editedItem.description,
          date_of_remind: this.editedItem.date,
          date_of_birth: this.editedItem.date_of_birth,
          email: this.editedItem.email,
          name: this.editedItem.name,
          phone: this.editedItem.phone,
          date_of_remind_state: this.editedItem.date_of_remind,
        };
        const remindData = { indexes: indexes, remindInfo: remindInfo };
        if (confirm('Указанные данные введены корректно?')) {
          this.$store.dispatch('reminder/updateReminderInfo', remindData).then(
            (response) => {
              this.initialize();
            },
            (error) => {
              const err = {
                message: error.response.data.message,
                type: error.response.data.status,
              };
              this.notification = Object.assign({}, this.notification, {
                message: err.message,
                type: err.type,
              });
            },
          );
        }
      } else {
        const client = this.clients.filter((client) => {
          return client.name == this.editedItem.name;
        });
        const remindData = {
          client_id: client[0].id,
          date_of_birth: client[0].date_of_birth,
          email: client[0].email,
          name: client[0].name,
          phone: client[0].phone,
          description: this.editedItem.description,
          date_of_remind: this.editedItem.date,
        };
        if (confirm('Указанные данные введены корректно?')) {
          this.$store.dispatch('reminder/createNewRemind', remindData).then(
            (response) => {
              this.notification = Object.assign({}, this.notification, {
                message: response.message,
                type: response.status,
              });
              this.initialize();
            },
            (error) => {
              const err = {
                message: error.response.data.message,
                type: error.response.data.status,
              };
              this.notification = Object.assign({}, this.notification, {
                message: err.message,
                type: err.type,
              });
              this.initialize();
            },
          );
        }
      }
      this.close();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
