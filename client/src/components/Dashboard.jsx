// Client/Student dashboard.
//
// Handles:
// - Welcome section
// - Account information
// - Upcoming booking summary
// - Booking overview
// - Client navigation information

import React, {
  useEffect,
  useState,
} from "react";

import Bookings from "./Bookings.jsx";

import { api } from "../api.js";


export default function Dashboard({ user }) {

  const [bookings, setBookings] =
    useState([]);

  const [message, setMessage] =
    useState("");


  // ============================================================
  // LOAD BOOKINGS
  // ============================================================

  useEffect(() => {

    async function loadBookings() {

      // Tutors/admins do not need the student
      // upcoming booking summary here.

      if (user.role !== "student") {

        return;

      }


      try {

        const data =
          await api("/bookings");


        setBookings(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        setMessage(
          error.message
        );

      }

    }


    loadBookings();

  }, [user.role]);


  // ============================================================
  // UPCOMING BOOKINGS
  // ============================================================

  const upcomingBookings =
    bookings
      .filter(
        (booking) =>
          booking.status === "Pending" ||
          booking.status === "Confirmed"
      )
      .slice(0, 3);


  // ============================================================
  // DASHBOARD
  // ============================================================

  return (

    <section>


      {/* ======================================================
          WELCOME
      ====================================================== */}

      <div className="card">

        <h2>
          Welcome, {user.name}
        </h2>

        <p>
          Welcome to your Tutoring Connect dashboard.
        </p>

        <p>
          Use the navigation above to manage your
          tutoring activities, profile and bookings.
        </p>

      </div>


      {/* ======================================================
          ACCOUNT INFORMATION
      ====================================================== */}

      <div className="card">

        <h3>
          Account Information
        </h3>

        <p>
          <strong>Name:</strong>{" "}
          {user.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {user.role}
        </p>

      </div>


      {/* ======================================================
          UPCOMING BOOKINGS
      ====================================================== */}

      {user.role === "student" && (

        <div className="card">

          <h3>
            Upcoming Bookings
          </h3>


          {message && (

            <p className="error-message">
              {message}
            </p>

          )}


          {upcomingBookings.length === 0 ? (

            <p>
              You currently have no upcoming bookings.
            </p>

          ) : (

            <div>

              {upcomingBookings.map(
                (booking) => (

                  <div
                    className="row"
                    key={booking._id}
                  >

                    <div>

                      <strong>
                        {booking.subject?.name ||
                          "Tutoring Session"}
                      </strong>

                      <p>
                        Date:{" "}
                        {booking.date}
                      </p>

                      <p>
                        Time:{" "}
                        {booking.startTime}
                        {" - "}
                        {booking.endTime}
                      </p>

                      <p>
                        Tutor:{" "}
                        {booking.tutor?.name ||
                          "Tutor"}
                      </p>

                      <p>
                        Status:{" "}
                        {booking.status}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      )}


      {/* ======================================================
          STUDENT INFORMATION
      ====================================================== */}

      {user.role === "student" && (

        <div className="card">

          <h3>
            Find a Tutor
          </h3>

          <p>
            Use the Find Tutor section to search
            for tutors, view their availability and
            create a Microsoft Teams tutoring booking.
          </p>

        </div>

      )}


      {/* ======================================================
          EXISTING BOOKING MANAGEMENT
      ====================================================== */}

      {user.role === "student" && (

        <Bookings />

      )}

    </section>

  );

}