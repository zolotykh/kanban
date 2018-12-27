<template>
  <div class="card">
    <button @click.prevent="back" class="card-backdrop"></button>

    <form @submit.prevent="updateCard" class="card-body">
      <button @click.prevent="back" class="card__close">
        <svg class="card__close-svg" viewBox="0 0 165 166" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g fill="currentColor" transform="translate(-5 -4)" fill-rule="evenodd">
            <rect transform="rotate(45 87.5 87)" x="-25" y="77" width="225" height="20" rx="10"/>
            <rect transform="rotate(-45 87.5 87)" x="-25" y="77" width="225" height="20" rx="10"/>
          </g>
        </svg>
      </button>

      <div class="card__title">
        <input v-if="titleEditing"
               v-focus
               v-model="card.name"
               @keydown.prevent.enter="blurMeAndUpdate"
               @blur="updateCard"
               type="text"
               class="card__title-input">

        <div v-else @click.prevent="toggleEditTitle" class="card__title-text">{{ card.name }}</div>
      </div>

      <div class="card__address">In column «{{ column.name }}»</div>

      <h3>Description</h3>

      <textarea ref="description"
                v-model="card.description"
                @input="onDescriptionInput"
                @blur="updateCard"
                @keydown.ctrl.enter="blurMeAndUpdate"
                @keydown.meta.enter="blurMeAndUpdate"
                class="card__description"></textarea>

      <div class="card__actions">
        <button @click="back" class="btn btn-success">Close</button>
        <button @click="removeCard" class="btn btn-link text-danger">Remove</button>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    props: {
      boardIndex: Number,
      columnIndex: Number,
      cardIndex: Number,
    },
    data() {
      return {
        titleEditing: false,
      };
    },
    computed: {
      column() {
        return this.$store.state.boards[this.boardIndex].columns[this.columnIndex];
      },
      card() {
        return this.column.cards[this.cardIndex];
      },
      cardPath() {
        return {
          boardIndex: this.boardIndex,
          columnIndex: this.columnIndex,
          cardIndex: this.cardIndex,
        };
      },
    },
    methods: {
      back() {
        this.$router.back();
      },
      toggleEditTitle() {
        this.titleEditing = !this.titleEditing;
      },
      blurMeAndUpdate(evt) {
        evt.target.blur();

        this.updateCard();
      },
      updateCard() {
        this.titleEditing = false;

        this.$store.dispatch('updateCard', {
          card: this.card,
          ...this.cardPath,
        });
      },
      onDescriptionInput() {
        this.descriptionHeight();
      },
      descriptionHeight() {
        const target = this.$refs.description;

        target.style.height = '';
        target.style.height = target.scrollHeight + 'px';
      },
      removeCard() {
        this.back();

        const cardPath = { ...this.cardPath };

        setTimeout(() => this.$store.dispatch('removeCard', cardPath), 10);
      },
    },
    created() {
      this.onKeyDown = (evt) => {
        if ('Escape' === evt.key) {
          this.back();
        }
      };

      document.addEventListener('keydown', this.onKeyDown);
    },
    mounted() {
      this.descriptionHeight();
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.onKeyDown);
    },
  };
</script>

<style lang="sass">
  @import "./style"
</style>
