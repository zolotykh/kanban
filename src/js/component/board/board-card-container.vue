<template>
  <div draggable="false"
       :class="classList"
       @mousedown.stop="onMouseDown"
       @mouseup="onMouseUp"
       @mousemove="onMouseMove"
       @mouseenter="onMouseEnter"
       @mouseleave="onMouseLeave">

    <board-card-placeholder v-if="showPlaceholderBefore"></board-card-placeholder>

    <div class="board-card-container" :class="{ hide: hideCard }">
      <board-card ref="card"
                  :card="card"
                  :board-index="boardIndex"
                  :column-index="columnIndex"
                  :card-index="cardIndex"></board-card>
    </div>

    <board-card-placeholder v-if="showPlaceholderAfter || hasSelfPlaceholder"></board-card-placeholder>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { getElementOffset } from '../../utils';
  import { EventBus, EVENT_CARD_MOVING_PLACEMENT } from '../../event-bus';
  import BoardCardPlaceholder from './board-card-placeholder';

  export default {
    components: { BoardCardPlaceholder },
    props: {
      boardIndex: Number,
      columnIndex: Number,
      columnHovered: Boolean,
      cardIndex: Number,
      card: Object,
    },
    data() {
      return {
        anotherCardInColumnHovered: false,
        isHovered: false,
        isMovable: false,
        showPlaceholderBefore: false,
        showPlaceholderAfter: false,
      };
    },
    computed: {
      ...mapState({
        readyForCardMoving: (state) => state.readyForCardMoving,
        hoveredCard: (state) => state.hoveredCard,
        movableCard: (state) => state.movableCard,
      }),
      /**
       * Show placeholder on movable card when hover not on another card in column
       * Can't use `isHovered` -> when mouse move outside of column
       * Checked
       * @returns {boolean}
       */
      hasSelfPlaceholder() {
        return this.isMovable && !this.anotherCardInColumnHovered;
      },
      /**
       * Hide card when moving itself
       * @returns {boolean}
       */
      hideCard() {
        return this.isMovable;
      },
      classList() {
        return {
          'is-hovered': this.isHovered,
          'is-movable': this.isMovable,
        };
      },
    },
    mounted() {
      this.onCardMovingTo = (placement) => {
        if (!placement) {
          this.anotherCardInColumnHovered = false;
        }

        else {
          const { boardIndex, columnIndex, cardIndex, eventEmittedFromColumn } = placement;

          if (!eventEmittedFromColumn && this.movableCard && this.isMovable) {
            this.anotherCardInColumnHovered = columnIndex === this.columnIndex;
          }
        }
      };

      this.onMouseUp = () => {
        this.anotherCardInColumnHovered = false;
        this.isMovable = false;
        this.hidePlaceholders();
      };

      EventBus.$on(EVENT_CARD_MOVING_PLACEMENT, this.onCardMovingTo);

      document.addEventListener('mouseup', this.onMouseUp);
    },
    beforeDestroy() {
      EventBus.$off(EVENT_CARD_MOVING_PLACEMENT, this.onCardMovingTo);

      document.removeEventListener('mouseup', this.onMouseUp);
    },
    methods: {
      onMouseDown() {
        this.$store.commit('readyForCardMoving', true);
      },
      onMouseMove(evt) {
        if (this.readyForCardMoving && !this.movableCard) {
          this.isMovable = true;

          const movableCard = Object.assign({}, this.card);

          const Card = this.$refs.card.$el;

          const { top: cardTop, left: cardLeft } = getElementOffset(Card);
          const cardHeight = Card.offsetHeight;

          movableCard.top = evt.pageY - cardTop;
          movableCard.left = evt.pageX - cardLeft;
          movableCard.height = cardHeight;
          movableCard.width = Card.offsetWidth;
          movableCard.boardIndex = this.boardIndex;
          movableCard.columnIndex = this.columnIndex;
          movableCard.cardIndex = this.cardIndex;

          this.$store.commit('movableCard', movableCard);
        }

        if (this.movableCard && !this.isMovable) {
          const CardContainer = this.$el;
          const { top: cardContainerTop } = getElementOffset(CardContainer);
          const cardContainerHeight = CardContainer.offsetHeight;

          const showPlaceholderAfter = evt.pageY > cardContainerTop + cardContainerHeight / 3;
          const showPlaceholderBefore = !showPlaceholderAfter;

          this.showPlaceholderAfter = showPlaceholderAfter;
          this.showPlaceholderBefore = showPlaceholderBefore;

          EventBus.$emit(EVENT_CARD_MOVING_PLACEMENT, {
            boardIndex: this.boardIndex,
            columnIndex: this.columnIndex,
            cardIndex: this.cardIndex + (showPlaceholderAfter ? 1 : 0),
          });
        }
      },
      onMouseEnter(evt) {
        this.isHovered = true;

        if (this.movableCard) {
          if (this.isMovable) {
            this.$store.commit('hoveredCard', null);
          }

          else {
            const hoveredCard = Object.assign({}, this.card);

            hoveredCard.boardIndex = this.boardIndex;
            hoveredCard.columnIndex = this.columnIndex;
            hoveredCard.cardIndex = this.cardIndex;

            this.$store.commit('hoveredCard', hoveredCard);
          }
        }
      },
      onMouseLeave() {
        this.isHovered = false;

        this.hidePlaceholders();
      },
      onMouseUp() {
        this.hidePlaceholders();
      },
      hidePlaceholders() {
        this.showPlaceholderAfter = false;
        this.showPlaceholderBefore = false;
      },
    },
  }
</script>

<style lang="sass">
  .board-card-container
    padding: 3px 0
</style>
