<template>
  <div class="login">
    <form @submit.prevent="_logIn" class="login__form">
      <h1>Log in</h1>

      <div class="form-group mt-4">
        <label for="login">Login</label>

        <input ref="login"
               type="text"
               class="form-control"
               id="login"
               aria-describedby="loginHelp"
               v-model="login"
               placeholder="Enter login">

        <small id="loginHelp" class="form-text text-muted">We'll never share your login with anyone else.</small>
      </div>

      <div class="form-group">
        <label for="password">Password</label>

        <input type="password"
               class="form-control"
               id="password"
               placeholder="Password"
               v-model="password">
      </div>

      <div class="alert alert-danger mt-3" role="alert" v-if="isLoginError">
        <p>Authorization error: incorrect login or password.</p>

        <div>
          To see demo use <strong>omega-r</strong> and <strong>demo</strong>.
        </div>
      </div>

      <button type="submit" class="btn btn-success">Login</button>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';

  export default {
    data() {
      return {
        login: '',
        password: '',
        remember: false,
      };
    },
    computed: {
      ...mapGetters(['isLoginError']),
      ...mapState(['isSuccessAuth', 'boards'])
    },
    methods: {
      ...mapActions(['logIn']),
      _logIn() {
        this.logIn({
          login: this.login,
          password: this.password,
          remember: this.remember,
        });

        if (!this.isSuccessAuth) {
          this.$refs.login.focus()
        }
      },
    },
    created() {
      if (this.isSuccessAuth) {
        this.$router.push('/');
      }
    },
  };
</script>

<style lang="sass">
  @import "style"
</style>
