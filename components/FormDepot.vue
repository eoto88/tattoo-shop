<template>
  <v-card
    elevation="2"
    outlined
    :loading="loading"
  >
    <v-card-title class="text-h4">
      Dépôt
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
          v-model="depot.date_depot"
        />
        <v-text-field
          v-model="depot.montant"
          type="number"
          label="Montant"
          required
        ></v-text-field>
        <v-select
          v-model="depot.etat"
          :items="etatsItems"
          label="État"
          single-line
        ></v-select>
        <DatePicker
          label="Date du dépôt"
          v-model="depot.date_etat"
        />
        <v-textarea
          label="Note"
          :value="depot.note"
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
          @click=""
        >
          Annuler
        </v-btn>
      </v-form>

      <DialogCancel
        :show="dialog"
        title="Annuler l'édition du client"
        message="Êtes-vous sûr de vouloir annuler l'édition de ce client?"
        @yes="dialogCancelEdit"
        @no="dialogContinueEdit"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import DialogCancel from '~/components/DialogCancel';
import DatePicker from "~/components/DatePicker";

export default {
  name: 'FormDepot',

  components: {DialogCancel, DatePicker},

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
    etatsItems: [
      'En attente',
      'Déduit',
      'Perdu'
    ]
  }),

  computed: {
    idClient() {
      return this.$route.query.id
    }
  },

  methods: {
    save: function () {
      this.loading = true
      this.$axios
        .put("/client/" + this.idClient, {
          name: this.name
        }).then(response => {
        if (response.data.ok) {
          this.showEdit = false
        }
      })
        .catch(error => {
          // TODO Error
        })
        .finally(() => {
          this.loading = false
        });
    },
    dialogCancelEdit: function () {
      this.name = this.oldName
      this.showEdit = false
      this.dialog = false
    },
    dialogContinueEdit: function () {
      this.dialog = false
    }
  }
};
</script>
