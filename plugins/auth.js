// https://auth.nuxtjs.org/
export default function ({ app, $auth, redirect }) {
  $auth.onRedirect((to) => {
    // Remove query string parameters for redirects (needed only if router is used)
    $auth.ctx.query = {};

    // change `to` by returning a new value
    return to;
  });

  // Redirect if noy logged in
  if( ! $auth.loggedIn) {
    return redirect('/login')
  }
}
