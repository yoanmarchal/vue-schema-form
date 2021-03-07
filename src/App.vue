<template>
  <div class="container">
    <Form :schema="UserRegisterSchema" :data="UserRegisterData" @updatedForm="onUpdateForm" />

    <pre>
      {{formdata}}
    </pre>
  </div>

</template>

<script>
import Form from './components/Form.vue'
import textInput from './components/TextInputTest.vue'

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
const UserRegisterData = {
  civ: {
    value: ''
  },
  firstname:  {
    value: 'Yo'
  },
  lastname: {
    value: 'Yo'
  },
  bd: {
    value: ''
  },
  mail: {
    value: ''
  },
  address: {
    value: ''
  },
  cp: {
    value: ''
  },
  city: {
    value: ''
  },
  phone: {
    value: ''
  },
  nl: {
    value: ''
  },
  consent: {
    value: ''
  },
};

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
    Form,
    textInput
  },
  methods: {
    onUpdateForm($event) {
      console.log($event);
      this.formdata = $event
    },
  }
}
</script>
