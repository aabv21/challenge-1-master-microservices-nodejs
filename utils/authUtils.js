import { randomBytes, pbkdf2Sync } from "node:crypto";

/**
 * @description Password encryption and verification
 * @class PassCrypt
 * @property {string} #password - The hashed password
 * @property {string} #salt - The salt used for hashing
 * @property {number} #iterations - The number of iterations for hashing
 * @property {number} #keyLength - The length of the key for hashing
 * @property {string} #digest - The digest algorithm for hashing
 */
class PassCrypt {
  #password;
  #salt = randomBytes(32).toString("hex");
  #iterations = 10000;
  #keyLength = 64;
  #digest = "sha256";

  #checkSalt() {
    this.#salt === null ? (this.#salt = randomBytes(32).toString("hex")) : null;
  }

  hashPassword(password) {
    this.#checkSalt();
    const hashedPassword = pbkdf2Sync(
      password,
      this.#salt,
      this.#iterations,
      this.#keyLength,
      this.#digest
    ).toString("hex");

    this.#password = `${this.#salt}:${hashedPassword}`;
    this.#salt = null;
    return this.#password;
  }

  verify(password, DBpassword) {
    this.#salt = DBpassword.split(":")[0];
    const newHashedPassword = this.hashPassword(password);
    return Object.is(newHashedPassword, DBpassword);
  }
}

const passCrypt = new PassCrypt();
export { passCrypt };
