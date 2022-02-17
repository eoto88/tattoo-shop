<template>
  <v-container fill-height>
    <v-row justify-center align-center>
      <v-col
          cols="12"
      >
        <v-card
            class="mx-auto"
        >
          <v-list
              two-line
          >
            <v-list-item
                v-for="client of clients" v-bind:key="client.id"
                link
                @click="editClient(client)"
            >
              <v-list-item-avatar>
                <v-icon
                    class="grey lighten-1"
                    dark
                >
                  mdi-account-circle
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                    v-text="client.name"
                ></v-list-item-title>
                <v-list-item-subtitle>{{ getDepotsCount(client) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-chip
                    color="orange"
                    v-if="hasDepotWaiting(client)"
                >En attente</v-chip>
              </v-list-item-icon>
            </v-list-item>
          </v-list>

          <v-flex shrink>
            <v-btn icon color="test" large @click="$vuetify.theme.dark = !$vuetify.theme.dark">
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </v-flex>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    clients: [],
  }),
  async fetch() {
    this.clients = await this.$axios.get('/clients').then(response => {
      return response.data.clients
    })
  },

  methods: {
    editClient: function (client) {
      this.$router.push({path: '/client', query: {id: client.id}})
    },

    getDepotsCount: function(client) {
      const depotsCount = client.depots.length
      if( depotsCount > 1 ) {
        return `${depotsCount} dépôts`
      } else {
        return `${depotsCount} dépôt`
      }
    },

    hasDepotWaiting: function(client) {
      for (let i = 0; i < client.depots.length; i++) {
        if(client.depots[i].etat == "En attente") {
          return true
        }
      }
    }
  }
}
</script>