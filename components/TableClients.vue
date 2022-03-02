<template>
  <v-card
    class="mx-auto"
    :loading="loading"
  >
    <v-card-title>
      Liste des clients
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col md="6" cols="12">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Recherche"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col md="4" cols="6">
          <v-select
            :items="filters"
            label="Filtre"
          ></v-select>
        </v-col>
        <v-col md="2" cols="6">
          <v-btn
            color="success"
            @click="addClient"
          >
            Créer un client
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="clients"
      :search="search"
      :items-per-page="rowsPerpage"
      fixed-header
      height="600px"
      @click:row="editClient"
    >
      <template v-slot:item.nbDepots="{ item }">
        {{ getDepotsCount(item) }}
      </template>
      <template v-slot:item.waitingDepots="{ item }">
        <v-chip
          color="orange"
          v-if="hasDepotWaiting(item)"
        >{{ getDepotWaitingCount(item) }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

export default {
  name: 'TableClients',

  props: {
    clients: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    rowsPerpage: -1,
    search: '',
    headers: [
      {
        text: 'Nom',
        align: 'start',
        sortable: true,
        value: 'name',
      },
      {text: 'Nombre de dépot', value: 'nbDepots'},
      {text: 'Dépôts en attente', value: 'waitingDepots'},
    ],
    filters: [
      'Avec dépôts en attentes'
    ]
  }),

  methods: {
    addClient: function () {
      this.$router.push({path: `/client/`})
    },
    editClient: function (client) {
      this.$router.push({path: `/client/${client.id}`})
    },
    getDepotsCount: function (client) {
      const depotsCount = client.depots.length
      if (depotsCount > 1) {
        return `${depotsCount} dépôts`
      } else {
        return `${depotsCount} dépôt`
      }
    },
    hasDepotWaiting: function (client) {
      for (let i = 0; i < client.depots.length; i++) {
        if (client.depots[i].etat == "En attente") {
          return true
        }
      }
    },
    getDepotWaitingCount: function (client) {
      let count = 0;
      for (let i = 0; i < client.depots.length; i++) {
        if (client.depots[i].etat == "En attente") {
          count++
        }
      }
      return count;
    }
  }
}
</script>
