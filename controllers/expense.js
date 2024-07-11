const Expense = require("../models/expense");
const User = require("../models/user");
const AWS = require("aws-sdk");
require("dotenv").config();
const FileURL = require('../models/fileUrl');

exports.addExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newExpense = new Expense({
      description,
      amount,
      category,
      user: userId
    });

    await newExpense.save();

    user.totalAmount += parseInt(amount);
    await user.save();

    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err });
  }
};

exports.getExpenses = async (req, res, next) => {
    
    const userId = req.user.id;
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const expenses = await Expense.find({ user: userId })
        .skip(skip)
        .limit(limit)
        .exec();
  
      const totalItems = await Expense.countDocuments({ user: userId });
  
      res.status(200).json({
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        expenses: expenses
      });
    } catch (err) {
      res.status(500).json({ message: 'An error occurred', error: err });
    }
  };



exports.deleteExpense = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; 

  try {
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    const currentTotalAmount = parseInt(user.totalAmount) || 0;
    const updatedTotalAmount = currentTotalAmount - parseInt(expense.amount);

    user.totalAmount = updatedTotalAmount;
    await user.save();

    await Expense.findByIdAndDelete(id);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err });
  }
};

exports.updateExpense = async (req, res, next) => {
    const { description, amount, category } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
  
  
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const oldExpense = await Expense.findById(id);
      if (!oldExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      if (oldExpense.user.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      const currentTotalAmount = parseInt(user.totalAmount) || 0;
      const updatedTotalAmount =
        currentTotalAmount - parseInt(oldExpense.amount) + parseInt(amount);
  
      user.totalAmount = updatedTotalAmount;
      await user.save();
  
      oldExpense.description = description;
      oldExpense.amount = amount;
      oldExpense.category = category;
  
      const updatedExpense = await oldExpense.save();
  
      res.status(200).json({
        message: "Expense updated successfully",
        expense: updatedExpense,
      });
    } catch (err) {
      res.status(500).json({ message: "An error occurred", error: err });
    }
    
    
       
  };
  
  exports.getExpensesReport = async (req, res, next) => {
    const userId = req.user.id;
    
  
    try {
      const expenses = await Expense.find({user : userId});
   
      
      res.status(200).json(expenses);
    } catch (err) {
      res.status(500).json({ message: 'An error occurred', error: err });
    }
  };

async function uploadFile(data, fileName) {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  
    return new Promise((resolve, reject) => {
      s3.createBucket(() => {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: data,
          ACL: 'public-read'
        };
  
        s3.upload(params, (err, s3Response) => {
          if (err) {
            reject(err);
          } else {
            
            resolve(s3Response.Location);
          }
        });
      });
    });
  }
  
  exports.downloadFile = async (req, res, next) => {
  
    try {
      const userId = req.user.id;
      
      const allExpense = await Expense.find({user : userId});
      const data = JSON.stringify(allExpense);
      const fileName = `expense${userId}/${new Date()}.txt`;
      const fileURL = await uploadFile(data, fileName);

      const fileurl = new FileURL({
        url : fileURL,
        user :userId
      });
        
      fileurl.save();
       
      
      res.json({fileURL : fileURL});
      
    } catch (error) {
     
      res.json({err : error});
    }
  
  };
