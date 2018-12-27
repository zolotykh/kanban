<template>
  <div class="app">
    <app-header></app-header>

    <router-view></router-view>
  </div>
</template>

<script>
  import AppHeader from './app-header';

  export default {
    components: {
      AppHeader,
    },
  };
</script>
