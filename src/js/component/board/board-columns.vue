<template>
  <div class="board-columns">
    <VuePerfectScrollbar class="scroll-area">
      <div class="board-columns__list">
        <board-column-container v-for="(column, columnIndex) in columns"
                                :key="column.id"
                                :column-index="columnIndex"
                                :board-index="boardIndex"></board-column-container>

        <div class="board-column-container">
          <div class="board-column board-column--template" @click.prevent="addColumn">
            <div class="board-column__inner">
              <div class="board-column--template__create">
                + Add column
              </div>
            </div>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
  import BoardColumnContainer from './board-column-container';
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  export default {
    components: { BoardColumnContainer, VuePerfectScrollbar },
    props: {
      boardIndex: Number,
    },
    computed: {
      columns() {
        return this.$store.state.boards[this.boardIndex].columns;
      },
    },
    methods: {
      addColumn() {
        this.$store.dispatch('addColumn', {
          boardIndex: this.boardIndex,
        });
      },
    },
  };
</script>

<style lang="sass">
  .board-columns
    margin: 0 -10px

    &__list
      display: flex
      align-items: flex-start
      margin-top: 20px
      padding: 10px 10px 20px

  .scroll-area
    padding-bottom: 30px

  html
    .ps:hover > .ps__scrollbar-x-rail:hover > .ps__scrollbar-x,
    .ps > .ps__scrollbar-x-rail > .ps__scrollbar-x
      background-color: #095190

    .ps.ps--in-scrolling.ps--x > .ps__scrollbar-x-rail > .ps__scrollbar-x,
    .ps.ps--in-scrolling.ps--x:hover > .ps__scrollbar-x-rail > .ps__scrollbar-x,
    .ps>.ps__scrollbar-x-rail:active>.ps__scrollbar-x,
    .ps>.ps__scrollbar-x-rail:hover>.ps__scrollbar-x
      height: 6px
      background-color: #095190
      cursor: ew-resize

    .ps>.ps__scrollbar-x-rail,
    .ps:active>.ps__scrollbar-x-rail,
    .ps:hover>.ps__scrollbar-x-rail
      background-color: rgba(#fff, .5)
      height: 10px

    .ps:active>.ps__scrollbar-x-rail:active,
    .ps:hover>.ps__scrollbar-x-rail:hover
      background-color: rgba(#fff, .5)
      opacity: 1
</style>
