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
        <FormClient :client="client" />
      </v-col>
      <v-col
        cols="12"
      >
        <TableDepots :depots="depots" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import FormClient from '~/components/FormClient';
import TableDepots from '~/components/TableDepots';
import { validateUuid } from "@/helpers/validate";

export default {
  components: {FormClient, TableDepots},

  computed: {
    ...mapGetters('client', ['client', 'depots']),
    clientName() {
      if( this.client ) {
        return this.client.name
      }
      return 'Client'
    }
  },

  async validate({ params }) {
    return validateUuid(params.id);
  },

  async asyncData({ error, route, store }) {
    if( route.params.id === undefined ) {
      error({ statusCode: 404, message: 'Client not found' })
    } else {
      store.dispatch('client/get', {
        idClient: route.params.id,
      });

      store.dispatch('client/getDepots', {
        idClient: route.params.id,
      });
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
          disabled: true,
        }
      ]
    }
  }
}
</script>
