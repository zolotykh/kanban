<template>
  <div class="app">
    <app-header></app-header>

    <transition appear name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
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
