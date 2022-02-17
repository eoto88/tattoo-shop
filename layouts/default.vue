<template>
  <v-app dark>
    <AppBar />
    <v-main>
      <Nuxt/>
    </v-main>
    <v-footer>
      <v-col
          class="text-center"
          cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<style scoped>
</style>

<script>
import AppBar from '~/components/AppBar';

export default {
  head: {
    title: 'Tattoo Shop',
  },

  components: { AppBar },
}
</script>