<template>
  <form @submit.prevent="submit" class="board-card">
    <div class="board-card__inner">
      <router-link draggable="false" class="board-card__link" :to="{ name: 'card', params: { boardIndex, columnIndex, cardIndex }}">
        <input v-model="card.name"
               v-if="editable"
               v-focus
               @blur="blur"
               class="board-card__name-input">

        <span v-else class="board-card__name" @click.stop.prevent="edit">
          {{ card.name }}
        </span>
      </router-link>
    </div>
  </form>
</template>

<script>
  export default {
    props: {
      boardIndex: Number,
      columnIndex: Number,
      cardIndex: Number,
      card: Object,
    },
    data(){
      return {
        editable: false,
      }
    },
    methods: {
      blur() {
        this.editable = false;

        this.$store.commit('updateCard', {
          boardIndex: this.boardIndex,
          columnIndex: this.columnIndex,
          cardIndex: this.cardIndex,
          card: this.card,
        })
      },
      edit() {
        this.editable = true;
      },
      submit() {
        this.blur();
      },
    }
  }
</script>

<style lang="sass">
  .board-card
    background-color: #fff
    border-radius: 3px
    box-shadow: 0 1px 0 #ccc
    color: #222
    padding: 5px 10px
    font-size: 14px

    &__link
      display: block
      width: 100%

    &__name
      cursor: text
      display: inline-block
      padding-top: 3px

    &__name,
    &__name-input
      height: 21px

    &__name-input
      border: 0
      width: 100%
      padding: 0

      &:focus
        outline: none
</style>
