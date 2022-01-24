import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, createReservation } from "../utils/api";

export default function ReservationsNew({loadDashboard}) {
  const [apiErrors, setApiErrors] = useState(null);
  const [errors, setErrors] = useState([]);

  const params = useParams();
  const history = useHistory();
  const { reservation_id } = useParams();

  const initializedReservationFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservationForm, setReservationForm] = useState(
    initializedReservationFormState
  );
  const [reservationErrors, setReservationErrors] = useState(null)

  useEffect(() => {
    async function loadReservations(){
      const abortController = new AbortController();
      return await listReservations(null, abortController.signal)
      .catch(setReservationErrors)
    }
  }, []);

  //FORM VALIDATERS

  function checkFields(foundErrors){
    for(const field in reservationForm){
      if(reservationForm[field] === ""){
        foundErrors.push({message: `${field} cannot be left blank.`})
      }
    }
    return foundErrors.length === 0;
  }

  function validateDate(foundErrors){
    const reservationDateTime = new Date(
      `${reservationForm.reservation_date}T${reservationForm.reservation_time}:00.000`
    );
    const today = new Date();
    if (reservationDateTime.getDay() === 2) {
      foundErrors.push({
        message: "Invalid date: restaurant is closed on tuesdays.",
      });
    }
    if (reservationDateTime < today) {
      foundErrors.push({
        message: "invalid date: only reservations for future dates can be made",
      });
    }
    if (
      reservationDateTime.getHours() < 10 ||
      (reservationDateTime.getHours() === 10 &&
        reservationDateTime.getMinutes() < 30)
    ) {
      foundErrors.push({
        message: "invalid time: restaurant does not open until 10:30am",
      });
    } else if (
      reservationDateTime.getHours() > 22 ||
      (reservationDateTime.getHours() === 22 &&
        reservationDateTime.getMinutes() >= 30)
    ) {
      foundErrors.push({
        message: "invalid time: restaurant closes at 10:30pm",
      });
    } else if (
      reservationDateTime.getHours() > 21 ||
      (reservationDateTime.getHours() === 21 &&
        reservationDateTime.getMinutes() > 30)
    ) {
      foundErrors.push({
        message:
          "invalid time: reservation must be made at least an hour before closing",
      });
    }
    return foundErrors.length === 0;
  }
  

  //FORM HANDLERS//
  
  function handleChange({target}){
      setReservationForm({...reservationForm,
         [target.name]: 
         target.name === "people" ? Number(target.value) : target.value})
    }

  function handleSubmit(event) {
      event.preventDefault();
      const abortController = new AbortController();
      const foundErrors = [];
      
      if(validateDate(foundErrors) && checkFields(foundErrors)) {
        createReservation(reservationForm, abortController.signal)
          .then(loadDashboard)
          .then(() => history.push(`/dashboard?date=${reservationForm.reservation_date}`))
          .catch(setApiErrors)
      }
      setErrors(foundErrors);
      return () => abortController.abort();
    }

    const jsxErrors = () => {
      return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />)
    }

  return (
    <>
      <div>
        <h1>Make New Reservation</h1>
        <form>
          {jsxErrors()}
          <ErrorAlert error={apiErrors}/>
          <ErrorAlert error={reservationErrors} />
          <div className="form-group">
            <label for="exampleFormControlInput1">First Name:</label>
            <input
              name="first_name"
              type="text"
              className="form-control"
              id="first_name"
              placeholder="First Name"
              onChange={handleChange}
              value={reservationForm.first_name}
              required
            />
          </div>
          <div className="form-group">
            <label for="exampleFormControlInput1">Last Name:</label>
            <input
              name="last_name"
              type="text"
              className="form-control"
              id="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              value={reservationForm.last_name}
              required
            />
          </div>
          <div className="form-group">
            <label for="exampleFormControlInput1">Mobile number:</label>
            <input
              name="mobile_number"
              type="tel"
              className="form-control"
              id="mobile_number"
              placeholder="Mobile Number"
              onChange={handleChange}
              value={reservationForm.mobile_number}
              required
            />
          </div>
          <div className="form-group">
            <label for="exampleFormControlInput1">Date of reservation:</label>
            <input
              name="reservation_date"           
              type="date"
              className="form-control"
              id="reservation_date"
              placeholder="Date of Reservation"
              onChange={handleChange}
              value={reservationForm.reservation_date}
              required
            />
          </div>
          <div className="form-group">
            <label for="exampleFormControlInput1">Time of reservation:</label>
            <input
              name="reservation_time"
              type="time"
              className="form-control"
              id="reservation_time"
              placeholder="Time of Reservation"   
              onChange={handleChange}           
              value={reservationForm.reservation_time}
              required
            />
          </div>
          <div className="form-group">
            <label for="exampleFormControlInput1">Number of people in the party, which must be at least 1 person:</label>
            <input
              name="people"
              type="number"
              className="form-control"
              id="people"
              min="1"
              max="25"
              placeholder="Number of people in the party"
              onChange={handleChange}
              value={reservationForm.people}
              required
            />
          </div>
          <button
            type="cancel"
            className="btn btn-secondary"
            onClick={() => history.push("/")}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
