import React, { useMemo, useState } from "react";
import "./index.scss";

type ShiftType = "morning" | "evening" | "night" | "meeting";

interface ShiftTemplate {
  id: ShiftType;
  label: string;
  time: string;
}

interface StaffMember {
  id: number;
  name: string;
  title: string;
  weeklyHours: number;
}

interface ShiftCell {
  id: number;
  staffId: number;
  day: string; // Mon, Tue...
  shiftType: ShiftType;
}

interface DayItem {
  id: string; // Mon, Tue...
  label: string; // Mon 24
  isToday?: boolean;
}

// ============ DATA ============

const shiftTemplates: ShiftTemplate[] = [
  { id: "morning", label: "Morning Shift", time: "08:00 – 12:00" },
  { id: "evening", label: "Evening Shift", time: "14:00 – 18:00" },
  { id: "night", label: "Night Shift", time: "20:00 – 06:00" },
  { id: "meeting", label: "Meeting", time: "10:00 – 12:00" },
];

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Tuần gốc (demo): Mon 24 → Sun 30
const BASE_DAY_NUMBER = 24;
// Dùng để build date string cho My Team (Monday 24/11/2025)
const BASE_DATE = new Date(2025, 10, 24); // month = 10 => November

const staff: StaffMember[] = [
  { id: 1, name: "Dr. Michael Roberts", title: "Cardiology", weeklyHours: 32 },
  { id: 2, name: "Dr. Emily Watson", title: "Emergency", weeklyHours: 36 },
  { id: 3, name: "Dr. James Anderson", title: "ICU", weeklyHours: 32 },
  { id: 4, name: "Dr. Lisa Martinez", title: "Pediatrics", weeklyHours: 40 },
  { id: 5, name: "Dr. David Kim", title: "Surgery", weeklyHours: 40 },
  { id: 6, name: "Dr. Rachel Green", title: "Surgery", weeklyHours: 48 },
  { id: 7, name: "Sarah Johnson", title: "Nurse Lead", weeklyHours: 36 },
  { id: 8, name: "Maria Garcia", title: "Nurse", weeklyHours: 32 },
  { id: 9, name: "Tom Wilson", title: "Nurse", weeklyHours: 40 },
  { id: 10, name: "Linda Davis", title: "Administration", weeklyHours: 40 },
];

// lịch mẫu ban đầu (tuần gốc)
const initialShifts: ShiftCell[] = [
  { id: 1, staffId: 1, day: "Mon", shiftType: "morning" },
  { id: 2, staffId: 1, day: "Fri", shiftType: "morning" },
  { id: 3, staffId: 1, day: "Sat", shiftType: "night" },
  { id: 4, staffId: 2, day: "Tue", shiftType: "evening" },
  { id: 5, staffId: 2, day: "Thu", shiftType: "night" },
  { id: 6, staffId: 2, day: "Sun", shiftType: "night" },
  { id: 7, staffId: 3, day: "Wed", shiftType: "night" },
  { id: 8, staffId: 3, day: "Fri", shiftType: "morning" },
  { id: 9, staffId: 4, day: "Thu", shiftType: "morning" },
  { id: 10, staffId: 4, day: "Sat", shiftType: "evening" },
  { id: 11, staffId: 5, day: "Mon", shiftType: "morning" },
  { id: 12, staffId: 5, day: "Wed", shiftType: "evening" },
  { id: 13, staffId: 6, day: "Tue", shiftType: "evening" },
  { id: 14, staffId: 6, day: "Fri", shiftType: "night" },
  { id: 15, staffId: 7, day: "Mon", shiftType: "morning" },
  { id: 16, staffId: 7, day: "Thu", shiftType: "morning" },
  { id: 17, staffId: 8, day: "Tue", shiftType: "morning" },
  { id: 18, staffId: 8, day: "Fri", shiftType: "evening" },
  { id: 19, staffId: 9, day: "Wed", shiftType: "night" },
  { id: 20, staffId: 9, day: "Sun", shiftType: "night" },
  { id: 21, staffId: 10, day: "Sat", shiftType: "meeting" },
];

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

// ============== PHẦN DÙNG CHUNG VỚI "MY TEAM" ==============
// ShiftType bên My Team
type ValidationShiftType = "Morning" | "Evening" | "Night";

// map shift type của planner -> My Team
const mapShiftTypeForMyTeam = (t: ShiftType): ValidationShiftType => {
  if (t === "evening") return "Evening";
  if (t === "night") return "Night";
  // morning + meeting coi như Morning
  return "Morning";
};

const shiftTimeForMyTeam: Record<ValidationShiftType, string> = {
  Morning: "08:00 - 16:00",
  Evening: "14:00 - 22:00",
  Night: "22:00 - 06:00",
};

