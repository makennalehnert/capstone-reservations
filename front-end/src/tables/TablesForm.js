import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";


export default function TablesForm({loadDashboard}) {
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState(null);
  const history = useHistory();

//Form Validators

function validFields(){
    let foundErrors = null;

    for(const field in form){
        if(form[field] === "" || null){
          foundErrors = {
              message: 'Fields cannot be left blank!'
          }
        }
      }
    if(form.table_name.length < 2){
        foundErrors = {
            message: 'Table name must be at least 2 characters long.'
        }
    }
    else if(Number(form.capacity) < 1){
        foundErrors = {
            message: 'Capacity must be at least 1.'
        }
    }
    setError(foundErrors);
    return foundErrors === null;
}

//Form Handlers//
function handleChange({target}){
    setForm({...form, [target.name]: target.name === "capacity" ? Number(target.value) : target.value});
  }

function handleSubmit(event){
    event.preventDefault();
    const abortController = new AbortController();
    
    if(validFields()) {
        createTable(form, abortController.signal)
        .then(loadDashboard)
        .then(() => history.push(`/dashboard`))
        .catch(setError)
    }
    return () => abortController.abort();
}

  return (
    <>
      <div>
        <h1>Create New Table</h1>
        <form>
          {error ? <ErrorAlert error={error} /> : ""}
          <div className="form-group">
            <label htmlFor="table_name">Table Name:</label>
            <input
              name="table_name"
              type="text"
              className="form-control"
              minLength="2"
              id="table_name"
              placeholder="Table Name"
              onChange={handleChange}
              value={form.table_name}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input
              name="capacity"
              type="number"
              className="form-control"
              id="capacity"
              placeholder="1"
              onChange={handleChange}
              value={form.capacity}
              required
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
