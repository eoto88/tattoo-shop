<template>
  <v-card
    elevation="2"
    outlined
    :loading="loading"
  >
    <v-card-title class="text-h4">
      {{ formTitle }}
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <DatePicker
          label="Date du dépôt"
          v-model="mutatedDepot.date_depot"
        />
        <v-text-field
          v-model="mutatedDepot.montant"
          type="number"
          label="Montant"
          required
        ></v-text-field>
        <v-select
          v-model="mutatedDepot.etat"
          :items="etatsItems"
          label="État"
          single-line
          @change="handleOnEtatChange"
        ></v-select>
        <DatePicker
          label="Date du changement d'état"
          v-model="mutatedDepot.date_etat"
        />
        <v-textarea
          label="Note"
          :value="mutatedDepot.note"
        ></v-textarea>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="save"
        >
          Enregistrer
        </v-btn>
        <v-btn
          @click="$router.go(-1)"
        >
          Annuler
        </v-btn>
      </v-form>

      <DialogConfirm
        :show="dialog"
        title="Annuler l'édition du client"
        message="Êtes-vous sûr de vouloir annuler l'édition de ce client?"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DialogConfirm from '~/components/DialogConfirm';
import DatePicker from "~/components/DatePicker";
import {dateNow} from "../helpers/date";

export default {
  name: 'FormDepot',

  components: {DialogConfirm, DatePicker},

  props: {
    depot: {
      type: Object,
      default() {
        return {};
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    dialog: false,
    valid: true,
    // mutatedDepot: {
    //   date_depot: null,
    //   montant: null,
    //   etat: null,
    //   date_etat: null,
    //   note: null
    // },
    etatsItems: [
      'En attente',
      'Déduit',
      'Perdu'
    ]
  }),

  computed: {
    formTitle() {
      if(this.depot?.date_depot) {
        return "Dépôt du " + this.depot.date_depot
      } else {
        return "Dépôt"
      }
    },
    idClient() {
      return this.$route.query.idClient
    },
    idDepot() {
      return this.$route.query.id
    },
    mutatedDepot() {
      return this.depot;
    }
  },

  methods: {
    handleOnEtatChange(newEtat) {
      if(newEtat == "En attente") {
        this.mutatedDepot.date_etat = null
      } else {
        this.mutatedDepot.date_etat = dateNow()
      }
    },
    save: function () {
      this.$axios
        .put("/client/" + this.idClient + '/depot/' + this.idDepot, {
          date_depot: this.mutatedDepot.date_depot,
          montant: this.mutatedDepot.montant,
          etat: this.mutatedDepot.etat,
          date_etat: this.mutatedDepot.date_etat,
          note: this.mutatedDepot.note
        }).then(response => {
        if (response.data.ok) {
          this.showEdit = false
        }
      })
        .catch(error => {
          // TODO Error
        })
        .finally(() => {
          // this.loading = false
        });
    },
  }
};
</script>
