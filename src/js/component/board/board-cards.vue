<template>
  <div class="board-cards">
    <board-card-container v-for="(card, cardIndex) in cards"
                          :key="card.id"
                          :card="card"
                          :board-index="boardIndex"
                          :column-hovered="columnHovered"
                          :column-index="columnIndex"
                          :card-index="cardIndex"></board-card-container>

    <slot></slot>
  </div>
</template>

<script>
  import BoardCardContainer from "./board-card-container";

  export default {
    components: { BoardCardContainer },
    props: {
      boardIndex: Number,
      columnIndex: Number,
      columnHovered: Boolean,
      cards: Array,
    },
  };
</script>

<style lang="sass">
  .board-cards
    margin: -3px 0
</style>
