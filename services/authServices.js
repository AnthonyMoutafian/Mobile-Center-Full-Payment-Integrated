const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");

class AuthServices extends ReadDBService {
  async registerUser(body) {
    const db = this.getDB();

    const newUser = await schema.validateAsync(body);

    const existingUser = await db.collection("users").findOne({
      email: newUser.email,
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user = {
      name: newUser.name,

      email: newUser.email,

      password: hashedPassword,

      cart: [],

      favorites: [],

      orders: [],
    };

    const result = await db.collection("users").insertOne(user);

    return result.insertedId;
  }

  async loginUser(body) {
    const db = this.getDB();

    const user = await db.collection("users").findOne({
      email: body.email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    await db.collection("currentUser").deleteMany({});

    await db.collection("currentUser").insertOne(user);

    return user;
  }

  async logoutUser() {
    const db = this.getDB();

    await db.collection("currentUser").deleteMany({});
  }
}

module.exports.AuthServices = AuthServices;
