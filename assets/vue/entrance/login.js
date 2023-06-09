export default {
    template: `
    <div id="login">
    <div class="container-fluid pt-5 pb-5">
      <h1 class="text-center">Sign in to your account</h1>
      <div style="max-width: 450px;" class="mx-auto">
        <hr/>
        <form action="login" method="POST">
          <div class="form-group">
            <input type="email" name="emailAddress" class="form-control" placeholder="Email address" autocomplete="email" focus-first>
            <div class="invalid-feedback">Please provide a valid email address.</div>
          </div>
          <div class="form-group">
            <input name="password" type="password" class="form-control" placeholder="Password" autocomplete="current-password">
            <div class="invalid-feedback">Please enter your password.</div>
          </div>
          <div class="form-group form-check">
            <input class="form-check-input" type="checkbox" id="remember" name="rememberMe" checked="checked" value="true"/>
            <label class="form-check-label" for="remember">Remember me</label>
          </div>
          <span>The credentials you entered are not associated with an account. Please check your email and/or password and try again.</span>
          <div class="form-group">
            <button type="submit"class="btn-dark btn-lg btn-block">Sign in</button>
          </div>
        </form>
        <p class="text-center"><a href="/password/forgot">Forgot your password?</a></p>
      </div>
    </div>
  </div>
    `
}


  