<template>
  <v-card
      elevation="2"
      outlined
      :loading="loading || saveLoading"
  >
    <v-card-title class="text-h4">
      {{ nameClient }}
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

      <DialogConfirm
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
import DialogConfirm from '~/components/DialogConfirm';

export default {
  name: 'FormClient',

  components: { DialogConfirm },

  props: {
    client: {
      type: Object,
      default: function() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
    this.name = this.client.name;
  },

  data: () => ({
    saveLoading: false,
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
    },
    showEdit() {
      return this.edit;
    },
    newClient() {
      return this.idClient === undefined;
    }
  },

  methods: {
    save: function () {
      this.saveLoading = true
      if(this.newClient) {
        // TODO redirect after creation
        this.$axios
          .post("/clients/", {
            name: this.name
          }).then(response => {
          if (response.data.ok) {
            this.$router.push({path: `/client/${response.data.newId}`})
          }
        })
          .catch(error => {
            // TODO Error
          })
          .finally(() => {
            this.saveLoading = false
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
            this.saveLoading = false
          });
      }
    },
    editClient: function() {
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
