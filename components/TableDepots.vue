<template>
  <v-card
    :loading="loading"
  >
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="depots"
        fixed-header
        height="300px"
        :loading="loading"
        @click:row="editDepot"
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TableDepots',
  props: {
    depots: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      headers: [
        { text: 'Date du dépôt', value: 'date_depot' },
        { text: 'Montant', value: 'montant' },
        { text: 'État', value: 'etat' },
        { text: 'Date de changement d\'état', value: 'date_etat' },
        { text: 'Note', value: 'note' },
      ],
    };
  },

  methods: {
    editDepot: function (depot) {
      const idClient = this.$route.params.id
      const idDepot = depot.id
      this.$router.push({path: `/client/${idClient}/depot/${idDepot}`})
    },
  }
};
</script>
