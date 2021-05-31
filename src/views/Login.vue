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
          ref="form"
          tag="form"
          v-slot="{ invalid, validated, handleSubmit }"
        >
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Авторизация</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="login">
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
                  name="пароль"
                  rules="required"
                >
                  <v-text-field
                    name="пароль"
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
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="handleSubmit(login)"
                :disabled="invalid || !validated"
                >Войти <v-icon dark right>mdi-key</v-icon></v-btn
              >
            </v-card-actions>
            <v-col class="px-16">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
              <div class="text-body text-center">
                Еще не зарегистрированы?
                <router-link :to="'/register'">Регистрация</router-link>
              </div>
            </v-col>
          </v-card>
        </ValidationObserver>
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
import { email, required } from 'vee-validate/dist/rules';
import User from '../models/user';
import Notification from '../components/Notification';

setInteractionMode('lazy');

extend('email', {
  ...email,
  message: 'Введите корректный email',
});

extend('required', {
  ...required,
  message: '{_field_} не может быть пустым',
});

export default {
  name: 'Login',
  components: {
    Notification,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    source: String,
  },
  data() {
    return {
      user: new User('', ''),
      notification: {
        message: '',
        type: '',
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  watch: {
    user: {
      deep: true,
      handler() {
        if (this.$refs.form) {
          this.$refs.form.validate();
        }
      },
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    login() {
      if (this.user.email && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(
          () => {
            this.$router.push('/');
          },
          (error) => {
            debugger;
            this.notification = Object.assign({}, this.notification, {
              message: error.response.data.message,
              type: error.response.data.status,
            });
          },
        );
      }
    },
  },
};
</script>
