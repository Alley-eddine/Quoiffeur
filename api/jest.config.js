export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testTimeout: 30000, // Augmente le temps limite pour MongoDB Memory Server
};