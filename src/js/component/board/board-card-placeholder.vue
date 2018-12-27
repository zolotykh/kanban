<template>
  <div class="board-card-container">
    <div class="board-card-placeholder" :style="style"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState(['movableCard']),

      style() {
        if (this.movableCard) {
          return {
            height: this.movableCard.height + 'px',
          };
        }

        return null;
      },
    }
  }
</script>

<style lang="sass">
  .board-card-placeholder
    background-color: #D5DBDF
    border-radius: 3px
</style>
