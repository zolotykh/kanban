<template>
  <div class="login">
    <form @submit.prevent="submit" class="login__form">
      <h1>
        <span>{{ title }}</span>

        <button type="button" class="btn btn-link" @click.prevent="toggleSignType">{{ textForSignTypeToggle }}</button>
      </h1>

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
          To see demo use <strong>demo</strong> and <strong>demo</strong>.
        </div>
      </div>

      <button type="submit" class="btn btn-success">Submit</button>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';

  const SIGN_TYPE_IN = Symbol('signIn');
  const SIGN_TYPE_UP = Symbol('signUp');

  export default {
    data() {
      return {
        login: '',
        password: '',
        signType: SIGN_TYPE_IN,
      };
    },
    computed: {
      ...mapGetters(['isLoginError']),
      ...mapState(['isSuccessAuth', 'boards']),

      isSignIn() {
        return SIGN_TYPE_IN === this.signType;
      },
      isSignUp() {
        return SIGN_TYPE_UP === this.signType;
      },

      title() {
        return this.isSignIn ? 'Sign In' : 'Sign Up';
      },

      textForSignTypeToggle() {
        return this.isSignUp ? 'Sign In' : 'Sign Up';
      },
    },
    methods: {
      ...mapActions(['signIn', 'signUp']),

      focusOnLogin() {
        this.$refs.login.focus()
      },
      submit() {
        const payload = {
          login: this.login,
          password: this.password,
        };

        if (this.isSignIn) {
          this.signIn(payload);

          if (!this.isSuccessAuth) {
            this.focusOnLogin();
          }
        }

        else {
          this.signUp(payload);
        }
      },
      toggleSignType() {
        this.signType = SIGN_TYPE_IN === this.signType ? SIGN_TYPE_UP : SIGN_TYPE_IN;

        this.focusOnLogin();
      }
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
