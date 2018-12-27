<template>
  <div class="board-card board-card--movable" :style="styles">
    <div class="board-card__inner">
      <span class="board-card__name">
        {{ card.name }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      card: Object,
      styles: Object,
    },
  };
</script>

<style lang="sass">
  .board-card--movable
    pointer-events: none
    position: absolute
    top: 0
    left: 0
    z-index: 1
</style>
