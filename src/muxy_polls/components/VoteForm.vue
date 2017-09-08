<template>
  <div class="vote-form">
    <ul>
      <li v-for="option in poll.options" :key="option.id">
        <label><input type="radio" v-model="checked" :value="option.id"> {{ option.name }}</label>
      </li>
    </ul>
    <br/>
    <ui-button @click="submit" color="primary">Vote</ui-button>
  </div>
</template>

<script>
  const UiButton = window.KeenUI.UiButton;

  export default {
    name: 'vote-form',

    components: { UiButton },

    props: ['poll'],

    data: () => ({
      checked: null
    }),

    methods: {
      submit() {
        this.$emit('submitVote', this.checked);
      }
    }
  };
</script>

<style lang="scss">
  .vote-form {
    color: white;
    list-style: none;
    display: flex;
    flex-direction: column;
    ul {
      list-style: none;
      font-size: 1.4em;
      padding: 0;
      margin: 0;
    }
  }
</style>
