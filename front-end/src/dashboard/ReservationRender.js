import React from "react";

export default function ReservationRender({reservation, loadDashboard}){
    if(!reservation) return null;

    return (
        <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td className="text-center">{reservation.first_name}</td>
      <td className="text-center">{reservation.last_name}</td>
      <td className="text-center">{reservation.mobile_number}</td>
      <td className="text-center">{reservation.reservation_date.substr(0, 10)}</td>
      <td className="text-center">{reservation.reservation_time.substr(0, 5)}</td>
      <td className="text-center">{reservation.people}</td>
      <td className="text-center" data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>

      {reservation.status === "booked" && (
        <>
        <td className="text-center">
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button className="btn btn-sm btn-success" type="button">Seat</button>
            </a>
        </td>
        </>
      )}

    </tr>
    )
}