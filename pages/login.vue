<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-card
          elevation="2"
          outlined
          :loading="loading"
      >
        <v-form
            ref="form"
            v-model="valid"
            lazy-validation
        >
          <v-card-text>
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
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="login"
            >
              {{ loading ? "Connexion en cours..." : "Connexion" }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
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
          })
        } catch (e) {
          this.error = e.response.data.message;
        }

        // this.$axios
        //     .post("/login", {
        //       email: this.email,
        //       password: this.password,
        //     }).then(response => {
        //       if(response.status = 200) {
        //         this.$store.setUser(response.data)
        //         this.success = true
        //         this.errored = false
        //       } else {
        //         this.success = false
        //       }
        //     })
        //     .catch(error => {
        //       this.errored = true
        //     })
        //     .finally(() => {
        //       this.loading = false
        //     });
      } else {
        this.loading = false
      }
      // .finally(() => {
      //   this.loading = false
      // });
    },
  },
}
</script>
<style>
form {
  width: 350px;
}
</style>