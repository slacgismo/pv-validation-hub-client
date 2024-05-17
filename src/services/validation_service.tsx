import banned from '@/services/bannedWords/banned.json';

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

  /**
   * Check if a username is an email.
   * @param {string} entry - The username to check.
   * @return {boolean} - True if the username is an email, false otherwise.
   */
  static hasNoProfanity(entry: string) {
    const bannedWords = banned;

    // Convert the input string to lowercase and split it into words
    const words = entry.toLowerCase();

    // Check if any of the words in the input string are in the list of banned words
    for (const bannedWord of bannedWords) {
      if (words.includes(bannedWord)) {
        return false;
      }
    }

    return true;
  }
}
