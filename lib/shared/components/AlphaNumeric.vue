<template>
  <div class="alpha-numeric">
    <template v-for="(item, index) in values">
      <input maxlength=1 :placeholder="placeholder" ref="inputs"
        @keydown="keydown(index, $event)"
        @keydown.left="focus(index - 1)"
        @keydown.right="focus(index + 1)"
        @keydown.delete.prevent="del(index, $event)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'alpha-numeric',
  props: ['input', 'length', 'placeholder'],

  data: () => ({
    values: []
  }),

  created() {
    this.values = Array(this.length).fill('');
  },

  methods: {
    keydown(ind, e) {
      const value = String.fromCharCode(e.keyCode);
      const regexp = /[A-Za-z0-9]/;
      if (!regexp.test(value)) {
        return;
      }

      this.values[ind] = value;
      this.$refs.inputs[ind].value = value;
      this.assembleInputs();
      this.focus(ind + 1);

      e.preventDefault();
    },

    focus(ind) {
      if (ind < 0) {
        ind = 0;
      }

      if (ind >= this.length - 1) {
        ind = this.length - 1;
      }

      this.$refs.inputs[ind].focus();
    },

    del(ind, e) {
      if (this.values[ind] === '') {
        ind -= 1;
        if (ind < 0) {
          ind = 0;
        }

        this.focus(ind);
      }
      this.values[ind] = '';
      this.$refs.inputs[ind].value = '';
      this.assembleInputs();
    },

    assembleInputs() {
      this.$emit('input', this.values.join(''));
    }
  }
}
</script>

<style lang="scss">
.alpha-numeric {
  input {
    font-family: sans-serif;;
    font-weight: 200;
    width: 40px;
    height: 50px;
    border: 1px solid #CCCCCC;
    margin-right: 10px;
    outline: 0;
    font-size: 28px;
    color: #333;
    line-height: 40px;
    text-align: center;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      color: #9B9B9B;
    }

    &:focus {
      color: #0091FF;
      border-color: #0091FF;
    }
  }
}
</style>
