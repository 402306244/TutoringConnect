// Student dashboard for browsing tutors, checking availability, and creating bookings.
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Bookings from "./Bookings.jsx";

export default function StudentArea() {
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api("/tutors"), api("/subjects")])
      .then(([t, s]) => {
        setTutors(t);
        setSubjects(s);
      })
      .catch((e) => setMessage(e.message));
  }, []);

  async function availability(t) {
    setSelected(t);
    try {
      setSlots(await api("/availability?tutor=" + t.user._id));
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function book(slot) {
    if (!subject) {
      setMessage("Select a subject first.");
      return;
    }
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          tutor: selected.user._id,
          subject,
          availability: slot._id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }),
      });
      setMessage("Booking created.");
      setSlots(await api("/availability?tutor=" + selected.user._id));
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <>
      <h2>Find Tutor</h2>
      <p>{message}</p>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select subject</option>
        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      {tutors.map((t) => (
        <div className="card" key={t._id}>
          <h3>{t.user.name}</h3>
          <p>{t.bio || "No biography added."}</p>
          <p>Subjects: {t.subjects.map((s) => s.name).join(", ")}</p>
          <button onClick={() => availability(t)}>View Availability</button>
        </div>
      ))}

      {selected && (
        <section>
          <h3>Microsoft Teams availability</h3>
          {slots
            .filter((x) => x.available)
            .map((x) => (
              <div className="row" key={x._id}>
                {x.date} {x.startTime}-{x.endTime}
                <button onClick={() => book(x)}>Book</button>
              </div>
            ))}
        </section>
      )}
      <Bookings />
    </>
  );
}
