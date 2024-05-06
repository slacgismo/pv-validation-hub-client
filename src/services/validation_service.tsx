
/**
 * Validation service
 * @class
 * @classdesc Service for validating user input
 * @exports Validation
 */
export default class Validation {
  /**
   * Check if a username is taken.
   * @param {string} username - The username to check.
   * @return {boolean} - True if the username is taken, false otherwise.
   */
  static isUserNameTaken(username: string) {
    console.log(username);
    return true;
  }

  /**
   * Check if an email is in use.
   * @param {string} email - The email to check.
   * @return {boolean} - True if the email is in use, false otherwise.
   */
  static isEmailInUse(email: string) {
    console.log(email);
    return true;
  }
}
