<template>
  <div class="game-auth-container">
    <ui-alert :type="alertType" v-show="showAlert">{{ message }}</ui-alert>

    <div>
      <p>Enter the verification code for {{ appName }}.</p>
      <alpha-numeric :length="codeLength" placeholder="_" v-model="code"></alpha-numeric>
    </div>

    <div class="actions">
      <ui-button raised color="primary" size="small" @click="submit">Verify</ui-button>
      <ui-button v-if="showCancel" color="red" size="small" @click="cancel">Cancel</ui-button>
    </div>
  </div>
</template>

<script>
import AlphaNumeric from 'shared/components/AlphaNumeric';

const UiAlert = window.KeenUI.UiAlert;
const UiButton = window.KeenUI.UiButton;

const codeLength = 4;

export default {
  name: 'game-auth',
  props: ['muxy', 'appName', 'showCancel'],
  components: { AlphaNumeric, UiAlert, UiButton },
  data: () => ({
    codeLength,
    code: '',
    message: '',
    alertType: '',
    showAlert: false
  }),

  created() {
    this.message = `${this.appName}`;
  },

  methods: {
    submit() {
      if (this.code.length != codeLength) {
        this.showAlert = true;
        this.message = `The PIN must be at least ${codeLength} characters.`;
        this.alertType = 'warning';
        return;
      }
      this.muxy.validateCode(this.code)
        .then(this.success, this.failure);
    },

    success() {
      this.showAlert = true;
      this.message = 'Token successfully validated';
      this.alertType = 'success';

      setTimeout(() => {
        this.$emit('success');
      }, 1500);
    },

    failure() {
      this.showAlert = true;
      this.message = 'Token could not be validated, please try again.';
      this.alertType = 'error';
      this.$emit('failure');
    },

    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss">
.game-auth-container {
  width: 100%;

  .actions {
    margin-top: 10px;
  }
}
</style>