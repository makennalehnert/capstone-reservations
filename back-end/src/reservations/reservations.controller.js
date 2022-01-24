const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const e = require("express");

//
/**
 * List handler for reservation resources
 */

//VALIDATION MIDDLEWARE

const VALID_PROPERTIES = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
];

//Checks if request has only valid properties
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));

  if(invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`
    })
  }
  next();
}

//Checks if request has all required properties
const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

//Checks if people is a number
function peopleIsNumber(req, res, next){
  const {data = {}} = req.body;
  const {people} = data;
  console.log(typeof people);
  if(typeof people !== "number") {
    return next({
      status: 400,
      message: 'Invalid field: people is not a number.'
    })
  }
  next();
}

//Checks if date is a valid date
function validDate(req, res, next){
  const {data = {}} = req.body;
  const {reservation_date} = data;
  let parsedDate = Date.parse(reservation_date);
  if(!Number.isInteger(parsedDate)){
    return next({
      status: 400,
      message: 'Invalid field: reservation_date is not a date.'
    })
  }
  next();
}

//Checks if time is a valid time
function validTime(req, res, next){
  const {data = {}} = req.body;
  const {reservation_time} = data;
  const timeReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  if(!reservation_time.match(timeReg)){
    return next({
      status: 400,
      message: 'Invalid field: reservation_time is not a time.'
    })
  }
  next();
}

//Checks if time is available for reservation
function timeAvailable(req, res, next){
  const {reservation_time} = req.body.data;
  const {reservation_date} = req.body.data;

  let today = new Date();
  let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let todayDate = (today.getUTCFullYear()) + "-" + (today.getMonth() + 1)+ "-" + (today.getUTCDate());
  console.log(reservation_date, todayDate);

  if(reservation_date <= todayDate && reservation_time < currentTime){
    return next({
      status: 400,
      message: 'Invalid field: Must make reservation for future time.'
    })
  } else if(reservation_time < '10:30'){
    return next({
      status: 400,
      message: 'Invalid field: Restaurant not open until 10:30.'
    })
  } else if(reservation_time > '21:30'){
    return next({
      status: 400,
      message: 'Invalid field: Restaurant closes at 22:30.'
    })
  }else{
    next();
  }
}

//Checks if reservation occurs in past
function pastReservation(req, res, next){
  const {data = {}} = req.body;
  const {reservation_date} = data;
  const today = new Date();
  const parsedRes = Date.parse(reservation_date);
  const parsedToday = Date.parse(today);
  if(parsedToday - parsedRes > 0){
    return next({
      status: 400,
      message: 'Invalid field: reservation_date is not a future date.'
    })
  }
  next();
}

//Checks if reservation is on a Tuesday

function getDayOfWeek(date) {
  const dayOfWeek = new Date(`${date} 02:30`).getDay();    
  return isNaN(dayOfWeek) ? null : 
    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

function isTuesday(req, res, next){
  const {data = {}} = req.body;
  const {reservation_date} = data;
  if(getDayOfWeek(reservation_date) === "Tuesday"){
    return next({
      status: 400,
      message: 'Restaurant closed on Tuesday.'
    })
  }
    next();
}

//CRUD OPERATIONS//

async function list(req, res) {
  const date = req.query.date;
  const reservations = await reservationsService.list(date)
  res.json({data: reservations})
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties, hasRequiredProperties, peopleIsNumber, validDate, validTime, pastReservation, isTuesday, timeAvailable, asyncErrorBoundary(create)],
};
