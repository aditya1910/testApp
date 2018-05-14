let environmentDetails = {};

if (process.env.NODE_ENV === "production") {
  console.log('in production');
  environmentDetails = {
    mongoUrl: "mongodb://localhost:27017/testDB",
    mongoTestUrl: "mongodb://localhost:27017/testDB",
    devEnvironment: true,
  };
} else if (process.env.NODE_ENV === "staging") {
  console.log('in staging');
  environmentDetails = {
    mongoUrl: "mongodb://localhost:27017/testDB",
    mongoTestUrl: "mongodb://localhost:27017/testDB",
    devEnvironment: true,
  }
} else {
  console.log('in local');
  environmentDetails = {
    mongoUrl: "mongodb://localhost:27017/testDB",
    mongoTestUrl: "mongodb://localhost:27017/testDB",
    devEnvironment: true,
  }
}

module.exports = {
  sectet: "AdityaProject",
  mongoUrl: environmentDetails.mongoUrl,
  mongoTestUrl: environmentDetails.mongoTestUrl,
  tokenLife: 3600
}
