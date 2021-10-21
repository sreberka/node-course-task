const express = require('express');
const userController = require('./../controllers/userController');
const exercisesController = require('./../controllers/exercisesController');
const logsController = require('./../controllers/logsController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:_id/exercises')
  .post(exercisesController.createExercise)

router
  .route('/:_id/logs')
  .get(logsController.getLogs)

module.exports = router;