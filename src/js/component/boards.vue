<template>
  <div class="boards" :class="classList">
    <div class="board-previews">
      <div class="board-previews__list">
        <div class="board-previews__item" v-for="(board, boardIndex) in boards" :key="board.id">
          <div class="board-previews__item-actions">
            <actions-toggle></actions-toggle>

            <ul class="actions actions--top-right">
              <li class="actions__action">
                <button class="btn btn-sm btn-danger" @click.prevent="removeBoard(boardIndex)">Remove board</button>
              </li>
            </ul>
          </div>

          <router-link :to="{ name: 'board', params: { boardIndex }}" class="board-preview">
            <div class="board-preview__title">{{ board.name }}</div>
          </router-link>
        </div>

        <div class="board-previews__item">
          <button class="board-preview board-preview--create" @click.prevent="addBoard">
            <span class="board-preview__title">+ Add board</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ActionsToggle from './utils/actions-toggle';

  export default {
    name: 'boards',
    components: { ActionsToggle },
    computed: {
      ...mapState({
        boards: (state) => state.boards,
        movableColumn: (state) => state.movableColumn,
        movableCard: (state) => state.movableCard,
        readyForColumnMoving: (state) => state.readyForColumnMoving,
        readyForCardMoving: (state) => state.readyForCardMoving,
      }),
      classList() {
        return {
          'moving moving-card': this.movableCard,
          'moving moving-column': this.movableColumn,
          'no-select': this.readyForColumnMoving || this.readyForCardMoving,
        };
      },
    },
    methods: {
      ...mapActions(['addBoard']),
      removeBoard(boardIndex) {
        this.$store.dispatch('removeBoard', { boardIndex });
      },
    },
  };
</script>

<style lang="sass">
  .board-previews
    padding: 30px
    max-width: 980px
    margin: auto

    &__list
      display: flex
      flex-flow: row wrap
      margin: -10px

    &__item
      flex-basis: 25%
      max-width: 25%
      padding: 10px
      position: relative

      &-actions
        position: absolute
        top: 17px
        right: 15px
        z-index: 1

        .actions-toggle
          color: #0072C5

  .board-preview
    background-color: #ccc
    color: #222
    display: block
    padding: 10px 15px
    border-radius: 3px
    position: relative

    &--create
      background-color: #186bb3
      color: #fff
      border: 0
      cursor: pointer
      width: 100%
      text-align: left

      &:hover
        color: #fff

    &:hover
      text-decoration: none

    &__title
      font-size: 18px
      font-weight: 500

</style>
