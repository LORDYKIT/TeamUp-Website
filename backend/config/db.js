/**
 * @file db.js
 * @description Module responsible for connecting to the MongoDB database using Mongoose.
 */

const mongoose = require("mongoose");

// /**
//  * Sets strict mode for Mongoose queries to false.
//  * Strict mode ensures that properties not defined in the schema are not saved to the database.
//  * Setting it to false allows for flexibility but requires careful handling of data.
//  */
// mongoose.set("strictQuery", false);

/**
 * @function connectDB
 * @description Connects to the MongoDB database using the provided MONGODB_URI in the environment variables.
 * @returns {Promise<void>} A promise that resolves when the database connection is established.
 * @throws {Error} If there is an error connecting to the database.
 */
const connectDB = async () => {
  try {
    // Establish a connection to the MongoDB database
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log a success message to the console upon successful connection
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log any errors that occur during the connection process
    console.error(error);
  }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
