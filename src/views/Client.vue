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
        :items="clients"
        sort-by="date"
        class="elevation-1"
        :custom-sort="customSort"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Клиенты</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >Новый клиент</v-btn
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
                              name="Клиент"
                              rules="required"
                            >
                              <v-text-field
                                v-model="editedItem.name"
                                name="Клиент"
                                label="Клиент"
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
                              name="Email"
                            >
                              <v-text-field
                                v-model="editedItem.email"
                                label="Email"
                                name="Email"
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
                              name="Телефон"
                            >
                              <v-text-field
                                v-model="editedItem.phone"
                                label="Телефон"
                                name="Телефон"
                                required
                                :error-messages="errors"
                                :success="valid"
                              ></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.dateFormatted"
                                  label="Дата рождения"
                                  persistent-hint
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  success
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="editedItem.date"
                                no-title
                                @input="
                                  (menu = false),
                                    (editedItem.dateFormatted = parseDate(
                                      editedItem.date,
                                    ))
                                "
                                locale="ru-RU"
                              ></v-date-picker>
                            </v-menu>
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
  name: 'Client',
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
        text: 'Имя',
        align: 'start',
        sortable: true,
        value: 'name',
      },

      { text: 'Email', value: 'email', sortable: false },
      { text: 'Телефон', value: 'phone', sortable: false },
      {
        text: 'Дата рождения',
        type: 'date',
        dateInputFormat: "yyyy-MM-dd'T'HH:mm:ss.SSSZ",
        dateOutputFormat: 'MMM do yy',
        value: 'date_of_birth',
      },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    clients: [],
    editedIndex: -1,
    editedItem: {
      name: null,
      phone: '',
      email: '',
      date_of_birth: null,
      date: null,
      dateFormatted: null,
    },
    defaultItem: {
      name: null,
      phone: '0',
      email: '',
      date_of_birth: null,
      date: null,
      dateFormatted: null,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новая запись' : 'Изменить запись';
    },
    currentUser() {
      return this.$store.state.auth.user;
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
  },

  methods: {
    initialize() {
      this.getAllRecords(() => {
        this.clients = this.allClients;
      });
    },
    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      this.editedItem.date_of_birth = `${day.padStart(2, '0')}/${month.padStart(
        2,
        '0',
      )}/${year}`;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    },
    customSort: function(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] == 'date_of_birth') {
          if (!isDesc[0]) {
            return (
              this.$date(b[index], 'DD/MM/YYYY').toDate() -
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
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;

      const [day, month, year] = this.editedItem.date_of_birth.split('/');
      this.editedItem.date = `${year}-${month}-${day}`;
      this.editedItem.dateFormatted = this.parseDate(this.editedItem.date);
    },
    deleteItem(item) {
      const index = this.clients.indexOf(item);
      const indexes = { indexDB: item.id, indexState: index };
      if (confirm('Вы точно желаете удалить эту запись?')) {
        this.$store.dispatch(`client/deleteClient`, indexes).then(
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
    },
    save() {
      if (this.editedIndex > -1) {
        const indexes = {
          indexDB: this.editedItem.id,
          indexState: this.editedIndex,
        };
        const userData = { indexes: indexes, clientInfo: this.editedItem };
        if (confirm('Указанные данные введены корректно?')) {
          this.$store.dispatch('client/updateClientInfo', userData).then(
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
      }
      //save new client
      else {
        const userData = {
          name: this.editedItem.name,
          email: this.editedItem.email,
          phone: this.editedItem.phone,
          date_of_birth: this.editedItem.date,
        };
        if (confirm('Указанные данные введены корректно?')) {
          this.$store.dispatch('client/createNewClient', userData).then(
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
