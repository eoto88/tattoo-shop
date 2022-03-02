<template>
  <v-card
      elevation="2"
      outlined
      :loading="loading"
  >
    <v-card-title class="text-h4">
      {{ nameClient }}
      <v-spacer></v-spacer>
      <v-btn
          v-if="! showEdit"
          @click="edit"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          v-if="showEdit"
      >
        <v-text-field
            v-model="name"
            :counter="100"
            :rules="nameRules"
            label="Nom"
            required
        ></v-text-field>
        <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="save"
        >
          Enregistrer
        </v-btn>
        <v-btn
            v-if="showEdit"
            @click="cancelEdit"
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

export default {
  name: 'FormClient',

  components: { DialogCancel },

  props: {
    client: {
      type: Object,
      required: {}
    },
    loading: {
      type: Boolean,
      default: false,
    },
    newClient: {
      type: Boolean,
      default: false,
    }
  },

  mounted() {
    if(this.newClient) {
      this.showEdit = true;
    }
  },

  data: () => ({
    showEdit: false,
    dialog: false,
    valid: true,
    oldName: '',
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
    ],
  }),

  computed: {
    idClient() {
      return this.$route.params.id
    },
    nameClient() {
      return this.client?.name
    }
  },

  methods: {
    save: function () {
      this.loading = true
      if(this.newClient) {
        this.$axios
          .post("/clients/", {
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
      } else {
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
      }
    },
    edit: function() {
      this.showEdit = true
      this.oldName = this.name
    },
    cancelEdit: function() {
      if(this.name == this.oldName) {
        if(this.newClient) {
          this.$router.push({path: `/`})
        } else {
          this.showEdit = false
        }
      } else {
        this.dialog = true
      }
    },
    dialogCancelEdit: function() {
      if(this.newClient) {
        this.$router.push({path: `/`})
      } else {
        this.name = this.oldName
        this.showEdit = false
        this.dialog = false
      }
    },
    dialogContinueEdit: function() {
      this.dialog = false
    }
  }
};
</script>