// Xây date string (YYYY-MM-DD) từ dayId (Mon, Tue...) + tuần offset
const buildDateFromDay = (dayId: string, weekOffset: number): string => {
  const dayIndex = dayNames.indexOf(dayId); // Mon=0, Tue=1...
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + dayIndex + weekOffset * 7);
  // dùng toISOString giống bên My Team để khớp
  return d.toISOString().split("T")[0];
};

// danh sách bác sĩ cho popup (tên bắt đầu bằng "Dr.")
const doctorList = staff.filter((s) => s.name.startsWith("Dr."));

const buildWeekDays = (offset: number): DayItem[] => {
  // offset: -1 tuần trước, 0 tuần hiện tại, +1 tuần sau
  const base = BASE_DAY_NUMBER + offset * 7;
  const today = new Date();
  const todayWeekday = today.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  return dayNames.map((name, index) => {
    const dayNumber = base + index;
    const label = `${name} ${dayNumber}`;
    const isToday = offset === 0 && name.startsWith(todayWeekday);
    return { id: name, label, isToday };
  });
};

// ============ COMPONENT ============

const SchedulePlanningSection: React.FC = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const days = useMemo(() => buildWeekDays(weekOffset), [weekOffset]);

  // đọc lịch từ localStorage, nếu không có thì dùng initialShifts
  const [shifts, setShifts] = useState<ShiftCell[]>(() => {
    try {
      const saved = localStorage.getItem("medstaff_schedule");
      if (saved) {
        const parsed = JSON.parse(saved) as ShiftCell[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Cannot parse saved schedule:", e);
    }
    return initialShifts;
  });

  // drag & drop
  const [draggingShiftType, setDraggingShiftType] =
    useState<ShiftType | null>(null);
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // modal AI
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<number[]>(
    doctorList.map((d) => d.id)
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // modal publish
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // toast publish
  const [showToast, setShowToast] = useState(false);

  // helper: update shifts + lưu localStorage riêng của planner
  const updateShifts = (updater: (prev: ShiftCell[]) => ShiftCell[]) => {
    setShifts((prev) => {
      const next = updater(prev);
      localStorage.setItem("medstaff_schedule", JSON.stringify(next));
      return next;
    });
  };

  const handleOpenAiModal = () => setAiModalOpen(true);

  const handleToggleDoctor = (id: number) => {
    setSelectedDoctorIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedDoctorIds.length === doctorList.length) {
      setSelectedDoctorIds([]);
    } else {
      setSelectedDoctorIds(doctorList.map((d) => d.id));
    }
  };

  // week controls
  const handlePrevWeek = () => setWeekOffset((w) => w - 1);
  const handleNextWeek = () => setWeekOffset((w) => w + 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  // drag từ shift template
  const handleDragStart = (type: ShiftType) => {
    setDraggingShiftType(type);
  };

  const handleDragEnd = () => {
    setDraggingShiftType(null);
    setDragOverCell(null);
  };

  const handleDropToCell = (staffId: number, dayId: string) => {
    if (!draggingShiftType) return;

    setDragOverCell(null);

    updateShifts((prev) => {
      const filtered = prev.filter(
        (s) => !(s.staffId === staffId && s.day === dayId)
      );
      const nextId =
        filtered.reduce((max, s) => (s.id > max ? s.id : max), 0) + 1;

      return [
        ...filtered,
        {
          id: nextId,
          staffId,
          day: dayId,
          shiftType: draggingShiftType,
        },
      ];
    });

    setDraggingShiftType(null);
  };

  const handleRemoveShift = (shiftId: number) => {
    updateShifts((prev) => prev.filter((s) => s.id !== shiftId));
  };

  // GỌI BACKEND DÙNG KEY CHATGPT
  const handleGenerateWithAI = async () => {
    if (selectedDoctorIds.length === 0) {
      alert("Please select at least one doctor.");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedDoctors = staff.filter((s) =>
        selectedDoctorIds.includes(s.id)
      );

      const res = await fetch("http://localhost:5000/api/ai-generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctors: selectedDoctors,
          weekStart: "2025-12-01",
          currentShifts: shifts,
        }),
      });

      const rawText = await res.text();
      console.log("⬅ Raw response from backend:", res.status, rawText);

      if (!res.ok) {
        throw new Error("API error: " + res.status);
      }

      const data = JSON.parse(rawText);

      const scheduleFromAI = (data.schedule || []) as {
        staffId: number;
        day: string;
        shiftType: ShiftType;
      }[];

      updateShifts(() =>
        scheduleFromAI.map((item, idx) => ({
          id: idx + 1,
          staffId: item.staffId,
          day: item.day,
          shiftType: item.shiftType,
        }))
      );

      setAiModalOpen(false);
    } catch (err) {
      console.error("❌ Failed to generate schedule with AI:", err);
      alert("Failed to generate schedule with AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  // publish
  const handleClickPublish = () => {
    setPublishModalOpen(true);
  };

  const handleConfirmPublish = () => {
    // 1. chuyển shifts hiện tại -> format cho My Team (ShiftSchedule)
    const publishedShifts = shifts.flatMap((s, index) => {
      const staffInfo = staff.find((p) => p.id === s.staffId);
      if (!staffInfo) return [];

      const vtShift = mapShiftTypeForMyTeam(s.shiftType);
      return [
        {
          id: `pub-${index + 1}`,
          staffId: String(s.staffId),
          staffName: staffInfo.name,
          staffInitials: getInitials(staffInfo.name),
          department: staffInfo.title, // hoặc field department riêng nếu sau này có
          date: buildDateFromDay(s.day, weekOffset),
          shiftType: vtShift,
          scheduledTime: shiftTimeForMyTeam[vtShift],
          status: "Pending" as const,
        },
      ];
    });

    // 2. lưu cho My Team đọc
    localStorage.setItem(
      "medstaff_validation_schedule",
      JSON.stringify(publishedShifts)
    );

    // lưu luôn số pending cho badge sidebar
    localStorage.setItem(
      "medstaff_pending_shifts",
      String(publishedShifts.length)
    );
    window.dispatchEvent(new Event("medstaff-pending-updated"));

    // 3. đóng modal + hiện toast
    setPublishModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCancelPublish = () => {
    setPublishModalOpen(false);
  };

  return (
    <div className="sp-wrapper">
      {/* CARD: header + shift templates với border + shadow */}
      <div className="sp-header-card">
        <header className="sp-header">
          <div className="sp-header-left">
            <div className="sp-header-title-row">
              <div className="sp-header-icon">📅</div>
              <div>
                <h1 className="sp-title">Schedule Planning</h1>
                <p className="sp-subtitle">
                  Create and manage weekly schedules for all staff.
                </p>
              </div>
            </div>
          </div>
          <div className="sp-header-actions">
            <button
              className="sp-btn sp-btn-ai"
              onClick={handleOpenAiModal}
              type="button"
            >
              <span className="sp-btn-ai-icon">⚙️</span>
              <span>Generate Automatically with AI</span>
            </button>
            <button
              className="sp-btn sp-btn-primary"
              onClick={handleClickPublish}
              type="button"
            >
              ● Publish Schedule
            </button>
          </div>
        </header>

        <section className="sp-template-banner">
          <div className="sp-template-inner">
            <div className="sp-template-header">
              <span className="sp-template-title">Shift Templates:</span>
            </div>
            <div className="sp-template-list">
              {shiftTemplates.map((shift) => (
                <div
                  key={shift.id}
                  className={`sp-template-pill sp-template-pill--${shift.id}`}
                  draggable
                  onDragStart={() => handleDragStart(shift.id)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="sp-pill-plus">＋</span>
                  <div className="sp-pill-text">
                    <span className="sp-pill-label">{shift.label}</span>
                    <span className="sp-pill-time">{shift.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* KHU VỰC SCROLL: WEEK CONTROLS + GRID */}
      <div className="sp-scroll-area">
        <section className="sp-week-wrapper">
          <div className="sp-week-controls">
            <button
              className="sp-week-btn sp-week-btn--ghost"
              onClick={handlePrevWeek}
            >
              ‹ Previous Week
            </button>
            <button
              className={
                "sp-week-btn sp-week-btn--current" +
                (weekOffset === 0 ? " sp-week-btn--current-active" : "")
              }
              onClick={handleCurrentWeek}
            >
              Current Week
            </button>
            <button
              className="sp-week-btn sp-week-btn--ghost"
              onClick={handleNextWeek}
            >
              Next Week ›
            </button>
          </div>
        </section>

        <section className="sp-grid-card">
          <div className="sp-grid">
            <div className="sp-grid-header-row">
              <div className="sp-grid-header-cell sp-grid-header-cell--staff">
                Staff ({staff.length})
              </div>
              {days.map((day) => (
                <div
                  key={day.id}
                  className="sp-grid-header-cell sp-grid-header-cell--day"
                >
                  <span>{day.label}</span>
                  {day.isToday && (
                    <span className="sp-today-badge">Today</span>
                  )}
                </div>
              ))}
            </div>

            {staff.map((person) => (
              <div key={person.id} className="sp-grid-row">
                <div className="sp-grid-staff-cell">
                  <div className="sp-staff-avatar">
                    {getInitials(person.name)}
                  </div>
                  <div className="sp-staff-meta">
                    <div className="sp-staff-name">{person.name}</div>
                    <div className="sp-staff-sub">
                      {person.title} · {person.weeklyHours}h / 48h
                    </div>
                  </div>
                </div>

                {days.map((day) => {
                  const cellKey = `${person.id}-${day.id}`;
                  const cellShifts = shifts.filter(
                    (s) => s.staffId === person.id && s.day === day.id
                  );
                  return (
                    <div
                      key={day.id}
                      className={
                        "sp-grid-day-cell" +
                        (dragOverCell === cellKey
                          ? " sp-grid-day-cell--drop-target"
                          : "")
                      }
                      onDragOver={(e) => {
                        if (draggingShiftType) e.preventDefault();
                      }}
                      onDragEnter={() => {
                        if (draggingShiftType) setDragOverCell(cellKey);
                      }}
                      onDragLeave={() => {
                        setDragOverCell((prev) =>
                          prev === cellKey ? null : prev
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropToCell(person.id, day.id);
                      }}
                    >
                      {cellShifts.map((shift) => {
                        const template = shiftTemplates.find(
                          (t) => t.id === shift.shiftType
                        );
                        return (
                          <div
                            key={shift.id}
                            className={`sp-shift-card sp-shift-card--${shift.shiftType}`}
                          >
                            <div className="sp-shift-header">
                              <div className="sp-shift-title">
                                {template?.label || "Shift"}
                              </div>
                              <button
                                type="button"
                                className="sp-shift-remove"
                                onClick={() => handleRemoveShift(shift.id)}
                              >
                                ×
                              </button>
                            </div>
                            <div className="sp-shift-time">
                              {template?.time || ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL CHỌN BÁC SĨ (AI) */}
      {aiModalOpen && (
        <div className="ai-modal-overlay">
          <div className="ai-modal">
            <div className="ai-modal-header">
              <div className="ai-header-top">
                <div className="ai-header-icon">✨</div>
                <div className="ai-header-text">
                  <h2>Select Doctors for AI Generation</h2>
                  <p>
                    Choose which doctors should have their schedules
                    automatically generated. Unselected doctors will keep their
                    existing schedules unchanged.
                  </p>
                </div>
              </div>
            </div>

            <div className="ai-modal-body">
              <div className="ai-select-all-row">
                <label className="ai-select-all-left">
                  <span className="ai-checkbox-wrapper">
                    <input
                      type="checkbox"
                      checked={selectedDoctorIds.length === doctorList.length}
                      onChange={handleToggleSelectAll}
                    />
                  </span>
                  <span className="ai-select-all-text">
                    Select All Doctors ({doctorList.length})
                  </span>
                </label>
                <span className="ai-selected-pill">
                  {selectedDoctorIds.length} selected
                </span>
              </div>

              <div className="ai-section-label">Individual Doctors</div>

              <div className="ai-doctor-list">
                {doctorList.map((doc) => (
                  <label key={doc.id} className="ai-doctor-row">
                    <span className="ai-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={selectedDoctorIds.includes(doc.id)}
                        onChange={() => handleToggleDoctor(doc.id)}
                      />
                    </span>

                    <div className="ai-doctor-avatar">
                      {getInitials(doc.name)}
                    </div>

                    <div className="ai-doctor-info">
                      <div className="ai-doctor-name">{doc.name}</div>
                      <div className="ai-doctor-title">{doc.title}</div>
                    </div>

                    <div className="ai-refresh-icon">⟳</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="ai-modal-footer">
              <button
                className="ai-btn ai-btn-secondary"
                onClick={() => setAiModalOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                className="ai-btn ai-btn-primary"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
              >
                {isGenerating
                  ? "Generating..."
                  : `Generate for ${selectedDoctorIds.length} doctors`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PUBLISH SCHEDULE */}
      {publishModalOpen && (
        <div className="publish-modal-overlay">
          <div className="publish-modal">
            <div className="publish-modal-title">
              Publish schedule changes?
            </div>
            <div className="publish-modal-text">
              Publishing this schedule will send a notification to every
              employee whose shift has been changed. Do you want to continue?
            </div>
            <div className="publish-modal-footer">
              <button
                className="publish-btn publish-btn-secondary"
                onClick={handleCancelPublish}
              >
                Cancel
              </button>
              <button
                className="publish-btn publish-btn-primary"
                onClick={handleConfirmPublish}
              >
                Publish schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST ĐƠN GIẢN */}
      {showToast && (
        <div className="sp-toast">
          <div className="sp-toast-content">✅ Schedule published</div>
        </div>
      )}
    </div>
  );
};

export default SchedulePlanningSection;
