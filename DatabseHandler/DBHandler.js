const mongoose = require("mongoose");

class DBHandler {
  constructor() {
    this.connection = null;
  }

  async connect(connectionString) {
    if (!this.connection) {
      this.connection = await mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connected");
    }
    return this.connection;
  }

  async get(model) {
    try {
      return await model.find();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async getById(model, id) {
    try {
      return await model.findById(id);
    } catch (error) {
      console.error("Error fetching data by id:", error);
      throw error;
    }
  }

  async getUserById(model, id) {
    try {
      return await model.findOne({ login_id: id });
    } catch (error) {
      console.error("Error fetching data by id:", error);
      throw error;
    }
  }

  async getUserByEmail(model, email) {
    try {
      const status = await model.find({ email });
      if (status) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching data by id:", error);
      throw error;
    }
  }

  async put(model, data) {
    try {
      const newItem = new model(data);
      return await newItem.save();
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  }

  async delete(model, id) {
    try {
      return await model.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }

  async update(model, id, updateData) {
    try {
      return await model.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }
}

module.exports = DBHandler;
