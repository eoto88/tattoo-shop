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
          :edit="editFormClient || newClient"
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
    <DialogConfirm
      :show="showDialogConfirm"
      title="Supprimer le client client"
      message="Êtes-vous sûr de vouloir supprimer ce client?"
      @yes="deleteClient"
      @no="cancelDeleteClient"
    ></DialogConfirm>
    <SpeedDial :buttons="speedDialButtons"></SpeedDial>
  </v-container>
</template>

<script>
import FormClient from '~/components/FormClient';
import TableDepots from '~/components/TableDepots';
import {validateUuid} from "@/helpers/validate";
import DialogConfirm from "../../components/DialogConfirm";
import SpeedDial from "../../components/SpeedDial";

export default {
  components: { SpeedDial, FormClient, TableDepots, DialogConfirm },

  computed: {
    clientName() {
      if (this.client?.name) {
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
      editFormClient: false,
      showDialogConfirm: false,
      fab: false,
      loading: true,
      client: undefined,
      depotsLoading: true,
      depots: [],
      speedDialButtons: [
        {
          color: 'indigo',
          title: 'Ajouter un dépôt',
          icon: 'mdi-plus',
          handler: this.addDepot
        },
        {
          color: 'green',
          title: 'Éditer le client',
          icon: 'mdi-pencil',
          handler: this.editClient
        },
        {
          color: 'red',
          title: 'Supprimer le client',
          icon: 'mdi-delete',
          handler: this.confirmDeleteClient
        },
      ]
    }
  },

  async fetch() {
    const idClient = this.$route.params.id
    if (idClient) {
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
    },
    addDepot() {
      const idClient = this.$route.params.id
      this.$router.push({ path: `/client/${idClient}/depot/` })
    },
    editClient() {
      if (this.editFormClient) {
        // TODO Annuler l'édition si déjà en mode d'édition
        this.editFormClient = false;
      } else {
        this.editFormClient = true;
      }
    },
    confirmDeleteClient() {
      this.showDialogConfirm = true;
    },
    cancelDeleteClient() {
      this.showDialogConfirm = false;
    },
    deleteClient() {
      const idClient = this.$route.params.id
      this.$axios
        .delete("/client/" + idClient).then(response => {
        if (response.data.ok) {
          this.$router.push({ path: '/' })
        }
      }).catch(error => {
        // TODO Error
      }).finally(() => {
        this.showDialogConfirm = false;
      });
    },
  }
}
</script>
