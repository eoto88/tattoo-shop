// https://auth.nuxtjs.org/
export default function ({ app, $auth, redirect }) {
  // Redirect if noy logged in
  if( ! $auth.loggedIn) {
    return redirect('/login')
  }

  $auth.onRedirect((to) => {
    // Remove query string parameters for redirects (needed only if router is used)
    $auth.ctx.query = {};

    // change `to` by returning a new value
    return to;
  });
}