<template>
  <v-dialog
      v-model="showDialog"
      max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span>{{ title }}</span>
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-btn
            color="primary"
            text
            @click="handleOnYes"
        >
          Oui
        </v-btn>
        <v-btn
            color="primary"
            text
            @click="handleOnNo"
        >
          Non
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
  },

  // data: () => ({
  //   showDialog: false,
  // }),

  methods: {
    handleOnYes: function () {
      this.$emit('yes');
    },
    handleOnNo: function () {
      this.$emit('no');
    },
  },

  computed: {
    showDialog() {
      return this.show
    },
  }
};
</script>
