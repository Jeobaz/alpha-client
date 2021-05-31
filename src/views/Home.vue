<template>
  <v-container class="full-height" fluid>
    <v-row align="center" justify="center">
      <v-col
        class="col-xs-12"
        sm="6"
        md="3"
        lg="3"
        xl="3"
        v-for="item in this.todays"
        :key="item.id"
      >
        <v-card class="mx-auto" max-width="344" tile elevation="1">
          <v-list-item four-line>
            <v-list-item-content>
              <div class="overline">
                {{ item.date_of_remind }}
              </div>
              <v-list-item-title class="headline mb-2">{{
                item.phone
              }}</v-list-item-title>
              <v-list-item-title class="headline mb-2">{{
                item.name
              }}</v-list-item-title>
              <div class="text--secondary">
                {{ item.description }}
              </div>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-row>
              <v-col cols="12" class="d-flex justify-center">
                <v-btn text color="green" @click="deleteItem(item.id)"
                  >Прочитано</v-btn
                >
              </v-col>
              <!-- <v-col cols="6" class="d-flex justify-center">
                <v-btn text color="green">Изменить</v-btn>
              </v-col> -->
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
  name: 'Home',
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
    reminders: [],
    todays: [],
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Новая запись' : 'Изменить запись';
    },
    allReminders() {
      return this.$store.state.reminder.reminder;
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.getAllRecords();
      this.reminders = this.allReminders;
      this.getTodaysRecords();
    },
    getAllRecords() {
      this.$store.dispatch('reminder/getAllRecords').then(
        (response) => {},
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
    getTodaysRecords() {
      const today = this.$date().format('DD/MM/YYYY');
      this.todays = this.reminders.filter((reminder) => {
        return reminder.date_of_remind == today;
      });
    },
    editItem(item) {
      this.editedIndex = this.reminders.indexOf(item);
      this.editedItem = Object.assign({}, item);

      const [day, month, year] = this.editedItem.date_of_remind.split('/');
      this.editedItem.date = `${year}-${month}-${day}`;
      this.editedItem.dateFormatted = this.parseDate(this.editedItem.date);
    },
    deleteItem(id) {
      const reminder = this.todays.filter((reminder) => {
        return reminder.id == id;
      })[0];
      const index = this.reminders.indexOf(reminder);
      const indexes = { indexDB: id, indexState: index };
      if (confirm('Запись обработана и ее можно удалить?')) {
        this.$store.dispatch('reminder/deleteReminder', indexes).then(
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
  },
};
</script>
