<template>
  <v-container fill-height>
    <v-row justify-center align-center>
      <v-col
        cols="12"
      >
        <v-breadcrumbs
          large
          :items="getBreadcrumb()"
          divider="/"
        ></v-breadcrumbs>
        <FormDepot :depot="depot" :loading="!depot" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormDepot from '~/components/FormDepot';

export default {
  components: {FormDepot},

  data: () => ({
    breadcrumb: [],
    client: undefined,
    depot: undefined
  }),

  async fetch() {
    await this.fetchClient();
    await this.fetchDepot();
  },

  computed: {
    idClient() {
      return this.$route.query.idClient
    },
    clientName() {
      if( this.client ) {
        return this.client.name
      }
      return 'Client'
    }
  },

  methods: {
    getBreadcrumb() {
      return [
        {
          text: 'Liste des clients',
          disabled: false,
          href: '/',
        },
        {
          text: this.clientName,
          disabled: false,
          href: '/client?id=' + this.idClient,
        },
        {
          text: 'Dépôt',
          disabled: true
        }
      ]
    },
    async fetchClient() {
      const idClient = this.$route.query.idClient
      try {
        this.client = await this.$axios.get('/client/' + idClient).then(response => {
          return response.data.client
        })
      } catch (e) {
        this.client = {};
      }
    },
    async fetchDepot() {
      const idDepot = this.$route.query.id
      const idClient = this.$route.query.idClient
      if (idClient && idDepot) {
        this.depot = await this.$axios.get('/client/' + idClient + '/depot/' + idDepot).then(response => {
          return response.data.depot
        })
      }
    },
  }
}
</script>
