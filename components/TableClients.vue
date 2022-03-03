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
        <v-col md="12" cols="12">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Recherche"
            single-line
            hide-details
          ></v-text-field>
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
      <template v-slot:item.depotsCount="{ item }">
        {{ getDepotsCount(item.depotsCount) }}
      </template>
      <template v-slot:item.waitingDepotsCount="{ item }">
        <v-chip
          color="orange"
          v-if="item.waitingDepotsCount > 0"
        >{{ item.waitingDepotsCount }}
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
      { text: 'Nom', value: 'name' },
      { text: 'Nombre de dépot', value: 'depotsCount' },
      { text: 'Dépôts en attente', value: 'waitingDepotsCount' },
    ],
    filters: [
      'Avec dépôts en attentes'
    ]
  }),

  methods: {
    editClient: function (client) {
      this.$router.push({path: `/client/${client.id}`})
    },
    getDepotsCount: function (depotsCount) {
      if (depotsCount > 1) {
        return `${depotsCount} dépôts`
      } else {
        return `${depotsCount} dépôt`
      }
    },
  }
}
</script>
