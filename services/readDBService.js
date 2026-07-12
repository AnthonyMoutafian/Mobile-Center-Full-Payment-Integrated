const fs = require("fs").promises;
const path = require("path");

class ReadDBService {
  async saveToUsers(data) {
    const dbPath = path.join(__dirname, "..", "db", "users.json");
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  }
  async getDB(filename) {
    const data = JSON.parse(
      await fs.readFile(
        path.join(__dirname, "..", "db", `${filename}.json`),
        "utf-8",
      ),
    );
    return data;
  }
}

module.exports.ReadDBService = ReadDBService;
