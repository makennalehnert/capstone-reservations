import React from "react";
import {Link} from "react-router-dom";

export default function ReservationRender({reservation, loadDashboard}){
    if(!reservation) return null;

    return (
        <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td class="text-center">{reservation.first_name}</td>
      <td class="text-center">{reservation.last_name}</td>
      <td class="text-center">{reservation.mobile_number}</td>
      <td class="text-center">{reservation.reservation_date.substr(0, 10)}</td>
      <td class="text-center">{reservation.reservation_time.substr(0, 5)}</td>
      <td class="text-center">{reservation.people}</td>
      <td class="text-center" data-reservation-id-status={reservation.reservation_id}>
      </td>
    </tr>
    )
}