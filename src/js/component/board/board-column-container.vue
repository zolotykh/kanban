<template>
  <div class="board-column-container"
       :class="classList"
       @mouseenter="onMouseEnter"
       @mouseleave="onMouseLeave"
       @mousedown="onMouseDown"
       @mousemove="onMouseMove">

    <board-column ref="column"
                  :show-card-placeholder="showCardPlaceholder"
                  :column-hovered="isHovered"
                  :column="displayedColumn"
                  :board-index="boardIndex"
                  :column-index="columnIndex">
    </board-column>
  </div>
</template>

<script>
  import BoardColumn from './board-column';
  import { mapState } from 'vuex';
  import { getElementOffset } from '../../utils';
  import { EventBus, EVENT_CARD_MOVING_PLACEMENT } from '../../event-bus';

  export default {
    components: { BoardColumn },
    props: {
      boardIndex: Number,
      columnIndex: Number,
    },
    data() {
      return {
        isHovered: false,
      };
    },
    computed: {
      ...mapState({
        readyForColumnMoving: (state) => state.readyForColumnMoving,

        hoveredColumn: (state) => state.hoveredColumn,
        movableColumn: (state) => state.movableColumn,

        movableCard: (state) => state.movableCard,
        hoveredCard: (state) => state.hoveredCard,

        displayedColumns: (state) => state.displayedColumns,
      }),
      column() {
        return this.$store.state.boards[this.boardIndex].columns[this.columnIndex];
      },
      isEmpty() {
        return this.column.cards.length < 1;
      },
      isMovable() {
        if (!this.movableColumn) {
          return false;
        }

        const isSameBoard = this.boardIndex === this.movableColumn.boardIndex;
        const isSameColumn = this.columnIndex === this.movableColumn.columnIndex;

        return isSameBoard && isSameColumn;
      },
      isShadow() {
        return this.isMovable && !this.hoveredColumn;
      },
      isTarget() {
        if (!this.hoveredColumn) {
          return false;
        }

        const isSameBoard = this.boardIndex === this.hoveredColumn.boardIndex;
        const isSameColumn = this.columnIndex === this.hoveredColumn.columnIndex;

        return isSameBoard && isSameColumn;
      },
      displayedColumn() {
        if (this.hoveredColumn && this.displayedColumns) {
          return this.displayedColumns[this.columnIndex];
        }

        return this.column;
      },
      classList() {
        return {
          'is-hovered': this.isHovered,
          'is-movable': this.isMovable,
          'is-shadow': this.isShadow,
          'is-target': this.isTarget,
        };
      },
      showCardPlaceholder() {
        const isMovingCardToEmptyColumn = this.isHovered && this.movableCard && this.isEmpty;

        return isMovingCardToEmptyColumn;
      },
    },
    methods: {
      onMouseDown(evt) {
        this.$store.commit('readyForColumnMoving', true);
      },
      onMouseMove(evt) {
        if (this.readyForColumnMoving && !this.movableColumn) {
          const movableColumn = this.column;

          const Column = this.$refs.column.$el;

          const { top, left } = getElementOffset(Column);

          movableColumn.top = evt.pageY - top;
          movableColumn.left = evt.pageX - left;
          movableColumn.boardIndex = this.boardIndex;
          movableColumn.columnIndex = this.columnIndex;

          this.$store.commit('movableColumn', movableColumn);
        }
      },
      onMouseEnter() {
        this.isHovered = true;

        if (this.movableColumn) {
          if (this.isMovable) {
            this.$store.commit('hoveredColumn', null);
          }

          else {
            const hoveredColumn = this.column;

            hoveredColumn.boardIndex = this.boardIndex;
            hoveredColumn.columnIndex = this.columnIndex;

            this.$store.commit('hoveredColumn', hoveredColumn);
            this.$store.dispatch('displayedColumns');
          }
        }

        if (this.movableCard) {
          EventBus.$emit(EVENT_CARD_MOVING_PLACEMENT, {
            boardIndex: this.boardIndex,
            columnIndex: this.columnIndex,
            cardIndex: 0,
            eventEmittedFromColumn: true,
          });
        }
      },
      onMouseLeave() {
        this.isHovered = false;

        if (this.movableCard) {
          EventBus.$emit(EVENT_CARD_MOVING_PLACEMENT, null);
        }
      },
    }
  }
</script>

<style lang="sass">
  .board-column-container
    padding: 0 3px

    .moving-column &:hover .board-column,
    &.is-movable.is-hovered .board-column,
    &.is-movable.is-shadow .board-column,
    &.is-target .board-column
      background-color: #0068AA

    .moving-column &:hover .board-column__inner,
    &.is-movable.is-hovered .board-column__inner,
    &.is-movable.is-shadow .board-column__inner,
    &.is-target .board-column__inner
      opacity: 0
      pointer-events: none
</style>
