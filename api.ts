import { Router } from "express";
import { supabase } from "./db.js";

const router = Router();

// Auth Routes
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  // This is a simple mockup matching the frontend logic for now.
  // Real implementation should query `users` table with password checking.
  
  if (username.toLowerCase() === "admin" && (password === "admin123" || password === "123")) {
    return res.json({
      uid: "admin-uid",
      email: "admin@dypcoei.edu.in",
      displayName: "System Administrator",
      role: "admin",
    });
  }

  // Check Supabase Users table
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("roll_number", username)
    .single();

  if (user && password === username) { // Simple password check mockup
    return res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      division: user.division,
      rollNumber: user.roll_number,
      branch: user.branch,
      batch: user.batch
    });
  }

  // Check Faculty
  const { data: facultyUser, error: facultyError } = await supabase
    .from("users")
    .select("*")
    .eq("faculty_abbreviation", username.toUpperCase())
    .single();

  if (facultyUser) {
    return res.json({
      uid: facultyUser.uid,
      email: facultyUser.email,
      displayName: facultyUser.display_name,
      role: facultyUser.role,
      facultyAbbreviation: facultyUser.faculty_abbreviation
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

// Governance Routes

// GET all governance data
router.get("/governance", async (req, res) => {
  try {
    const [faculty, students, subjects, notifications, bookings] = await Promise.all([
      supabase.from("faculty").select("*"),
      supabase.from("students").select("*"),
      supabase.from("subjects").select("*"),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*")
    ]);

    res.json({
      faculty: faculty.data || [],
      students: students.data || [],
      subjects: subjects.data?.map(s => s.name) || [],
      notifications: notifications.data || [],
      bookings: bookings.data || []
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch governance data" });
  }
});

// Faculty
router.post("/governance/faculty", async (req, res) => {
  const { data, error } = await supabase.from("faculty").insert([req.body]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.put("/governance/faculty/:abbr", async (req, res) => {
  const { data, error } = await supabase.from("faculty").update(req.body).eq("abbr", req.params.abbr).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.delete("/governance/faculty/:abbr", async (req, res) => {
  const { error } = await supabase.from("faculty").delete().eq("abbr", req.params.abbr);
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

// Students
router.post("/governance/students", async (req, res) => {
  const { data, error } = await supabase.from("students").insert([{
    roll_number: req.body.rollNumber,
    name: req.body.displayName || req.body.name,
    division: req.body.division,
    batch: req.body.batch,
    branch: req.body.branch
  }]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.put("/governance/students/:rollNumber", async (req, res) => {
  const { data, error } = await supabase.from("students").update({
    name: req.body.displayName || req.body.name,
    division: req.body.division,
    batch: req.body.batch,
    branch: req.body.branch
  }).eq("roll_number", req.params.rollNumber).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.delete("/governance/students/:rollNumber", async (req, res) => {
  const { error } = await supabase.from("students").delete().eq("roll_number", req.params.rollNumber);
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

// Subjects
router.post("/governance/subjects", async (req, res) => {
  const { data, error } = await supabase.from("subjects").insert([{ name: req.body.name }]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.put("/governance/subjects/:name", async (req, res) => {
  const { data, error } = await supabase.from("subjects").update({ name: req.body.newName }).eq("name", req.params.name).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.delete("/governance/subjects/:name", async (req, res) => {
  const { error } = await supabase.from("subjects").delete().eq("name", req.params.name);
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

// Notifications
router.post("/governance/notifications", async (req, res) => {
  const { data, error } = await supabase.from("notifications").insert([req.body]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.delete("/governance/notifications/:id", async (req, res) => {
  const { error } = await supabase.from("notifications").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

// Bookings
router.post("/governance/bookings", async (req, res) => {
  const { data, error } = await supabase.from("bookings").insert([req.body]).select();
  if (error) return res.status(400).json({ error });
  res.json(data[0]);
});

router.delete("/governance/bookings/:id", async (req, res) => {
  const { error } = await supabase.from("bookings").delete().eq("id", req.params.id);
  if (error) return res.status(400).json({ error });
  res.json({ success: true });
});

export default router;
