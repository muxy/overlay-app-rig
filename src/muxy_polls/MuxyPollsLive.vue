<template>
  <!-- Your app's template can only have a single top-level element. -->
  <div class="polls-vote-live">
    <!-- Here we use the `option` helper to keep track if there is a poll or not -->
    <div v-if="option('poll.id')" class="vote-modal">
      <h1 class="ma-2">{{ option('poll.question') }}</h1>
      <!-- Component that renders poll results. We pass voteData through to it -->
      <RateForm :poll="option('poll')" :voteData="voteData"></RateForm>
      <br/>
      <ui-button color="red" @click="deletePoll">Delete Poll</ui-button>
    </div>
    <div v-else class="create-a-poll">
      <h1>Create a Poll</h1>
      <!-- The ui-textbox elements are imported from KeenUI below. -->
      <ui-textbox label="Question" v-model="poll.question"></ui-textbox>
      <ui-textbox v-for="(option, index) in poll.options" :label="'Option'+(index+1)" :value="option.name"
                  v-model="option.name" :key="index" @keydown="createNewOption(index)"></ui-textbox>

      <div class="action">
        <ui-button color="primary" raised @click="createPoll">
          Create
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
  import AppMixin from 'shared/js/app-mixin';

  import RateForm from './components/RateForm';

  const UiButton = window.KeenUI.UiButton;
  const UiTextbox = window.KeenUI.UiTextbox;

  export default {
    name: 'muxy_polls_live',

    mixins: [AppMixin],

    components: { UiButton, UiTextbox, RateForm },

    data: () => ({
      poll: {
        question: '',
        options: []
      },
      voteData: null
    }),
    created() {
      this.setupEmptyPoll();
    },

    mounted() {
      // Watch for changes to the current poll
      // This will immediately callback on initial load
      // https://github.com/muxy/overlay-app-rig/blob/master/docs/AppBehavior.md#watching-state
      this.option('poll', (poll) => {
        if (poll && poll.id) {
          // Fetch the current poll results
          // https://github.com/muxy/overlay-app-rig/blob/master/docs/Vote.md#getting-votes
          this.muxy.getVoteData(poll.id).then((voteData) => {
            this.voteData = voteData;
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

    // Any methods defined here can be called from your template elements.
    methods: {
      setupEmptyPoll() {
        this.poll.question = '';
        this.poll.options = [];
        for (let i = 0; i < 3; i += 1) {
          this.poll.options.push({
            id: i,
            name: ''
          });
        }
      },

      createPoll() {
        const options = {
          poll: {
            id: String(Math.round(new Date().getTime() / 1000)), // Use the current time as a poll ID
            question: this.poll.question,
            options: this.filterOptions(this.poll.options)
          }
        };

        // Save the poll info to options so that it gets propagated out
        // https://github.com/muxy/overlay-app-rig/blob/master/docs/AppBehavior.md#persisting-state
        this.saveChannelOptions(options);
      },

      // Remove options that don't have any text
      filterOptions(data) {
        const lastElement = data.length - 1;
        if (data[lastElement].name === '') {
          data.splice(lastElement, 1);
        }
        return data;
      },

      deletePoll() {
        const options = {
          poll: null
        };

        // Save the empty poll to options so that it gets propagated out
        // https://github.com/muxy/overlay-app-rig/blob/master/docs/AppBehavior.md#persisting-state
        this.saveChannelOptions(options);

        this.setupEmptyPoll();
      },

      // Add a new field if the user has typed into the last field. (Up to 5 fields)
      createNewOption(index) {
        if (index === this.poll.options.length - 1 &&
          !this.poll.options[index].name && index < 4) {
          this.poll.options.push({
            id: index + 2,
            name: ''
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import url(//fonts.googleapis.com/css?family=Raleway:300);

  h1,
  h2 {
    font-family: 'Raleway', sans-serif;
    color: #fff;
    font-weight: 300;
    margin-top: 10px;
    word-wrap: break-word;
    white-space: normal;
    width: 100%;
  }

  .create-a-poll {
    h1, h2 {
      color: black;
    }
  }

  .polls-vote-live {
    max-width: 100%;
    margin: 0;
    padding: 5px;

    .vote-modal {
      background-color: #454545;
      border-radius: 5px;
      padding: 16px;
    }
  }
</style>