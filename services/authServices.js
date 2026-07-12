const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");

class AuthServices extends ReadDBService {
  async registerUser(body) {
    const users = await super.getDB("users");
    const newUser = await schema.validateAsync(body);
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.id = Date.now();
    newUser.cart = [];
    newUser.favorites = []
    newUser.orders = []
    newUser.password = hashedPassword;

    const isDuplicated = users[0].users.find(
      (user) => user.email === newUser.email,
    );

    if (!isDuplicated) {
      users[0].users.push(newUser);
      await super.saveToUsers(users);
    } else {
      throw new Error("Email already exists");
    }
  }
  async loginUser(body) {
    const users = await super.getDB("users") ;
  
    const availableUser = users[0].users.find(
      (user) => user.email === body.email,
    );

    if (!availableUser) {
      throw new Error("Invalid email or password");
    }

    const isMatchedPasswords = await bcrypt.compare(
      body.password,
      availableUser.password,
    );

    if (!isMatchedPasswords) {
      throw new Error("Invalid email or password");
    }

    users[0].currentUser = availableUser;

    await super.saveToUsers(users);

    return availableUser;
  }
  async logoutUser() {
    const users = await super.getDB("users");
    const loggedOutUser = {};
    users[0].currentUser = loggedOutUser;
    await super.saveToUsers(users);
  }
}

module.exports.AuthServices = AuthServices;
