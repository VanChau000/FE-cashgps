export class LoginFactory {
  static getLevelOfPassword(password: string) {
    let currentLevel = 0;
    const regexOfPasswordLevel1 = /^[0-9a-zA-Z]{8,}$/;
    const regexOfPasswordLevel2 = /(?=.*?[0-9])/;
    const regexOfPasswordLevel3 = /[A-Z]/;
    const regexOfPasswordLevel4 = /(?=.*?[#?!@$%^&*-])/;
    if (password.length < 8) {
      currentLevel = 0;
      return;
    }
    if (regexOfPasswordLevel1.test(password)) {
      currentLevel = 1;
    }
    if (
      regexOfPasswordLevel2.test(password) ||
      regexOfPasswordLevel3.test(password) ||
      regexOfPasswordLevel4.test(password)
    ) {
      currentLevel = 2;
    }
    if (
      regexOfPasswordLevel4.test(password) &&
      (regexOfPasswordLevel2.test(password) ||
        regexOfPasswordLevel3.test(password))
    ) {
      currentLevel = 3;
    }
    return currentLevel;
  }
}

export default LoginFactory;
