const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  process.env.MONGO_URI = uri; // ensure app's db connector uses this
  process.env.JWT_SECRET_KEY = "test_jwt_secret"; // set a test JWT secret

  await mongoose.connect(uri);
});
// File: auth/test/setup.js

// ... (beforeAll remains the same)

afterEach(async () => {
  // FIX: Check if the connection to the DB is available before trying to access it.
  if (mongoose.connection.db) {
    // Cleanup all collections between tests
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // FIX: Check if connection state is 1 (connected) before closing,
  // or simply rely on the 'mongo' variable if it was successfully created.
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
