import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../types";

interface Faculty {
  abbr: string;
  name: string;
}

interface Notification {
  id: string;
  from: string;
  type: string;
  time: string;
  msg: string;
  priority: boolean;
  targetType: "division" | "batch" | "individual" | "branch" | "all";
  targetId: string;
  createdAt: number;
}

interface Booking {
  id: string;
  roomId: string;
  roomNumber: string;
  facultyName: string;
  facultyAbbr: string;
  subject: string;
  timeSlot: string;
  date: string;
  targetType: "division" | "batch" | "all";
  targetId: string;
  type: string;
}

interface GovernanceContextType {
  faculty: Faculty[];
  students: Partial<UserProfile>[];
  subjects: string[];
  notifications: Notification[];
  bookings: Booking[];
  addFaculty: (f: Faculty) => void;
  updateFaculty: (oldAbbr: string, f: Faculty) => void;
  deleteFaculty: (abbr: string) => void;
  addStudent: (s: Partial<UserProfile>) => void;
  updateStudent: (rollNumber: string, s: Partial<UserProfile>) => void;
  deleteStudent: (rollNumber: string) => void;
  addSubject: (s: string) => void;
  updateSubject: (oldS: string, newS: string) => void;
  deleteSubject: (s: string) => void;
  addNotification: (n: Omit<Notification, "id" | "time" | "createdAt">) => void;
  deleteNotification: (id: string) => void;
  addBooking: (b: Omit<Booking, "id">) => void;
  deleteBooking: (id: string) => void;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

const API_URL = "http://localhost:3000/api";

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Partial<UserProfile>[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Fetch initial data from backend API
    fetch(`${API_URL}/governance`)
      .then(res => res.json())
      .then(data => {
        if (data.faculty) setFaculty(data.faculty);
        if (data.students) setStudents(data.students);
        if (data.subjects) setSubjects(data.subjects);
        if (data.notifications) setNotifications(data.notifications);
        if (data.bookings) setBookings(data.bookings);
      })
      .catch(err => console.error("Failed to fetch governance data:", err));
  }, []);

  const addFaculty = async (f: Faculty) => {
    try {
      const res = await fetch(`${API_URL}/governance/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f)
      });
      if (res.ok) {
        const newF = await res.json();
        setFaculty(prev => [...prev, newF]);
      }
    } catch (e) { console.error(e); }
  };

  const updateFaculty = async (oldAbbr: string, f: Faculty) => {
    try {
      const res = await fetch(`${API_URL}/governance/faculty/${oldAbbr}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f)
      });
      if (res.ok) {
        const updated = await res.json();
        setFaculty(prev => prev.map(item => item.abbr === oldAbbr ? updated : item));
      }
    } catch (e) { console.error(e); }
  };

  const deleteFaculty = async (abbr: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/faculty/${abbr}`, { method: "DELETE" });
      if (res.ok) {
        setFaculty(prev => prev.filter(item => item.abbr !== abbr));
      }
    } catch (e) { console.error(e); }
  };

  const addStudent = async (s: Partial<UserProfile>) => {
    try {
      const res = await fetch(`${API_URL}/governance/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s)
      });
      if (res.ok) {
        const newS = await res.json();
        setStudents(prev => [...prev, newS]);
      }
    } catch (e) { console.error(e); }
  };

  const updateStudent = async (rollNumber: string, s: Partial<UserProfile>) => {
    try {
      const res = await fetch(`${API_URL}/governance/students/${rollNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s)
      });
      if (res.ok) {
        const updated = await res.json();
        setStudents(prev => prev.map(item => item.rollNumber === rollNumber ? updated : item));
      }
    } catch (e) { console.error(e); }
  };

  const deleteStudent = async (rollNumber: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/students/${rollNumber}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(prev => prev.filter(item => item.rollNumber !== rollNumber));
      }
    } catch (e) { console.error(e); }
  };

  const addSubject = async (s: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: s })
      });
      if (res.ok) {
        setSubjects(prev => [...prev, s]);
      }
    } catch (e) { console.error(e); }
  };

  const updateSubject = async (oldS: string, newS: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/subjects/${oldS}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName: newS })
      });
      if (res.ok) {
        setSubjects(prev => prev.map(item => item === oldS ? newS : item));
      }
    } catch (e) { console.error(e); }
  };

  const deleteSubject = async (s: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/subjects/${s}`, { method: "DELETE" });
      if (res.ok) {
        setSubjects(prev => prev.filter(item => item !== s));
      }
    } catch (e) { console.error(e); }
  };

  const addNotification = async (n: Omit<Notification, "id" | "time" | "createdAt">) => {
    try {
      const now = new Date();
      const newNotif = {
        ...n,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: now.getTime()
      };
      const res = await fetch(`${API_URL}/governance/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotif)
      });
      if (res.ok) {
        const savedNotif = await res.json();
        setNotifications(prev => [savedNotif, ...prev]);
      }
    } catch (e) { console.error(e); }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) { console.error(e); }
  };

  const addBooking = async (b: Omit<Booking, "id">) => {
    try {
      const res = await fetch(`${API_URL}/governance/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b)
      });
      if (res.ok) {
        const savedBooking = await res.json();
        setBookings(prev => [...prev, savedBooking]);
      }
    } catch (e) { console.error(e); }
  };

  const deleteBooking = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/governance/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <GovernanceContext.Provider value={{
      faculty,
      students,
      subjects,
      notifications,
      bookings,
      addFaculty,
      updateFaculty,
      deleteFaculty,
      addStudent,
      updateStudent,
      deleteStudent,
      addSubject,
      updateSubject,
      deleteSubject,
      addNotification,
      deleteNotification,
      addBooking,
      deleteBooking
    }}>
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error("useGovernance must be used within a GovernanceProvider");
  }
  return context;
}
