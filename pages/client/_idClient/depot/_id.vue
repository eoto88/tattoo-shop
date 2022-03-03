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
import { validateUuid } from "@/helpers/validate";
import {dateNow} from "../../../../helpers/date";

export default {
  components: {FormDepot},

  computed: {
    idClient() {
      return this.$route.params.idClient
    },
    clientName() {
      if( this.client ) {
        return this.client.name
      }
      return 'Client'
    }
  },

  data() {
    return {
      client: undefined,
      depot: undefined
    }
  },

  async validate({ params }) {
    return validateUuid(params.idClient);
  },

  async fetch() {
    const idClient = this.$route.params.idClient
    this.client = await this.$axios.get('/client/' + idClient).then(response => {
      return response.data.client
    })

    if( this.$route.params.id === undefined ) {
      // Must be a creation
      this.depot = {
        date_depot: dateNow(),
        etat: 'En attente'
      }
    } else {
      const idDepot = this.$route.params.id
      this.depot = await this.$axios.get('/client/' + idClient + '/depot/' + idDepot).then(response => {
        return response.data.depot
      })
    }
  },

  // async asyncData({ error, route, $axios }) {
  //   const idClient = route.params.idClient
  //   const client = await $axios.get('/client/' + idClient).then(response => {
  //     return response.data.client
  //   })
  //
  //   let depot;
  //   if( route.params.id === undefined ) {
  //     // Must be a creation
  //     depot = {}
  //   } else {
  //     const idDepot = route.params.id
  //     depot = await $axios.get('/client/' + idClient + '/depot/' + idDepot).then(response => {
  //       return response.data.depot
  //     })
  //   }
  //   return {
  //     client,
  //     depot
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
          disabled: false,
          href: '/client/' + this.idClient,
        },
        {
          text: 'Dépôt',
          disabled: true
        }
      ]
    }
  }
}
</script>
