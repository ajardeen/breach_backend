const express = require('express');
const User = require('../Models/UserModel');
const { default: axios } = require('axios');
require("dotenv").config();

const search = async (req, res) => {
    const { searchQuery,id } = req.body;
  
    try {
      if (!searchQuery) {
        return res
          .status(406)
          .json({ message: "Please Provide all the Necessary Info to Proceed" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const credits = user.credits;
      if (credits < 1) {
        return res.status(402).json({ message: "Insufficient credits" });
      }
      
      const apiToken = process.env.API_KEY;
      const apiUrl = process.env.API_URL;
      const requestData = {
          token: apiToken,
          request: searchQuery,
          limit: 100,
          lang: "en",
          type: "json"
      };

      const response = await axios.post(apiUrl, requestData);
      const data = response.data;


     
      // Update the user's credits
      user.credits -= 1;
      await user.save();
     
      res.status(200).json({
        message: "Search Result",
        searchQuery: searchQuery,
        data,
        credits: user.credits
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  module.exports = {
    search
  };