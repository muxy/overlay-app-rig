<template>
  <div class="game-auth-container">
    <p :class="messageClass">{{ message }}</p>

    <div>
      <alpha-numeric :length="6" placeholder="_" v-model="code"></alpha-numeric>
    </div>

    <div class="actions">
      <ui-button raised color="primary" size="small" @click="submit">Verify</ui-button>
      <ui-button color="red" size="small" @click="cancel">Cancel</ui-button>
    </div>
  </div>
</template>

<script>
import AlphaNumeric from 'shared/components/AlphaNumeric';

const UiButton = window.KeenUI.UiButton;

export default {
  name: 'game-auth',
  props: ['muxy', 'appName'],
  components: {AlphaNumeric, UiButton},
  data: () => ({
    code: '',
    message: '',
    messageClass: 'auth-notice'
  }),

  created() {
    this.message = `Enter the verification code for ${this.appName}`;
  },

  methods: {
    submit() {
      this.muxy.validateCode(this.code).then(() => {
        this.success();
      }, () => {
        this.failure();
      });
    },

    success() {
      this.message = "Token successfully validated";
      this.messageClass = 'auth-success';

      setTimeout(() => {
        this.$emit('success');
      }, 1500);
    },

    failure() {
      this.message = "Token could not be validated, try again later.";
      this.messageClass = 'auth-error';
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