<template>
  <v-container>
    <v-row justify-center align-center>
      <v-col
        cols="12"
      >
        <v-breadcrumbs
          large
          :items="getBreadcrumb()"
          divider="/"
        ></v-breadcrumbs>
        <FormClient
          :client="client"
          :loading="!client"
          :newClient="newClient"
        />
      </v-col>
      <v-col
        cols="12"
      >
        <TableDepots
          :depots="depots"
          :loading="depotsLoading"
          v-if="!newClient"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormClient from '~/components/FormClient';
import TableDepots from '~/components/TableDepots';
import { validateUuid } from "@/helpers/validate";

export default {
  components: {FormClient, TableDepots},

  computed: {
    clientName() {
      if( this.client?.name ) {
        return this.client.name
      }
      return 'Client'
    },
    newClient() {
      return this.$route.params.id === undefined
    }
  },

  data() {
    return {
      loading: true,
      client: undefined,
      depotsLoading: true,
      depots: []
    }
  },

  // async validate({ params }) {
  //   return validateUuid(params.id);
  // },

  async fetch() {
    const idClient = this.$route.params.id
    if(idClient) {
      this.client = await this.$axios.get('/client/' + idClient).then(response => {
        return response.data.client
      })

      this.depots = await this.$axios.get('/client/' + idClient + '/depots').then(response => {
        this.depotsLoading = false;
        return response.data.depots
      })
    } else {
      this.client = {};
      this.depotsLoading = false;
    }
  },

  // async asyncData({ error, route, store }) {
  //   if( route.params.id === undefined ) {
  //     error({ statusCode: 404, message: 'Client not found' })
  //   } else {
  //     store.dispatch('client/get', {
  //       idClient: route.params.id,
  //     });
  //
  //     store.dispatch('client/getDepots', {
  //       idClient: route.params.id,
  //     });
  //   }
  // },

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
          disabled: true,
        }
      ]
    }
  }
}
</script>
