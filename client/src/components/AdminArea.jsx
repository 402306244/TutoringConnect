// Administrative dashboard for managing users, subjects, statistics, and platform-level actions.
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Bookings from "./Bookings.jsx";

export default function AdminArea() {
  const [stats, setStats] = useState(null),
    [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]),
    [name, setName] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const [a, b, c] = await Promise.all([
        api("/admin/stats"),
        api("/admin/users"),
        api("/subjects"),
      ]);
      setStats(a);
      setUsers(b);
      setSubjects(c);
    } catch (e) {
      setMessage(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createSubject() {
    try {
      await api("/subjects", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setName("");
      load();
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function changeRole(id, role) {
    try {
      await api("/admin/users/" + id, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
      load();
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <>
      <h2>Admin Dashboard</h2>
      <p>{message}</p>
      <div className="stats">
        {stats &&
          Object.entries(stats).map(([k, v]) => (
            <div className="card" key={k}>
              <b>{v}</b>
              <span>{k}</span>
            </div>
          ))}
      </div>
      <h3>Subjects</h3>
      <input
        placeholder="Subject name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createSubject}>Create Subject</button>
      <ul>
        {subjects.map((s) => (
          <li key={s._id}>{s.name}</li>
        ))}
      </ul>
      <h3>Users</h3>
      {users.map((u) => (
        <div className="row" key={u._id}>
          {u.name} - {u.email}
          <select
            value={u.role}
            onChange={(e) => changeRole(u._id, e.target.value)}
          >
            <option value="student">student</option>
            <option value="tutor">tutor</option>
            <option value="admin">admin</option>
          </select>
        </div>
      ))}
      <h3>Booking Management</h3>
      <Bookings />
    </>
  );
}
