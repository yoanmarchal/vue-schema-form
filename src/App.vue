<template>
  <div class="container">
    <Form :schema="UserRegisterSchema" :data="UserRegisterData" @updatedForm="onUpdateForm" />

    <pre>
      {{ formdata }}
    </pre>
  </div>

</template>

<script>
import Form from './components/Form.vue'

const UserRegisterSchema = {
  rows: [
    {
      fields: [
        {
          type: 'select-input',
          name: 'civ',
          label: 'Civilité',
          options: [
            { text: 'Mme', value: 'Madame' },
            { text: 'M.', value: 'Monsieur' }
          ],
          required: true,
          size: "col-sm-2"
        },
        {
          type: 'text-input',
          name: 'lastname',
          label: 'Nom',
          size: "col-sm-5"
        },
        {
          type: 'text-input',
          name: 'firstname',
          label: 'Prénom',
          size: "col-sm-5"
        },
      ]
    },
    {
      fields: [
        {
          type: 'date-input',
          name: 'bd',
          label: 'Date de naissance',
          size: "col-sm-6"
        },
        {
          type: 'email-input',
          name: 'mail',
          label: 'Email',
          required: true,
          size: "col-sm-6"
        },
        {
          type: 'text-input',
          name: 'address',
          label: 'Address',
          required: true,
          size: "col-sm-8"
        },
        {
          type: 'number-input',
          name: 'cp',
          label: 'Code Postal',
          required: true,
          size: "col-sm-4"
        },
        {
          type: 'text-input',
          name: 'city',
          label: 'Ville',
          required: true,
          size: "col-sm-6"
        },
        {
          type: 'number-input',
          name: 'phone',
          label: 'Téléphone',
          size: "col-sm-6"
        },
        {
          type: 'checkbox-input',
          name: 'nl',
          label: 'Newsletter'
        },
        {
          type: 'checkbox-input',
          name: 'consent',
          label: 'Consentement'
        },
      ]
    },
  ],
};

function generateFormData(schema) {
  const data = {};
  schema.rows.forEach(row => {
    row.fields.forEach(field => {
      switch (field.type) {
        case 'checkbox-input':
          data[field.name] = false;
          break;
        case 'number-input':
          data[field.name] = '';
          break;
        default:
          data[field.name] = '';
      }
    });
  });
  return data;
}

const UserRegisterData = generateFormData(UserRegisterSchema);

export default {
  name: 'App',
  data() {
    return {
      UserRegisterSchema,
      UserRegisterData,
      formdata: null
    }
  },
  components: {
    Form
  },
  methods: {
    onUpdateForm($event) {
      this.formdata = $event
    },
  }
}
</script>
