const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const e = require("express");

//
/**
 * List handler for reservation resources
 */

//VALIDATION MIDDLEWARE

//Checks if Reservation Exists

async function reservationExists(req, res, next){
  const reservation = await reservationsService.read(req.params.reservationId);
  if(reservation){
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`
  })
}

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
  const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`)
  let today = new Date();
  let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let todayDate = (today.getUTCFullYear()) + "-" + (today.getMonth() + 1)+ "-" + (today.getUTCDate());

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
  if(parsedToday - parsedRes >= 1){
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

function validStatus(req, res, next){
  const {status} = req.body.data;
  if(status === 'seated'){
    return next({
      status:400,
      message: 'Reservation is seated.'
    })
  }
  else if(status === 'finished'){
    return next({
      status:400,
      message: 'Reservation is finished.'
    })
  }
  next();
}

function statusValidator(req, res, next){
  const status = req.body.data.status;
  const currentStatus = res.locals.reservation.status;
  const validStatuses = ["booked", "seated", "finished", "canceled"];

  if(!validStatuses.includes(status)){
    return next({
      status:400,
      message:'Status of reservation is unknown.'
    })
  }
  else if(currentStatus === "finished"){
    return next({
      status:400,
      message:'Reservation is already finished.'
    })
  }
  next();
}


//updateStatusValidator

//CRUD OPERATIONS//
function read(req, res, next){
  const {reservation: data} = res.locals;
  res.json({data});
}


async function list(req, res) {
  const date = req.query.date;
  const reservations = await reservationsService.list(date)
  res.json({data: reservations})
}

async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data});
}

async function update(req, res) {
  const reservation_id = req.params.reservationId;
  const status = req.body.data.status;

  const statusUpdate = await reservationsService.update(reservation_id, status);
  res.status(200).json({ data: statusUpdate});
}

module.exports = {
  read: [asyncErrorBoundary(reservationExists), read],
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties, hasRequiredProperties, peopleIsNumber, validDate, validTime, pastReservation, isTuesday, timeAvailable, validStatus, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(reservationExists), statusValidator, asyncErrorBoundary(update)]
};
