<template>
  <div class="board-column">
    <div class="board-column__inner">
      <form @submit.prevent class="board-column__name">
        <input
          v-if="nameEditing"
          v-model="column.name"
          v-focus
          @blur="updateColumn"
          @keypress.enter.prevent="blur"
          type="text"
          class="board-column__name-input"/>

        <div v-else @click="toggleEditName" class="board-column__name-text">{{ column.name }}</div>

        <actions-toggle></actions-toggle>

        <ul class="actions actions--top-right">
          <li class="actions__action">
            <button class="btn btn-sm btn-danger" @click.prevent.stop="removeColumn">Remove column</button>
          </li>
        </ul>
      </form>

      <board-cards :cards="column.cards"
                   :board-index="boardIndex"
                   :column-hovered="columnHovered"
                   :column-index="columnIndex">
        <board-card-placeholder v-if="showCardPlaceholder"></board-card-placeholder>
      </board-cards>

      <button class="add-card-btn" @click.prevent="createCard">+ Add card</button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import BoardCards from './board-cards';
  import BoardCardPlaceholder from './board-card-placeholder';
  import ActionsToggle from '../utils/actions-toggle';

  export default {
    components: { BoardCards, BoardCardPlaceholder, ActionsToggle },
    props: {
      boardIndex: Number,
      columnIndex: Number,
      columnHovered: Boolean,
      showCardPlaceholder: Boolean,
      column: Object,
    },
    data() {
      return {
        nameEditing: false,
      };
    },
    computed: {
      ...mapState({
        movableCard: (state) => state.movableCard,
        hoveredCard: (state) => state.hoveredCard,
      }),
    },
    methods: {
      createCard() {
        this.$store.dispatch('addCard', {
          boardIndex: this.boardIndex,
          columnIndex: this.columnIndex,
        });
      },
      toggleEditName() {
        this.nameEditing = !this.nameEditing;
      },
      blur(evt) {
        evt.target.blur();
      },
      updateColumn() {
        this.$store.commit('updateColumn', {
          boardIndex: this.boardIndex,
          columnIndex: this.columnIndex,
          column: this.column,
        });

        this.nameEditing = false;
      },
      removeColumn() {
        this.$store.dispatch('removeColumn', {
          boardIndex: this.boardIndex,
          columnIndex: this.columnIndex,
        });
      },
    },
  };
</script>

<style lang="sass">
  .board-column
    background-color: #DEE3E6
    color: #222
    border-radius: 4px
    padding: 3px 7px 6px
    width: 274px
    position: relative

    &__name
      display: block
      font-size: 15px
      font-weight: 700
      margin-bottom: 10px
      padding: 0
      height: 22px
      cursor: inherit

      &-text
        display: inline-block
        cursor: pointer
        padding-top: 2px
        white-space: nowrap
        overflow: hidden
        max-width: calc(100% - 40px)
        text-overflow: ellipsis

      &-input
        background-color: transparent
        border: 0
        font: inherit
        color: inherit
        height: inherit
        padding: 0


      &::before
        display: none

    .actions-toggle
      float: right

  .board-column--template
    background-color: #0068AA
    padding: 10px

    &__create
      color: rgba(#fff, .9)
</style>
