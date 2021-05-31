export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('vuex'));
  if (user.auth && user.auth.user.data.token) {
    return { Authorization: `Bearer ${user.auth.user.data.token}` };
  }
  return {};
}
