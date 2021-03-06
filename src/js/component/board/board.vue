<template>
  <div class="board" :class="classList">
    <div class="board__inner">
      <label class="board__name">
        <input type="text"
               v-model="board.name"
               @blur="updateBoard"
               @keypress.enter.prevent="blurBoardName"
               class="board__name-input" />
      </label>

      <board-columns :board-index="boardIndex"></board-columns>

      <board-column-movable v-if="movableColumn" :column="movableColumn" :styles="movableColumnStyles"></board-column-movable>

      <board-card-movable v-if="movableCard" :card="movableCard" :styles="movableCardStyles"></board-card-movable>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
  import { EventBus, EVENT_CARD_MOVING_PLACEMENT } from '../../event-bus';
  import { mapActions, mapState } from 'vuex';
  import BoardColumns from './board-columns';
  import BoardColumnMovable from "./board-column-movable";
  import BoardCardMovable from "./board-card-movable";

  export default {
    components: { BoardColumnMovable, BoardColumns, BoardCardMovable },
    props: {
      boardIndex: Number,
    },
    computed: {
      ...mapState({
        hoveredColumn: (state) => state.hoveredColumn,
        movableColumn: (state) => state.movableColumn,

        movableCard: (state) => state.movableCard,
        hoveredCard: (state) => state.hoveredCard,

        displayedColumns: (state) => state.displayedColumns,
        displayedCards: (state) => state.displayedCards,

        readyForColumnMoving: (state) => state.readyForColumnMoving,
        readyForCardMoving: (state) => state.readyForCardMoving,
      }),
      classList() {
        return {
          'modal-card-open': 'card' === this.$route.name,
        };
      },
    },
    data() {
      return {
        movableColumnStyles: {
          transform: null,
        },
        movableCardStyles: {
          width: null,
          transform: null,
        },
        board: null,

        /**
         * Where card will be placed in board.
         *
         * @type {null|{boardIndex, columnIndex, cardIndex}}
         */
        cardMovingPlacement: null,
      };
    },
    created() {
      this.$set(this, 'board', this.$store.state.boards[this.boardIndex]);
    },
    mounted() {
      this.onMouseMove = (evt) => {
        if (this.movableColumn) {
          const moveX = evt.pageX - this.movableColumn.left;
          const moveY = evt.pageY - this.movableColumn.top;

          this.movableColumnStyles.transform = `translate(${moveX}px, ${moveY}px) rotate(4deg)`;
        }

        else if (this.movableCard) {
          const moveX = evt.pageX - this.movableCard.left;
          const moveY = evt.pageY - this.movableCard.top;

          this.movableCardStyles.width = this.movableCard.width + 'px';
          this.movableCardStyles.transform = `translate(${moveX}px, ${moveY}px) rotate(4deg)`;
        }
      };

      this.onMouseUp = (evt) => {
        if (this.readyForColumnMoving) {
          this.columnMovingEnd();
        }
        else if (this.readyForCardMoving) {
          this.cardMovingEnd({ placement: this.cardMovingPlacement});

          this.cardMovingPlacement = null;
        }
      };

      this.onCardMovingPlacement = (placement) => {
        this.$set(this, 'cardMovingPlacement', placement);
      };

      EventBus.$on(EVENT_CARD_MOVING_PLACEMENT, this.onCardMovingPlacement);

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    },
    beforeDestroy() {
      EventBus.$off(EVENT_CARD_MOVING_PLACEMENT, this.onCardMovingPlacement);

      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    },
    methods: {
      ...mapActions(['columnMovingEnd', 'cardMovingEnd']),

      blurBoardName(evt) {
        evt.target.blur();
      },
      updateBoard() {
        this.$store.commit('updateBoard', {
          board: this.board,
          boardIndex: this.boardIndex,
        });
      },
    },
  };
</script>

<style lang="sass">
  .board
    padding: 10px
    overflow-x: hidden
    user-select: none!important
    -ms-user-select: none !important

    &.modal-card-open &__inner
      filter: blur(1px)

    &__name
      display: inline-block
      font-size: 22px
      font-weight: 500

      &-input
        background-color: transparent
        color: inherit
        border: 0
        font: inherit
</style>
