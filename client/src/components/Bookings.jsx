// Displays the current user's booking list and allows selecting actions like cancel or complete.
import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setBookings(await api("/bookings"));
    } catch (e) {
      setMessage(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function status(id, value) {
    try {
      await api("/bookings/" + id + "/status", {
        method: "PUT",
        body: JSON.stringify({ status: value }),
      });
      load();
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <section>
      <h3>Bookings</h3>
      <p>{message}</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Subject</th>
            <th>Tutor</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.date}</td>
              <td>
                {b.startTime}-{b.endTime}
              </td>
              <td>{b.subject?.name}</td>
              <td>{b.tutor?.name}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "Pending" && (
                  <button onClick={() => status(b._id, "Cancelled")}>
                    Cancel
                  </button>
                )}
                {b.status === "Confirmed" && (
                  <button onClick={() => status(b._id, "Completed")}>
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
