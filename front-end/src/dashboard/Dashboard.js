import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationRender from "./ReservationRender";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, reservationsError, loadDashboard }) {

  const history = useHistory();
  const reservationsRender = () => {
    return reservations.map((reservation) => (
      <ReservationRender key={reservation.reservation_id} reservation={reservation} loadDashboard={loadDashboard}/>
    ))
  }

  return (
    <div>
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table text-wrap text-center table-hover">
          <thead className="thead-dark">
            <tr className="text-center">
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">People</th>
            </tr>
          </thead>
          <tbody>{reservationsRender()}</tbody>
        </table>
        <br />
        <br />

    </main>
    </div>

  );
}

export default Dashboard;
