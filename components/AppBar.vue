<template>
  <v-app-bar
    dark
    fixed
    prominent
    clipped-left
    app
    shrink-on-scroll
  >
    <v-app-bar-title class="mr-5 align-center">
      <nuxt-link to="/" class="app-title">Tattoo Shop</nuxt-link>
    </v-app-bar-title>
    <v-spacer/>
    <v-menu
      left
      bottom
      offset-y
      v-if="isAuthenticated"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list flat>
        <v-list-item-group
          color="primary"
        >
          <v-list-item link @click="profile">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <v-flex shrink>
      <v-btn icon color="test" large @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
    </v-flex>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;  // it check if user isAuthenticated
    },
    getUserInfo() {
      return this.$store.getters.getUserInfo;
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout();  // this method will logout the user and make token to false on the local storage of the user browser
    },
    profile() {
      this.$router.push({ path: `/profile` })
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Comforter');

.app-title {
  font-family: 'Comforter', cursive;
  font-size: 3em;
  color: white !important;
  text-decoration: none;
}

@media (max-width: 575.98px) {
  .app-title {
    font-size: 2em;
  }
}

.v-app-bar--is-scrolled .app-title {
  font-size: 1em;
}

@media (max-width: 400px) {
  .app-title {
    font-size: 1.5em;
  }
}

.v-app-bar-title__content {
  min-width: 300px;
}
</style>
