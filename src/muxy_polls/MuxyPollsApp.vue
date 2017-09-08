<template>
  <!-- Your app's template can only have a single top-level element. -->
  <div class="vote-modal">
    <!-- Here we use the `option` helper to keep track if there is a poll or not
         https://github.com/muxy/overlay-app-rig/blob/master/docs/AppBehavior.md#get-state -->
    <div v-if="option('poll.id')">
      <h1 class="ma-2">{{ option('poll.question') }}</h1>

      <!-- If there is a userVote show the results, if not show the current vote data. -->
      <div v-if="userVote === null">
        <!-- Component that allows voting. We pass the the poll info from the `option` helper through to it -->
        <VoteForm :poll="option('poll')" @submitVote="submitVote"></VoteForm>
      </div>
      <div v-else>
        <!-- Component that renders poll results. We pass voteData through to it -->
        <RateForm :poll="option('poll')" :voteData="voteData"></RateForm>
        <br/>
        <ui-button @click="changeVote" color="primary">Change Vote</ui-button>
      </div>
    </div>
    <div v-else>
      <h2>No active poll</h2>
    </div>
  </div>
</template>

<script>
  import AppMixin from 'shared/js/app-mixin';
  import VoteForm from './components/VoteForm';
  import RateForm from './components/RateForm';

  // This is the main access point to this app.
  const UiIconButton = window.KeenUI.UiIconButton;
  const UiButton = window.KeenUI.UiButton;
  const UiRadioGroup = window.KeenUI.UiRadioGroup;

  export default {
    // The name field must be your blessed app id and be the same as appears in config.json.
    name: 'muxy_polls',
    // Components are other .vue files that define the appearance and behavior of DOM elements.
    // Here we import the button and textbox elements from KeenUI and make them accessible
    // to the DOM.
    components: { UiIconButton, UiButton, UiRadioGroup, VoteForm, RateForm },
    // The AppMixin provides access to several convenience methods, such as the powerful
    // `option` function.
    mixins: [AppMixin],

    // Any fields added to your `data` object are accessible on `this` in your
    // class methods or directly in your template elements.
    data: () => ({
      voteListener: null,
      voteData: null,
      userVote: null,
      popTimeout: null
    }),

    // Any methods defined here can be called from your template elements.
    methods: {
      pop() {
        if (!this.shown) {
          this.show();
          this.popTimeout = setTimeout(this.unpop, 10000);
        }
      },

      unpop() {
        this.hide();
      },

      // If a user interacts with a poll don't auto hide it.
      interact() {
        if (this.popTimeout) {
          clearTimeout(this.popTimeout);
          this.popTimeout = null;
        }
      },

      submitVote(vote) {
        this.interact();

        // Store the user's vote
        this.userVote = vote;

        // Check to make sure we actually have a valid poll
        if (this.option('poll.id')) {
          // Vote to the poll ID from the `option` helper
          // https://github.com/muxy/overlay-app-rig/blob/master/docs/Vote.md#sending-votes
          this.muxy.vote(this.option('poll.id'), vote).then((data) => {
            // Show the returned vote data
            this.voteData = data;
          });
        }
      },

      changeVote() {
        this.interact();
        this.userVote = null;
      }
    },

    mounted() {
      // Listen for mousemove events from the overlay root
      this.$root.$on('user-mousemove', (event) => {
        const rect = this.$el.getBoundingClientRect();

        // If the user has moved their mouse over a poll it counts as "interacting"
        if (event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom) {
          this.interact();
        }
      });

      // Watch for changes to the current poll
      // This will immediately callback on initial load
      // https://github.com/muxy/overlay-app-rig/blob/master/docs/AppBehavior.md#persisting-state
      this.option('poll', (poll) => {
        if (poll && poll.id) {
          this.userVote = null;

          // Fetch the current poll results
          // https://github.com/muxy/overlay-app-rig/blob/master/docs/Vote.md#getting-votes
          this.muxy.getVoteData(poll.id).then((voteData) => {
            this.voteData = voteData;

            // Store if the user has voted
            if (voteData.specific.vote) {
              this.userVote = voteData.specific.vote;
            }

            // if poll was created less than 30 seconds ago pop poll
            if ((new Date().getTime() / 1000) - parseInt(poll.id, 10) < 30) {
              this.pop();
            }
          });
        }
      });

      // Listen to all vote events
      // https://github.com/muxy/overlay-app-rig/blob/master/docs/Vote.md#automatic-vote-updates
      this.voteListener = this.muxy.listen('vote_update:*', (voteData) => {
        // Only pass the poll data along if the id matches the current poll
        if (this.option('poll.id') === voteData.id) {
          this.voteData = voteData.stats;
        }
      });
    },

    destroyed() {
      if (this.voteListener) {
        this.muxy.unlisten(this.voteListener);
      }
    }
  };
</script>

<style lang="scss">
  @import url(//fonts.googleapis.com/css?family=Raleway:300);

  .vote-modal {
    user-select: none;
    width: 20vw;
    min-width: 350px;
    background-color: #454545;
    vertical-align: middle;
    padding: 16px;
    h1,
    h2 {
      font-family: 'Raleway', sans-serif;
      color: #fff;
      font-weight: 300;
      margin-top: 10px;
      word-wrap: break-word;
      white-space: normal;
    }

    border-radius: 5px;
  }
</style>