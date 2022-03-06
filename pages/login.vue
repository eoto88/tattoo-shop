<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-card
        elevation="4"
        outlined
        :loading="loading"
      >
        <v-card-title class="text-h5">
          Connexion
        </v-card-title>
        <v-card-text>
          <v-alert
            type="error"
            v-if="errorMessage"
          >{{ errorMessage }}</v-alert>
          <v-form
            ref="form"
            v-model="valid"
            id="loginForm"
            lazy-validation
          >
            <v-text-field
              v-model="email"
              :counter="100"
              :rules="emailRules"
              label="Courriel"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              label="Mot de passe"
              @click:append="showPassword = !showPassword"
              v-on:keyup.enter="login"
            ></v-text-field>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="login"
            >
              {{ loading ? "Connexion en cours..." : "Connexion" }}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    errorMessage: '',
    loading: false,
    valid: true,
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    showPassword: false,
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    ],
  }),

  methods: {
    async login() {
      this.loading = true
      if (this.$refs.form.validate()) {
        try {
          const self = this;
          await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password,
            },
          }).then((response) => {
            if (self.$auth.loggedIn) {
              self.$auth.setUser(response.data)
              self.$auth.setUserToken(response.data.accessToken)
              self.$router.push('/')
            }
          }).catch(error => {
            if(error.response.status === 401) {
              // error.response.data.message
              this.errorMessage = "Mot de passe ou courriel incorrect.";
            }
          }).finally(() => {
            this.loading = false
          })
        } catch (e) {
          this.error = e.response.data.message;
        }
      } else {
        this.loading = false
      }
    },
  },
}
</script>
<style>
#loginForm {
  width: 350px;
}
</style>
