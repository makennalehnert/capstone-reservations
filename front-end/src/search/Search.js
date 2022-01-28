import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ReservationRender from "../dashboard/ReservationRender";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

export default function Search({ }) {

    const [phone, setPhone] = useState("");
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);


//FORM HANDLERS
    function handleChange({target}){
        setPhone(target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        const abortController = new AbortController();
        setError(null);

        listReservations({mobile_number: phone}, abortController.signal)
        .then(setReservations)
        .catch(setError)

        return () => abortController.abort();
    }

//Lists Reservations matching number

    const searchResultsRender = () => {
        return reservations.length === 0 ? (<tr><td>No reservations found</td></tr>) : (
            reservations.map((reservation) => (
                <ReservationRender key={reservation.reservation_id} reservation={reservation}/>
            ))
        )
    }

  return (
    <>
      <h2>Search for Reservation</h2>
      <ErrorAlert error={error} />
      <div>
        <label>Phone Number:</label>
        <input name="mobile_number" 
               type="tel" 
               id="mobile_number"
               onChange={handleChange}
               placeholder="Enter a customer's phone number"
               required/>
        <button name="find" type="submit" onClick={handleSubmit}>Find</button>
      </div>
      <div>
      <table className="table table-hover mt-4">
        <thead className="thead-dark">
          <tr className="text-center">
            <th scope="col">ID</th>
            <th scope="col text-center">First Name</th>
            <th scope="col text-center">Last Name</th>
            <th scope="col text-center">Mobile Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
            <th scope="col">Seat</th>
          </tr>
        </thead>

        <tbody>{searchResultsRender()}</tbody>
      </table>          
      </div>
    </>
  );
}
