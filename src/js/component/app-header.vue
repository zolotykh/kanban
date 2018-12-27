<template>
  <header class="header mb-4">
    <nav class="navbar navbar-dark bg-dark navbar-expand">
      <router-link class="navbar-brand" :to="{name: 'index'}">Kanban</router-link>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: isRouteBoards}" :to="{name: 'boards'}">Boards</router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0" @submit.prevent>
          <span class="mr-4">{{ login }}</span>

          <button v-if="isSuccessAuth" @click="logout" class="btn btn-sm btn-dark" href="#">Logout</button>
          <router-link v-else class="btn btn-sm btn-dark" :to="{name: 'login'}">Login</router-link>
        </form>
      </div>
    </nav>
  </header>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState({
        login: (state) => state.login,
        isSuccessAuth: (state) => state.isSuccessAuth,
      }),
      isRouteBoards() {
        return 'boards' === this.$route.name;
      },
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
      },
    },
  };
</script>
