import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationRender from "./ReservationRender";
import TableRender from "./TableRender";
import { useHistory } from "react-router-dom";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, reservationsError, tables, tablesError, loadDashboard }) {
  
  const history = useHistory();

  const reservationsRender = () => {
    return reservations.map((reservation) => (
      <ReservationRender key={reservation.reservation_id} reservation={reservation} loadDashboard={loadDashboard}/>
    ))
  }

  const tablesRender = () => {
    return tables.map((table) => (
      <TableRender key={table.table_id} table={table} loadDashboard={loadDashboard}/>
    ))
  }

  function handleClick({target}){
    const queryParams = new URLSearchParams(window.location.search)
    let date = queryParams.get("date");
    
    let day = (date) ? new Date(date) : new Date();
    day.setUTCDate(day.getUTCDate());
    let dayDate = day.toISOString().slice(0,10);

    if(target.innerHTML === "Next Day"){
      let nextDay = new Date(dayDate);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      let nextDayDate = nextDay.toISOString().slice(0,10);
      
      history.push({ search : `date=${nextDayDate}`})
    }

    if(target.innerHTML === "Previous Day"){
      let prevDay = new Date(dayDate);
      prevDay.setUTCDate(prevDay.getUTCDate() - 1);
      let prevDayDate = prevDay.toISOString().slice(0,10);

      history.push({ search : `date=${prevDayDate}`})
    }
    
    if(target.innerHTML === "Today"){
      history.push('/');
    }

  }

  return (
    <div>
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <button onClick={handleClick}>
            Previous Day
        </button>
        <button onClick={handleClick}>
            Today
        </button>
        <button onClick={handleClick}>
            Next Day
        </button>
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
      <h4>Tables</h4>
      <ErrorAlert error={tablesError} />
      <table className="table">
          <thead className="thead-dark">
            <tr className="text-center">
              <th scope="col">Table ID</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Status</th>
              <th scope="col">Reservation ID</th>
              <th scope="col">Finish</th>
            </tr>
          </thead>
          <tbody>{tablesRender()}</tbody>
        </table>
    </main>
    </div>

  );
}

export default Dashboard;
