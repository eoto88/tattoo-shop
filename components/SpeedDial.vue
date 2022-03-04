<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    fixed
  >
    <template v-slot:activator>
      <v-btn
        color="blue darken-2"
        dark
        fab
      >
        <v-icon v-if="fab">
          mdi-close
        </v-icon>
        <v-icon v-else>
          mdi-account-edit
        </v-icon>
      </v-btn>
    </template>
    <v-btn
      v-for="(button, key) in buttons"
      :key="key"
      fab
      dark
      small
      :color="button.color"
      :title="button.title"
      @click="button.handler()"
    >
      <v-icon>
        {{button.icon}}
      </v-icon>
    </v-btn>
  </v-speed-dial>
</template>
<script>
export default {
  name: 'SpeedDial',

  props: {
    buttons: {
      type: Array,
      required: true
    },
  },

  data() {
    return {
      fab: false,
    }
  },
}
</script>
