import React, {useEffect, useState} from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationsNew from "../reservations/ReservationsNew";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import TablesForm from "../tables/TablesForm";
import {
  listReservations,
  listTables,
} from "../utils/api";
import SeatReservation from "../reservations/SeatReservation";

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
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

  useEffect(loadDashboard, [date]);

  // RENDER DASHBOARD

  function loadDashboard(){
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null)
    listReservations({date: date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then((allTables) => allTables.sort((tableA, tableB) => tableA.table_id - tableB.table_id))
      .then(setTables)
      .catch(setTablesError)
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

      <Route path='/reservations/new'>
          <ReservationsNew loadDashboard={loadDashboard}/>
        </Route>

      <Route path='/reservations/:reservation_id/seat'>
        <SeatReservation loadDashboard={loadDashboard} tables={tables}/>
      </Route>
      <Route exact={true} path="/tables/new">
        <TablesForm loadDashboard={loadDashboard} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} reservations={reservations} reservationsError={reservationsError} tables={tables} tablesError={tablesError} loadDashboard={loadDashboard}/>
      </Route>

      <Route>
        <NotFound />
      </Route>

    </Switch>
  );
}

export default Routes;
