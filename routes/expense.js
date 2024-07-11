const express = require('express');

const router = express.Router();

const expenseController = require('../controllers/expense');
const auth = require('../middlerware/auth')

router.get('/get-expense/:page/:limit',auth.authenticate,expenseController.getExpenses);

router.get('/get-expense',auth.authenticate,expenseController.getExpensesReport);

router.post('/add-expense',auth.authenticate,expenseController.addExpense);

router.delete('/delete-expense/:id',auth.authenticate,expenseController.deleteExpense);

router.put('/update-expense/:id',auth.authenticate,expenseController.updateExpense)

router.get('/dowload',auth.authenticate,expenseController.downloadFile);


module.exports = router;