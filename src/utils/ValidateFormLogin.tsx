export default function ValidateForm(state: any) {
  let erros: any = {};
  if (!state.email) {
    erros.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(state.email)) {
    erros.email = 'Email is invalid';
  }
  if (!state.password) {
    erros.password = 'Password is required';
  } else if (state.password.length < 5) {
    erros.password = 'Password must be more 5 characters';
  }
  return erros;
}
