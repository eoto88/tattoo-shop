<template>
  <v-container>
    <v-row justify-center align-center>
      <v-col
        cols="12"
      >
        <FormProfile />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormProfile from "../components/FormProfile";

export default {
  components: { FormProfile },

  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    showPassword: false,
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>
