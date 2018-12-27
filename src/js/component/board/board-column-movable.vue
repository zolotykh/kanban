<template>
  <div class="board-column board-column--movable" :style="styles">
    <div class="board-column__inner">
      <div class="board-column__name">
        <span class="board-column__name-text">{{ column.name }}</span>
      </div>

      <div class="board-cards">
        <div class="board-card-container" v-for="card in column.cards" :key="card.id">
          <div class="board-card">
            <div class="board-card__name">
              {{ card.name }}
            </div>
          </div>
        </div>
      </div>

      <button class="add-card-btn">+ Add card</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      column: Object,
      styles: Object,
    },
  }
</script>

<style lang="sass">
  .board-column--movable
    position: absolute
    left: 0
    top: 0
    z-index: 1
    pointer-events: none
    box-shadow: 0 1px 1px rgba(0, 0, 0, .3)
</style>
