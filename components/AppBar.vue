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
      <span class="app-title">Tattoo Shop</span>
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
            v-bind="attrs"
            v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <NuxtLink to="/profile">Profile</NuxtLink>
        </v-list-item>
        <v-list-item @click="logout">Se déconnecter</v-list-item>
      </v-list>
    </v-menu>
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
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Comforter');

.app-title {
  font-family: 'Comforter', cursive;
  font-size: 3em;
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