import React from "react";
import { finishTable } from "../utils/api";

export default function TableRender({table, loadDashboard}){
    if(!table) return null;

    function handleFinish({table_id}){
        const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")
          if(result){
            finishTable(table_id)
            .then(loadDashboard)
            .catch(console.log);
          }  
    }

    let tableStatus = table.reservation_id ? "occupied" : "free";

    return (
        <tr>
      <th scope="row">{table.table_id}</th>
      <td className="text-center">{table.table_name}</td>
      <td className="text-center">{table.capacity}</td>
      <td className="text-center" data-table-id-status={table.table_id}>
          {tableStatus}
      </td>
      <td className="text-center">
          {table.reservation_id ? table.reservation_id : "--"}
      </td>

      {tableStatus === "occupied" && (
          <td className="text-center">
              <button
              data-table-id-finish={table.table_id}              
              className="btb btn-secondary"
              onClick={(event) => {
                event.preventDefault();
                handleFinish(table)
              }}>
                  Finish</button>
          </td>
      )}
    </tr>
    )
}