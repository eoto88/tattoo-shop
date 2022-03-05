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
      </v-col>
      <v-col
        cols="12"
      >
        <FormClient
          :client="client"
          :loading="!client"
          :edit="editFormClient || newClient"
        />
      </v-col>
      <v-col
        cols="12"
      >
        <v-expansion-panels multiple :value="openedPanels">
          <v-expansion-panel>
            <v-expansion-panel-header class="text-h5">
              Ligne du temps des dépôts
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-timeline :dense="mobile">
                <TimelineDepot
                  v-for="(depot ,i) in depots"
                  :key="i"
                  :id-depot="depot.id"
                  :date-depot="depot.date_depot"
                  :montant="depot.montant"
                  :etat="depot.etat"
                  :date-etat="depot.date_etat"
                  :note="depot.note"
                  :mobile="mobile"
                  v-if="!newClient"
                />
              </v-timeline>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="text-h5">
              Liste des dépôts
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <TableDepots
                :depots="depots"
                :loading="depotsLoading"
                v-if="!newClient"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <DialogConfirm
      :show="showDialogConfirm"
      title="Supprimer le client"
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
import DialogConfirm from "../../components/DialogConfirm";
import SpeedDial from "../../components/SpeedDial";
import TimelineDepot from "../../components/TimelineDepot";

export default {
  components: { SpeedDial, FormClient, TableDepots, DialogConfirm, TimelineDepot },

  computed: {
    mobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
      openedPanels: [0],
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
      this.$vuetify.goTo(0)
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
