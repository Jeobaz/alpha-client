<template>
  <v-app id="keep">
    <v-app-bar app clipped-left color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5"
        >Alpha-optica&nbsp;<span class="font-weight-light">
          / панель управления</span
        ></span
      >
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense>
        <v-list-item v-if="!loggedIn" link to="/login">
          <v-list-item-action>
            <v-icon>mdi-login-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Авторизация</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item v-if="!loggedIn" link to="/register">
          <v-list-item-action>
            <v-icon>mdi-account-plus-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Регистрация</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item link v-if="loggedIn" to="/">
          <v-list-item-action>
            <v-icon>mdi-alarm-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item link v-if="loggedIn" to="/profile">
          <v-list-item-action>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item link v-if="loggedIn" to="/client">
          <v-list-item-action>
            <v-icon>mdi-account-supervisor-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Клиенты</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="loggedIn" to="/reminder">
          <v-list-item-action>
            <v-icon>mdi-clipboard-list-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Напоминания</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link v-if="loggedIn" @click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {},
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    content: '',
    links: [
      {
        needLogin: false,
        icon: 'mdi-login-variant',
        url: '/login',
        title: 'Login',
      },
      {
        needLogin: false,
        icon: 'mdi-account-plus-outline',
        url: '/register',
        title: 'Register',
      },
      {
        needLogin: true,
        icon: 'mdi-account-outline',
        url: '/profile',
        title: 'Profile',
      },
      {
        needLogin: true,
        icon: 'mdi-clipboard-list-outline',
        url: '/reminder',
        title: 'Напоминания',
      },
    ],
  }),
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout', null, { root: true });
      this.$router.push('/login');
    },
  },
};
</script>
