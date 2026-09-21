// Login and registration screen for students and tutors.
import React, { useState } from "react";
import { api } from "../api.js";

export default function Auth({ onLogin }) {
  const [register, setRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      onLogin(
        await api(register ? "/auth/register" : "/auth/login", {
          method: "POST",
          body: JSON.stringify(form),
        }),
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="auth">
      <h1>Tutoring Connect</h1>
      <form onSubmit={submit}>
        {register && (
          <input
            placeholder="Full name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {register && (
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>
        )}
        <button>{register ? "Register" : "Login"}</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setRegister(!register)}>
        {register ? "Back to Login" : "Create Account"}
      </button>
    </main>
  );
}
