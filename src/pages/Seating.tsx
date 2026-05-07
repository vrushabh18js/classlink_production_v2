import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  BookOpen, 
  Plus, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Printer,
  CheckSquare,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { INITIAL_CLASSROOMS, BRANCH_MAP } from "../constants";
import { SEED_STUDENTS } from "../seedData";
import { generateSeating } from "../lib/seatingArrangement";
import { SeatingArrangement, UserProfile } from "../types";
import { cn } from "../lib/utils";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function Seating() {
  const { user } = useAuth();
  const [sessionName, setSessionName] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>(["A", "B", "C", "D", "E", "F", "G"]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(INITIAL_CLASSROOMS.map(r => r.id));
  const [arrangements, setArrangements] = useState<SeatingArrangement[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate complex calculation
    setTimeout(() => {
      // Create pool of students based on divisions
      // In real app, we'd fetch from Firestore
      const pool = SEED_STUDENTS.filter(s => selectedDivisions.includes(s.division || "")) as UserProfile[];
      
      const targetRooms = INITIAL_CLASSROOMS.filter(r => selectedRooms.includes(r.id));
      const result = generateSeating(pool, targetRooms, "session-" + Date.now());
      setArrangements(result);
      setIsGenerating(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = sessionName ? `Exam Seating: ${sessionName}` : "DYPCOEI Exam Seating Arrangement";
    
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Students: ${arrangements.length}`, 14, 35);
    
    const tableData = arrangements.map((a, i) => [
      i + 1,
      a.studentRoll,
      a.studentName,
      a.division,
      a.branch,
      a.roomNumber,
      `Bench ${a.benchNumber} S${a.seatNumber}`
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Sr', 'Roll', 'Name', 'Div', 'Branch', 'Room', 'Seat']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] }, // slate-800
      alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
      margin: { top: 40 },
      didDrawPage: (data) => {
        // Footer
        const str = `Page ${data.pageNumber}`;
        doc.setFontSize(8);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      }
    });

    const fileName = sessionName 
      ? `Seating_${sessionName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      : `Seating_Arrangement_${Date.now()}.pdf`;
      
    doc.save(fileName);
  };

  const handleExportCSV = () => {
    const headers = ["Serial No", "Roll No", "Student Name", "Division", "Branch", "Room Number", "Bench", "Seat"];
    const rows = arrangements.map((a, i) => [
      i + 1,
      a.studentRoll,
      a.studentName,
      a.division,
      a.branch,
      a.roomNumber,
      a.benchNumber,
      a.seatNumber
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    const fileName = sessionName 
      ? `Seating_${sessionName.replace(/\s+/g, '_')}.csv`
      : `Seating_Arrangement_${Date.now()}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">Seating Generator</h1>
          <p className="text-sm text-slate-500 font-medium">Coordinate sequential student distribution by Division and Roll Number.</p>
        </div>
        
        {user?.role === "admin" && (
          <div className="flex gap-3">
             <div className="flex items-stretch gap-1">
               <button 
                onClick={handleExportPDF}
                disabled={arrangements.length === 0}
                className="flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-l shadow-sm text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 border-r-0"
                title="Export as PDF"
               >
                  <Printer className="w-3.5 h-3.5" />
                  PDF
               </button>
               <button 
                onClick={handleExportCSV}
                disabled={arrangements.length === 0}
                className="flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-r shadow-sm text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                title="Export as CSV"
               >
                  <Download className="w-3.5 h-3.5" />
                  CSV
               </button>
             </div>
             <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded shadow-sm text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
             >
                {isGenerating ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Generate New Session
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 card flex flex-col h-fit">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
             <Filter className="w-3.5 h-3.5 text-slate-400" />
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Parameters</h3>
          </div>
          
          <div className="p-6 space-y-6 text-sm">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Session Identifier</label>
              <input 
                type="text" 
                placeholder="SEM II Finals"
                className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                Target Divisions
                <span className="text-[9px] font-normal lowercase text-slate-400">({selectedDivisions.length} selected)</span>
              </label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                {Object.keys(BRANCH_MAP).map(div => (
                  <button
                    key={div}
                    onClick={() => {
                       if (selectedDivisions.includes(div)) {
                         setSelectedDivisions(selectedDivisions.filter(d => d !== div));
                       } else {
                         setSelectedDivisions([...selectedDivisions, div]);
                       }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-[11px] font-bold transition-all border group",
                      selectedDivisions.includes(div)
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                    )}
                  >
                    <span>Division {div}</span>
                    {selectedDivisions.includes(div) ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                Allocated Classrooms
                <span className="text-[9px] font-normal lowercase text-slate-400">({selectedRooms.length} rooms)</span>
              </label>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                {INITIAL_CLASSROOMS.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      if (selectedRooms.includes(room.id)) {
                        setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                      } else {
                        setSelectedRooms([...selectedRooms, room.id]);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-md text-[11px] font-bold transition-all border group",
                      selectedRooms.includes(room.id)
                        ? "bg-slate-800 border-slate-800 text-white"
                        : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600"
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span>{room.roomNumber}</span>
                      <span className={cn(
                        "text-[8px] font-medium uppercase tracking-tighter",
                        selectedRooms.includes(room.id) ? "text-slate-400" : "text-slate-300"
                      )}>{room.building}</span>
                    </div>
                    {selectedRooms.includes(room.id) ? (
                      <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded text-[10px] text-slate-500 leading-normal border border-slate-100 italic">
               <p>Students are assigned seats sequentially according to their Division and Roll Number for maximum regularity.</p>
            </div>
          </div>
        </div>

        {/* Results / Table */}
        <div className="lg:col-span-3 card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <h4 className="font-bold text-slate-800 text-sm">Arrangement Preview</h4>
               <div className="flex gap-3">
                  <span className="text-[10px] flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>Comp</span>
                  <span className="text-[10px] flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>AIDS</span>
                  <span className="text-[10px] flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>AIML</span>
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto min-h-[440px]">
             {arrangements.length > 0 ? (
               <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Identity</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Dept</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Allocation</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {arrangements.map((a, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i % 20) * 0.02 }}
                        key={a.id} 
                        className="hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <div>
                            <p className="font-bold text-slate-800 text-xs uppercase tracking-tight">{a.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-mono italic">#{a.studentRoll} · DIV {a.division}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                           <span className={cn(
                             "status-badge border",
                             a.branch === "Computer Engineering" ? "bg-blue-50 text-blue-800 border-blue-100" :
                             a.branch === "AI & DS" ? "bg-purple-50 text-purple-800 border-purple-100" :
                             "bg-amber-50 text-amber-800 border-amber-100"
                           )}>
                             {a.branch}
                           </span>
                        </td>
                        <td className="px-6 py-3">
                           <div className="flex items-center gap-3">
                              <div className="bg-slate-100 text-slate-700 h-8 w-12 rounded flex items-center justify-center font-bold text-[10px] border border-slate-200">
                                 {a.roomNumber}
                              </div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase">
                                Bench {a.benchNumber} <span className="text-slate-300">|</span> SM-{a.seatNumber}
                              </div>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                 </tbody>
               </table>
             ) : (
               <div className="flex flex-col items-center justify-center h-full p-20 text-center bg-slate-50/30">
                  <BookOpen className="w-10 h-10 text-slate-200 mb-4" />
                  <p className="text-xs text-slate-400 font-medium italic">Pending session generation.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
