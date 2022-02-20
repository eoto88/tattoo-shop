<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="selected"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="selected"
        value
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="selected"
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="modal = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.dialog.save(value)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  name: 'DatePicker',

  props: {
    label: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },

  computed: {
    selected: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
  },

  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
  }),
}
</script>
