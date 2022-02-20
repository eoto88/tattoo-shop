<template>
  <v-container fill-height>
    <v-row justify-center align-center>
      <v-col
        cols="12"
      >
        <v-breadcrumbs
          large
          divider="/"
        >
          <v-breadcrumbs-item
            href="/"
          >
            Liste des clients
          </v-breadcrumbs-item>
          &nbsp;/&nbsp;
          <v-breadcrumbs-item
            disabled
          >
            Client
          </v-breadcrumbs-item>
        </v-breadcrumbs>
        <FormClient/>
      </v-col>
      <v-col
        cols="12"
      >
        <TableDepots/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormClient from '~/components/FormClient';
import TableDepots from '~/components/TableDepots';

export default {
  components: {FormClient, TableDepots},
}
</script>
