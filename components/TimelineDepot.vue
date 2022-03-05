<template>
  <v-timeline-item :color="color" :icon="icon" large>
    <template v-slot:opposite>
      <strong>{{ localeDate(dateDepot) }}</strong>
    </template>
    <v-card class="elevation-5">
      <v-card-title class="text-h6">
        <span v-if="!mobile">Dépôt du&nbsp;</span>
        {{ localeDate(dateDepot) }}
        <v-spacer></v-spacer>
        <v-btn
          class="ma-2 edit-timeline"
          small
          dark
          fab
          color="green"
          @click="editDepot">
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon title="Montant du dépôt">mdi-currency-usd</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ montant }}</v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon title="État du dépôt">mdi-state-machine</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ etat }}</v-list-item-content>
          </v-list-item>
          <v-list-item v-if="dateEtat">
            <v-list-item-icon>
              <v-icon title="Date de changement d'état">mdi-calendar-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ dateEtat }}</v-list-item-content>
          </v-list-item>
          <v-list-item v-if="note">
            <v-list-item-icon>
              <v-icon title="Note du dépôt">mdi-note</v-icon>
            </v-list-item-icon>
            <v-list-item-content>{{ note }}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>

<script>
import {localeDate} from "~/helpers/date";

export default {
  name: 'TableClients',

  props: {
    idDepot: {
      type: String,
      required: true
    },
    dateDepot: {
      type: String,
      required: true
    },
    montant: {
      type: Number,
      required: true
    },
    etat: {
      type: String,
      required: 'En attente'
    },
    dateEtat: {
      type: String,
      required: ''
    },
    note: {
      type: String,
      default: ''
    },
    mobile: {
      type: Boolean,
      default: false
    },
  },

  computed: {
    color() {
      if (this.etat == 'En attente') {
        return 'orange';
      } else if (this.etat == 'Déduit') {
        return 'green';
      } else {
        return 'red';
      }
    },
    icon() {
      if (this.etat == 'En attente') {
        return 'mdi-cash-fast';
      } else if (this.etat == 'Déduit') {
        return 'mdi-check';
      } else {
        return 'mdi-check';
      }
    }
  },

  methods: {
    editDepot: function () {
      const idClient = this.$route.params.id
      this.$router.push({ path: `/client/${idClient}/depot/${this.idDepot}` })
    },
    localeDate(date) {
      return localeDate(date);
    },
  },
}
</script>

<style>
.edit-timeline {
  position: absolute;
  top: -20px;
  right: -20px;
}
</style>
