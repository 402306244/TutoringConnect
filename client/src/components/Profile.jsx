// Profile page for editing account details, submitting system feedback, and creating support queries.
import React, { useState } from "react";
import { api } from "../api.js";

export default function Profile({ user, setUser }) {
  const [name, setName] = useState(user.name),
    [email, setEmail] = useState(user.email);
  const [rating, setRating] = useState(5),
    [comment, setComment] = useState(""),
    [support, setSupport] = useState("");
  const [message, setMessage] = useState("");

  async function save() {
    try {
      const updated = await api("/me", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });
      const next = { ...user, name: updated.name, email: updated.email };
      localStorage.user = JSON.stringify(next);
      setUser(next);
      setMessage("Profile saved.");
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function rate() {
    try {
      await api("/ratings/system", {
        method: "POST",
        body: JSON.stringify({ rating: Number(rating), comment }),
      });
      setMessage("Rating submitted.");
    } catch (e) {
      setMessage(e.message);
    }
  }

  async function supportSubmit() {
    try {
      await api("/support", {
        method: "POST",
        body: JSON.stringify({ message: support }),
      });
      setSupport("");
      setMessage("Support query submitted.");
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <>
      <h2>Profile</h2>
      <p>{message}</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={save}>Save Profile</button>
      <h3>Rate System</h3>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1, 2, 3, 4, 5].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <textarea
        value={comment}
        placeholder="Comment"
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={rate}>Submit Rating</button>
      <h3>Support Query</h3>
      <textarea
        value={support}
        placeholder="Question or problem"
        onChange={(e) => setSupport(e.target.value)}
      />
      <button onClick={supportSubmit}>Submit Query</button>
    </>
  );
}
