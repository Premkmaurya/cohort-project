const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/user.model");

let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      binary: {
        downloadDir: "./.mongodb-binaries",
        debug: true,
      },
      instance: {
        debug: true,
      },
    });
    const uri = mongoServer.getUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("Failed to start MongoMemoryServer:", err);
    throw err;
  }
}, 30000); // Increase timeout for slow startup

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer && typeof mongoServer.stop === "function") {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "TestPass123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
  }, 10000); // Increase timeout for this test
});
