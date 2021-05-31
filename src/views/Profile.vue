<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" v-if="notification.message">
      <v-col cols="3"></v-col>
      <v-col cols="6" sm="6" md="6">
        <Notification
          :message="notification.message"
          :type="notification.type"
        ></Notification>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
    <v-card class="mx-auto" max-width="344" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">Personal Infromation</div>
          <v-list-item-title class="headline mb-1">{{
            currentUser.email
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            currentUser.username
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import Notification from '../components/Notification';
export default {
  name: 'Profile',
  components: { Notification },
  data() {
    return {
      notification: {
        message: '',
        type: '',
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.userData;
    },
  },

  created() {
    this.fetchAuthenticatedUser();
  },
  methods: {
    fetchAuthenticatedUser() {
      this.$store.dispatch('auth/getUserData').then(
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
  },
};
</script>
