<template>
  <div class="rate-form">
    <RateBar v-for="option in poll.options" :key="option.id" :optionValue="option" :voteData="voteData"></RateBar>
  </div>
</template>

<script>
  import RateBar from './RateBar';

  const UiButton = window.KeenUI.UiButton;

  export default {
    name: 'rate-form',
    components: { UiButton, RateBar },
    props: ['poll', 'voteData']
  };
</script>

<style lang="scss" scoped>
  .rate-form {
    border-top-style: solid;
    border-right-style: solid;
    border-left-style: solid;

    border-width: 1px;
    border-color: #535353;

    .rate-bar {
      border-width: 1px;
      border-bottom-style: solid;
      border-color: #535353;
      padding: 16px;
    }
  }
</style>
