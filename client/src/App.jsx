// Main application shell: keeps the logged-in user, manages the active page,
// and decides which area of the app should be shown based on user role.
import React, { useState } from "react";
import AdminArea from "./components/AdminArea.jsx";
import Auth from "./components/Auth.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import StudentArea from "./components/StudentArea.jsx";
import TutorArea from "./components/TutorArea.jsx";

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.user || "null"),
  );
  const [page, setPage] = useState("dashboard");

  if (!user)
    return (
      <Auth
        onLogin={(r) => {
          localStorage.token = r.token;
          localStorage.user = JSON.stringify(r.user);
          setUser(r.user);
        }}
      />
    );

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <>
      <header>
        <h1>Tutoring Connect</h1>
        <nav>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          {user.role === "student" && (
            <button onClick={() => setPage("student")}>Find Tutor</button>
          )}
          {user.role === "tutor" && (
            <button onClick={() => setPage("tutor")}>Tutor Area</button>
          )}
          {user.role === "admin" && (
            <button onClick={() => setPage("admin")}>Admin</button>
          )}
          <button onClick={() => setPage("profile")}>Profile</button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>
      <main>
        {page === "dashboard" && <Dashboard user={user} />}
        {page === "student" && <StudentArea />}
        {page === "tutor" && <TutorArea user={user} />}
        {page === "admin" && <AdminArea />}
        {page === "profile" && <Profile user={user} setUser={setUser} />}
      </main>
    </>
  );
}
