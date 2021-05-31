<template>
  <v-container class="fill-height" fluid>
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
      <v-col cols="12" sm="8" md="4">
        <ValidationObserver
          ref="observer"
          v-slot="{ invalid, validated, handleSubmit }"
        >
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Регистрация</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="register">
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="Name"
                  rules="required"
                >
                  <v-text-field
                    name="username"
                    v-model="user.username"
                    :error-messages="errors"
                    :success="valid"
                    required
                    counter
                    label="Username"
                    prepend-icon="mdi-account"
                  ></v-text-field>
                </ValidationProvider>

                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    name="email"
                    v-model="user.email"
                    :error-messages="errors"
                    :success="valid"
                    required
                    label="Email"
                    prepend-icon="mdi-email"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors, valid }"
                  name="password"
                  rules="required"
                >
                  <v-text-field
                    name="password"
                    v-model="user.password"
                    :error-messages="errors"
                    :success="valid"
                    label="Пароль"
                    required
                    prepend-icon="mdi-lock"
                    type="password"
                    @click:append="showp != showp"
                  ></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  name="confirm"
                  rules="required|confirmed:password"
                  v-slot="{ errors, valid }"
                >
                  <v-text-field
                    name="confirm"
                    v-model="confirm"
                    :error-messages="errors"
                    :success="valid"
                    label="Повторите пароль"
                    required
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </ValidationProvider>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="handleSubmit(register)"
                :disabled="invalid || !validated"
                >Регистрация <v-icon dark right>mdi-key</v-icon></v-btn
              >
            </v-card-actions>
            <v-col class="px-16">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <div class="text-body text-center">
                Уже зарегистрированы?
                <router-link :to="'/login'">Авторизация</router-link>
              </div>
            </v-col>
          </v-card>
        </ValidationObserver>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from 'vee-validate';
import { required, email, confirmed } from 'vee-validate/dist/rules';
import User from '../models/user';
import Notification from '../components/Notification';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'Поле "{_field_}" не может быть пустым',
});

extend('email', {
  ...email,
  message: 'Введите корректный email',
});

extend('confirmed', {
  ...confirmed,
  message: 'This field confirmation does not match',
});

export default {
  name: 'RegisterForm',
  components: {
    Notification,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    source: String,
  },
  data: () => ({
    user: new User('', '', ''),
    confirm: '',
    notification: {
      message: '',
      type: '',
    },
  }),
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    async register() {
      this.$store.dispatch('auth/register', this.user).then(
        () => {
          this.$router.push('/');
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
  },
};
</script>
