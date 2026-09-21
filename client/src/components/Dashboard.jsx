// Landing page shown after login, with a user-specific welcome and booking overview.
import React from "react";
import Bookings from "./Bookings.jsx";

export default function Dashboard({ user }) {
  return (
    <>
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>
      <p>
        Tutoring Connect supports peer tutoring, scheduling, bookings and
        Microsoft Teams sessions.
      </p>
      {user.role === "student" && <Bookings />}
    </>
  );
}
