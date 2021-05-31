<template>
  <div>
    <v-alert :type='type'>
      {{message}}
    </v-alert>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props:
    {
      message: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
};
</script>
