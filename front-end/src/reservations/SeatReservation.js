import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, seatTable } from "../utils/api";

export default function SeatReservation({ tables, loadDashboard }) {
  const [table_id, setTable_id] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null);
  const history = useHistory();

  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(null, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }, []);

  if (!tables || !reservations) return null;

  const tablesRender = () => {
    return tables.map((table) => (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    ));
  };

  const errorsRender = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  //Form Validators

  function validSeat() {
    const foundErrors = [];

    /** checks for table that matches the given table_id */
    const foundTable = tables.find(
      (table) => table.table_id === Number(table_id)
    );
    /** checks for reservation that matches the given reservation_id */
    const foundReservation = reservations.find(
      (reservation) => reservation.reservation_id === Number(reservation_id)
    );

    if(!foundTable){
        foundErrors.push('Table does not exist.')
    }
    if(!foundReservation){
        foundErrors.push('Reservation does not exist.')
    }
    if(foundReservation.people > foundTable.capacity){
        foundErrors.push('Table does not have enough seats for reservation party.')
    }
    if(foundTable.status === "occupied") {
        foundErrors.push("Table is already occupied.")
    }

    setErrors(foundErrors);
    return foundErrors.length === 0;
  }

  //Form handlers

  function handleChange({ target }) {
    setTable_id(target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();


    if (validSeat()) {
      seatTable(reservation_id, table_id, abortController.signal)
        .then(loadDashboard)
        .then(() => history.push("/dashboard"))
        .catch(setApiError);
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <form>
        {errorsRender()}
        <ErrorAlert error={apiError} />
        <ErrorAlert error={reservationsError} />
        <h4>Seat Reservation</h4>
        <label>Choose table:</label>
        <select
          name="table_id"
          id="table_id"
          value={table_id}
          onChange={handleChange}
        >
          <option value={0}>Choose table</option>
          {tablesRender()}
        </select>
        <button type="submit" onClick={handleSubmit}>Submit</button>
        <button type="button" onClick={history.goBack}>Cancel</button>
      </form>
    </div>
  );
}
