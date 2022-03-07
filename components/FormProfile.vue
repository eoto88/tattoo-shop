<template>
  <v-card
    elevation="2"
    outlined
    :loading="loading"
  >
    <v-card-title class="text-h5">
      Profile (Pas encore fonctionnel)
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-text-field
          v-model="name"
          :counter="100"
          :rules="nameRules"
          label="Name"
          required
        ></v-text-field>
        <v-text-field
          v-model="email"
          :counter="255"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="oldPassword"
          :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          name="old-password"
          label="Ancien mot de passe"
          @click:append="showOldPassword = !showOldPassword"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          label="Nouveau mot de passe"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          v-model="repeatPassword"
          :append-icon="showRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          name="repeat-password"
          label="Répéter le nouveau mot de passe"
          @click:append="showRepeatPassword = !showRepeatPassword"
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="save"
        >
          Enregistrer
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FormProfile',

  data: () => ({
    loading: false,
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Le nom est requis',
      v => (v && v.length <= 100) || 'Le nom doit contenir en dessous de 100 caractères',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      v => (v && v.length <= 255) || 'Le nom doit contenir en dessous de 255 caractères',
    ],
    showOldPassword: false,
    oldPassword: '',
    showPassword: false,
    password: '',
    showRepeatPassword: false,
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    repeatPassword: ''
  }),

  mounted() {
    this.name = this.getName;
    this.email = this.getEmail;
  },

  computed: {
    getName() {
      return this.$auth.user.name;
    },
    getEmail() {
      return this.$auth.user.email;
    }
  },

  methods: {
    async save() {

    },
  },
}
</script>
