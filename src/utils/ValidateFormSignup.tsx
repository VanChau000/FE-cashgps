export default function ValidateFormSingup(state: any) {
  let erros: any = {};
  // let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  if (!state.firstName) {
    erros.firstName = 'First Name is required ';
  } else if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(state.firstName)) {
    erros.firstName = 'No special characters ';
  }
  if (!state.lastName) {
    erros.lastName = 'Last Name is required';
  } else if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(state.lastName)) {
    erros.lastName = 'No special characters ';
  }
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
  if (!state.confirmPassword) {
    erros.confirmPassword = 'Confirm password is required';
  } else if (state.confirmPassword !== state.password) {
    erros.confirmPassword = 'Unmatched confirm password';
  }
  // if (state.catcha === false) {
  //   erros.catcha = 'You must be not a robot';
  // }
  if (state.agree === false) {
    erros.agree = 'You must agree all your infors';
  }

  return erros;
}
