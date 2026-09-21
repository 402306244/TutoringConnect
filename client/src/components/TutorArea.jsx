// Tutor management area for adding availability and viewing tutor-related bookings.
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Bookings from "./Bookings.jsx";

export default function TutorArea({ user }) {
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setProfile(await api("/tutors/" + user.id));
      setSlots(await api("/availability"));
    } catch (e) {
      setMessage(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function add() {
    try {
      await api("/availability", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage("Availability added.");
      load();
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <>
      <h2>Tutor Area</h2>
      <p>{message}</p>
      <p>Subjects: {profile?.subjects?.map((s) => s.name).join(", ")}</p>
      <h3>Add Availability</h3>
      <input
        type="date"
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <input
        type="time"
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
      />
      <input
        type="time"
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
      />
      <button onClick={add}>Add</button>
      {slots.map((s) => (
        <div className="row" key={s._id}>
          {s.date} {s.startTime}-{s.endTime} -{" "}
          {s.available ? "Available" : "Booked"}
        </div>
      ))}
      <Bookings />
    </>
  );
}
