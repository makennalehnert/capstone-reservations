import React from "react";

export default function ReservationsList({reservations}){
    if(reservations){
        return reservations.map((reservation) => {
            return (
                <div key={reservation.reservation_id}>
                    <div className="card bg-dark text-light m-1">
                        <div className="card-body">
                            <h4 className="card-title">Reservation for: {reservation.first_name}{" "}{reservation.last_name}</h4>
                            <p className="card-text">{reservation.mobile_number}</p>
                            <p className="card-text">{reservation.reservation_date}</p>
                            <p className="card-text">{reservation.reservation_time}</p>
                            <p className="card-text">{reservation.people}</p>
                        </div>
                    </div>
                </div>
            )
        })
    }

}