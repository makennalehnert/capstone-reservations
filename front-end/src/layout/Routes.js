import React, {useEffect, useState} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationsNew from "../reservations/ReservationsNew";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import {
  listReservations,
} from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  useEffect(loadDashboard, [date]);

  // RENDER DASHBOARD

  function loadDashboard(){
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations({date: date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      {/* PATH FOR CREATING A NEW RESERVATION */}
      <Route path='/reservations/new'>
          <ReservationsNew loadDashboard={loadDashboard}/>
        </Route>

      <Route path="/dashboard">
        <Dashboard date={date} reservations={reservations} reservationsError={reservationsError} loadDashboard={loadDashboard}/>
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
