<template>
  <div class="loading">
    <i class="fa fa-spinner fa-spin"></i>
  </div>
</template>

<script>
export default {
  name: 'loader'
};
</script>

<style scoped lang="scss">
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 20px;
  text-align: center;

  img.logo {
    display: block;
    height: 150px;
    margin: 0 auto;
    width: 150px;
  }

  .fa-spinner {
    color: #699C9C;
    font-size: 4rem;
    margin-top: 20px;
  }
}
</style>
