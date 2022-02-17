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
              v-for="item in depots"
              :key="item.id"
          >
            <td>{{ item.date_depot }}</td>
            <td>{{ item.montant }}</td>
            <td>{{ item.etat }}</td>
            <td>{{ item.date_etat }}</td>
            <td>{{ item.note }}</td>
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
    addDepot: function() {

    }
  }
};
</script>