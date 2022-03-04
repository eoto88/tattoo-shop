<template>
  <v-timeline-item :color="color" left>
    <template v-slot:opposite>
      <strong>{{ dateDepot }}</strong>
    </template>
    <v-card class="elevation-2">
      <v-card-title class="text-h5">
        {{ etat }}
      </v-card-title>
      <v-card-text>
        <p>Montant: {{ montant}}</p>
        <p v-if="dateEtat">Date de changement d'état: {{ dateEtat }}</p>
        <p v-if="note">Note: {{ note }}</p>
      </v-card-text>
    </v-card>
  </v-timeline-item>
</template>

<script>

export default {
  name: 'TableClients',

  props: {
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
    }
  },

  computed: {
    color() {
      if (this.etat == 'En attente') {
        return 'yellow';
      } else if(this.etat == 'Déduit') {
        return 'green';
      } else {
        return 'red';
      }
    }
  }
}
</script>
