import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import Bookings from "./Bookings.jsx";

export default function StudentArea() {
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [tutorSearch, setTutorSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api("/subjects"), api("/tutors")])
      .then(([subjectData, tutorData]) => {
        if (!active) return;
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
        setTutors(Array.isArray(tutorData) ? tutorData : []);
      })
      .catch((e) => active && setError(e.message || "Unable to load subjects and tutors."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const visibleSubjects = useMemo(() => {
    const q = subjectSearch.trim().toLowerCase();
    return subjects.filter((s) => {
      const matchesText = !q || `${s.name || ""} ${s.description || ""}`.toLowerCase().includes(q);
      const hasDescription = Boolean(s.description && s.description.trim());
      const matchesFilter = subjectFilter === "all" || (subjectFilter === "described" && hasDescription) || (subjectFilter === "no-description" && !hasDescription);
      return matchesText && matchesFilter;
    });
  }, [subjects, subjectSearch, subjectFilter]);

  const visibleTutors = useMemo(() => {
    if (!selectedSubject) return [];
    const q = tutorSearch.trim().toLowerCase();
    const results = tutors.filter((t) => {
      const teaches = (t.subjects || []).some((s) => String(s?._id || s) === String(selectedSubject._id));
      const qualifications = Array.isArray(t.qualifications) ? t.qualifications.join(" ") : (t.qualifications || "");
      const searchable = `${t.user?.name || ""} ${t.bio || ""} ${qualifications}`.toLowerCase();
      return teaches && (!q || searchable.includes(q));
    });
    if (sortBy === "name") results.sort((a, b) => (a.user?.name || "").localeCompare(b.user?.name || ""));
    if (sortBy === "qualifications") results.sort((a, b) => String(b.qualifications || "").localeCompare(String(a.qualifications || "")));
    return results;
  }, [tutors, selectedSubject, tutorSearch, sortBy]);

  function selectSubject(subject) {
    setSelectedSubject(subject);
    setSelectedTutor(null);
    setSlots([]);
    setTutorSearch("");
    setMessage("");
    setError("");
  }

  async function openTutor(tutor) {
    setSelectedTutor(tutor);
    setSlots([]);
    setMessage("");
    setError("");
    setLoadingProfile(true);
    try {
      // Existing API identifies a tutor profile by the associated User ID.
      const profile = await api(`/tutors/${tutor.user._id}`);
      if (profile) setSelectedTutor(profile);
      const availability = await api(`/availability?tutor=${encodeURIComponent(tutor.user._id)}&available=true`);
      setSlots(Array.isArray(availability) ? availability.filter((s) => s.available) : []);
    } catch (e) {
      setError(e.message || "Unable to load tutor profile or availability.");
    } finally {
      setLoadingProfile(false);
    }
  }

  async function bookSession(slot) {
    if (!selectedTutor || !selectedSubject) return;
    setBookingId(slot._id);
    setMessage("");
    setError("");
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          tutor: selectedTutor.user._id,
          subject: selectedSubject._id,
          availability: slot._id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }),
      });
      setMessage("Booking request created. Check your bookings below for its status.");
      setSlots((current) => current.filter((s) => s._id !== slot._id));
    } catch (e) {
      setError(e.message || "Unable to create booking. The session may no longer be available.");
    } finally {
      setBookingId("");
    }
  }

  function backToSubjects() {
    setSelectedSubject(null); setSelectedTutor(null); setSlots([]); setMessage(""); setError("");
  }
  function backToTutors() {
    setSelectedTutor(null); setSlots([]); setMessage(""); setError("");
  }
  function qualificationsList(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) return value.split(",").map((x) => x.trim()).filter(Boolean);
    return [];
  }

  if (loading) return <section className="student-area"><h2>Explore subjects</h2><p>Loading subjects and tutors…</p></section>;

  return (
    <section className="student-area">
      <div className="student-area-heading">
        <p className="eyebrow">YOUR LEARNING JOURNEY</p>
        <h2>{selectedTutor ? "Tutor profile" : selectedSubject ? "Find your tutor" : "Explore subjects"}</h2>
        <p>Choose a subject, explore peer tutors, and find an available session.</p>
      </div>
      {message && <p className="student-message success-message" role="status">{message}</p>}
      {error && <p className="student-message error-message" role="alert">{error}</p>}

      {!selectedSubject && <>
        <div className="browse-toolbar">
          <input type="search" aria-label="Search subjects" placeholder="Search subjects or modules…" value={subjectSearch} onChange={(e) => setSubjectSearch(e.target.value)} />
          <select aria-label="Filter subjects" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="all">All subjects</option><option value="described">With descriptions</option><option value="no-description">Without descriptions</option>
          </select>
        </div>
        <p className="results-count">{visibleSubjects.length} subject{visibleSubjects.length === 1 ? "" : "s"} found</p>
        {visibleSubjects.length === 0 ? <div className="empty-state"><h3>No subjects found</h3><p>Try a different search or filter.</p></div> :
          <div className="subject-grid">{visibleSubjects.map((s) => <article className="card subject-card" key={s._id}>
            <div className="subject-card-icon" aria-hidden="true">{(s.name || "S").charAt(0).toUpperCase()}</div>
            <h3>{s.name}</h3><p>{s.description || "Explore peer tutors available for this subject."}</p>
            <button type="button" onClick={() => selectSubject(s)}>Find tutors <span aria-hidden="true">→</span></button>
          </article>)}</div>}
      </>}

      {selectedSubject && !selectedTutor && <>
        <div className="breadcrumb-row"><button type="button" className="text-button" onClick={backToSubjects}>← All subjects</button><span>/</span><strong>{selectedSubject.name}</strong></div>
        <div className="selected-subject-banner"><p className="eyebrow">SELECTED SUBJECT</p><h3>{selectedSubject.name}</h3><p>{selectedSubject.description || "Tutors assigned to this subject are listed below."}</p></div>
        <div className="browse-toolbar">
          <input type="search" aria-label="Search tutors" placeholder="Search tutors by name, bio or qualification…" value={tutorSearch} onChange={(e) => setTutorSearch(e.target.value)} />
          <select aria-label="Sort tutors" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="name">Sort by name</option><option value="qualifications">Sort by qualifications</option></select>
        </div>
        <p className="results-count">{visibleTutors.length} tutor{visibleTutors.length === 1 ? "" : "s"} found</p>
        {visibleTutors.length === 0 ? <div className="empty-state"><h3>No matching tutors</h3><p>No tutor is assigned to this subject matching your search.</p><button type="button" onClick={backToSubjects}>Browse other subjects</button></div> :
          <div className="tutor-grid">{visibleTutors.map((t) => <article className="card tutor-card" key={t._id}>
            <div className="tutor-card-header">{t.profilePicture ? <img className="tutor-avatar" src={t.profilePicture} alt={`${t.user?.name || "Tutor"} profile`} /> : <div className="tutor-avatar tutor-avatar-placeholder">{(t.user?.name || "T").charAt(0).toUpperCase()}</div>}
              <div><h3>{t.user?.name || "Tutor"}</h3><p>{t.qualifications?.length ? (Array.isArray(t.qualifications) ? t.qualifications.join(", ") : t.qualifications) : "Peer tutor"}</p></div>
            </div>
            <p>{t.bio || "This tutor has not added a description yet."}</p>
            <div className="tutor-subject-tags">{(t.subjects || []).map((s) => <span key={s._id || s}>{s.name || "Subject"}</span>)}</div>
            <button type="button" onClick={() => openTutor(t)}>View tutor profile</button>
          </article>)}</div>}
      </>}

      {selectedTutor && <>
        <div className="breadcrumb-row"><button type="button" className="text-button" onClick={backToSubjects}>Subjects</button><span>/</span><button type="button" className="text-button" onClick={backToTutors}>{selectedSubject.name} tutors</button><span>/</span><strong>{selectedTutor.user?.name || "Tutor"}</strong></div>
        <article className="card tutor-profile">
          <div className="tutor-profile-header">{selectedTutor.profilePicture ? <img className="tutor-profile-picture" src={selectedTutor.profilePicture} alt={`${selectedTutor.user?.name || "Tutor"} profile`} /> : <div className="tutor-profile-picture tutor-avatar-placeholder">{(selectedTutor.user?.name || "T").charAt(0).toUpperCase()}</div>}
            <div><p className="eyebrow">PEER TUTOR</p><h3>{selectedTutor.user?.name || "Tutor profile"}</h3><p>{selectedTutor.user?.email || ""}</p></div>
          </div>
          <div className="profile-detail-section"><h4>About the tutor</h4><p>{selectedTutor.bio || "No description has been added yet."}</p></div>
          <div className="profile-detail-section"><h4>Qualifications</h4>{qualificationsList(selectedTutor.qualifications).length ? <ul>{qualificationsList(selectedTutor.qualifications).map((q, i) => <li key={`${q}-${i}`}>{q}</li>)}</ul> : <p>Qualifications have not been added yet.</p>}</div>
          <div className="profile-detail-section"><h4>Subjects taught</h4><div className="tutor-subject-tags">{(selectedTutor.subjects || []).map((s) => <span key={s._id || s}>{s.name || "Subject"}</span>)}</div></div>
        </article>
        <section className="availability-section"><p className="eyebrow">BOOK A SESSION</p><h3>Available sessions</h3><p>Sessions are held through Microsoft Teams. Choose a time to send a booking request.</p>
          {loadingProfile ? <p>Loading profile and availability…</p> : slots.length === 0 ? <div className="empty-state"><h4>No available sessions</h4><p>This tutor has no open sessions right now.</p><button type="button" onClick={backToTutors}>Browse other tutors</button></div> :
            <div className="availability-list">{slots.map((slot) => <article className="card availability-card" key={slot._id}><div><strong>{slot.date}</strong><p>{slot.startTime} – {slot.endTime}</p><span className="availability-status">Available</span></div><button type="button" disabled={Boolean(bookingId)} onClick={() => bookSession(slot)}>{bookingId === slot._id ? "Requesting…" : "Book session"}</button></article>)}</div>}
        </section>
      </>}
      <div className="student-bookings"><Bookings /></div>
    </section>
  );
}