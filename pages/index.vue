<template>
  <v-container fill-height>
    <v-row justify-center align-center>
      <v-col
          cols="12"
      >
        <v-card
            class="mx-auto"
            :loading="loading"
        >
          <TableClients
            :clients="clients"
          />

          <hr />

          <v-flex shrink>
            <v-btn icon color="test" large @click="$vuetify.theme.dark = !$vuetify.theme.dark">
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </v-flex>
        </v-card>
      </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn
        color="success"
        dark
        fixed
        bottom
        right
        fab
        title="Créer un client"
        @click="addClient"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import TableClients from "../components/TableClients";

export default {
  components: {TableClients},

  data: () => ({
    loading: true,
    clients: [],
  }),

  async fetch() {
    this.clients = await this.$axios.get('/clients').then(response => {
      this.loading = false;
      return response.data.clients
    })
  },

  methods: {
    addClient: function () {
      this.$router.push({path: `/client/`})
    },
  },
}
</script>
