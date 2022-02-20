<template>
  <v-card>
    <v-card-title class="text-h5">
      Liste des dépôts
    </v-card-title>
    <v-card-text>
      <v-simple-table
        fixed-header
        height="300px"
      >
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Date de dépôt
            </th>
            <th class="text-left">
              Montant
            </th>
            <th class="text-left">
              État
            </th>
            <th class="text-left">
              Date de changement d'état
            </th>
            <th class="text-left">
              Note
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="depot in depots"
            :key="depot.id"
            @click="editDepot(depot)"
          >
            <td>{{ depot.date_depot }}</td>
            <td>{{ depot.montant }}</td>
            <td>{{ depot.etat }}</td>
            <td>{{ depot.date_etat }}</td>
            <td>{{ depot.note }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="success"
        @click="addDepot"
      >
        Ajouter un dépôt
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'TableDepots',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  async fetch() {
    const idClient = this.$route.query.id
    this.depots = await this.$axios.get('/client/' + idClient + '/depots').then(response => {
      return response.data.depots
    })
  },

  data() {
    return {
      depots: [],
    };
  },

  methods: {
    editDepot: function (depot) {
      const idClient = this.$route.query.id
      this.$router.push({path: '/depot', query: {id: depot.id, idClient}})
    },
    addDepot: function () {
      const idClient = this.$route.query.id
      this.$router.push({path: '/depot', query: {idClient}})
    }
  }
};
</script>
