const express = require('express');
const User = require('../Models/UserModel');


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
      // Search api goes here 
      // const response = await fetch(`https://api.pwnedpasswords.com/range/${searchQuery}`);


      const sampleResponse = {
        status: "success",
        message: "Data found in breaches",
        data: [
          {
            email: searchQuery,
            breaches: [
              {
                breach_source: "Some Leak Database",
                breach_date: "2023-02-10",
                leaked_info: {
                  password: "hashed_password",
                  username: "exampleUser",
                  phone_number: "+1234567890"
                }
              },
              {
                breach_source: "Another Leak Database",
                breach_date: "2021-08-15",
                leaked_info: {
                  password: "hashed_password_2",
                  address: "123 Street Name, City, Country"
                }
              }
            ]
          }
        ]
      };
      // Update the user's credits
      user.credits -= 1;
      await user.save();
     
      res.status(200).json({
        message: "Search Result",
        searchQuery: searchQuery,
        sampleResponse
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  module.exports = {
    search
  };