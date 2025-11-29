// src/pages/HomeView.tsx (unchanged)
import React, { useEffect, useState } from "react";
import "./index.scss";

type ShiftType = "Morning" | "Evening" | "Night";
type StaffState = "Active" | "Late" | "NotClocked";

type Staff = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  shift: ShiftType;
  shiftTime: string;
  status: StaffState;
  statusNote?: string;
};

type ShiftSchedule = {
  id: string;
  staffId: string;
  staffName: string;
  staffInitials: string;
  department: string;
  date: string; // 2025-11-24
  shiftType: ShiftType; // Morning | Evening | Night
  scheduledTime: string; // 14:00 - 22:00
  actualTime?: string;
  status: "Pending" | "Validated" | "Completed";
  patientsTreated?: number;
  hoursWorked?: string;
  notes?: string;
};

const workingStaff: Staff[] = [
  {
    id: "1",
    name: "Dr. Michael Roberts",
    initials: "MR",
    role: "Cardiologist",
    department: "Cardiology",
    shift: "Morning",
    shiftTime: "08:00 - 16:00",
    status: "Active",
    statusNote: "Started 7h 0m ago",
  },
  {
    id: "2",
    name: "Dr. James Anderson",
    initials: "JA",
    role: "ICU Specialist",
    department: "ICU",
    shift: "Morning",
    shiftTime: "08:00 - 16:00",
    status: "Active",
    statusNote: "Started 7h 0m ago",
  },
  {
    id: "3",
    name: "Dr. Sarah Johnson",
    initials: "SJ",
    role: "Emergency Nurse",
    department: "Emergency",
    shift: "Morning",
    shiftTime: "08:00 - 16:00",
    status: "Active",
    statusNote: "Started 7h 0m ago",
  },
  {
    id: "4",
    name: "Dr. Emily Watson",
    initials: "EW",
    role: "Emergency Physician",
    department: "Emergency",
    shift: "Morning",
    shiftTime: "08:00 - 16:00",
    status: "Active",
    statusNote: "Started 7h 0m ago",
  },
  {
    id: "5",
    name: "Dr. Lisa Martinez",
    initials: "LM",
    role: "Pediatrician",
    department: "Pediatrics",
    shift: "Morning",
    shiftTime: "08:00 - 16:00",
    status: "Late",
    statusNote: "Clocked in at 08:20",
  },
];

// dữ liệu mẫu ban đầu cho lịch (dùng để khởi tạo state khi chưa publish)
const initialScheduleData: ShiftSchedule[] = [
  {
    id: "s1",
    staffId: "4",
    staffName: "Dr. Emily Watson",
    staffInitials: "EW",
    department: "Emergency",
    date: "2025-11-23",
    shiftType: "Evening",
    scheduledTime: "14:00 - 22:00",
    actualTime: "16:00 - 00:00",
    status: "Pending",
    patientsTreated: 13,
    hoursWorked: "8h 0m",
    notes: "Shift report pending completion by employee.",
  },
  {
    id: "s2",
    staffId: "4",
    staffName: "Dr. Emily Watson",
    staffInitials: "EW",
    department: "Emergency",
    date: "2025-11-24",
    shiftType: "Night",
    scheduledTime: "22:00 - 06:00",
    status: "Validated",
  },
  {
    id: "s3",
    staffId: "4",
    staffName: "Dr. Emily Watson",
    staffInitials: "EW",
    department: "Emergency",
    date: "2025-11-27",
    shiftType: "Morning",
    scheduledTime: "08:00 - 16:00",
    status: "Validated",
  },
  {
    id: "s4",
    staffId: "4",
    staffName: "Dr. Emily Watson",
    staffInitials: "EW",
    department: "Emergency",
    date: "2025-11-30",
    shiftType: "Evening",
    scheduledTime: "14:00 - 22:00",
    status: "Validated",
  },
  {
    id: "s5",
    staffId: "4",
    staffName: "Dr. Emily Watson",
    staffInitials: "EW",
    department: "Emergency",
    date: "2025-12-01",
    shiftType: "Night",
    scheduledTime: "22:00 - 06:00",
    status: "Validated",
  },
  {
    id: "s6",
    staffId: "2",
    staffName: "Dr. James Anderson",
    staffInitials: "JA",
    department: "ICU",
    date: "2025-11-24",
    shiftType: "Night",
    scheduledTime: "22:00 - 06:00",
    status: "Validated",
  },
  {
    id: "s7",
    staffId: "2",
    staffName: "Dr. James Anderson",
    staffInitials: "JA",
    department: "ICU",
    date: "2025-11-26",
    shiftType: "Morning",
    scheduledTime: "08:00 - 16:00",
    status: "Validated",
  },
  {
    id: "s8",
    staffId: "2",
    staffName: "Dr. James Anderson",
    staffInitials: "JA",
    department: "ICU",
    date: "2025-11-28",
    shiftType: "Evening",
    scheduledTime: "14:00 - 22:00",
    status: "Validated",
  },
  {
    id: "s9",
    staffId: "2",
    staffName: "Dr. James Anderson",
    staffInitials: "JA",
    department: "ICU",
    date: "2025-12-01",
    shiftType: "Morning",
    scheduledTime: "08:00 - 16:00",
    status: "Validated",
  },
];

const TOTAL_STAFF = 6;
const ACTIVE_STAFF = 4;
const NOT_STARTED = 2;

type TabKey = "status" | "schedule" | "performance";

const HomeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("status");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [onlyLate, setOnlyLate] = useState(false);
  const [onlyNotClocked, setOnlyNotClocked] = useState(false);

  // lịch trong tuần:
  // - ưu tiên đọc từ localStorage (medstaff_validation_schedule) => schedule đã publish
  // - nếu chưa có publish thì dùng demo initialScheduleData
  const [schedule, setSchedule] = useState<ShiftSchedule[]>(() => {
    try {
      const saved = localStorage.getItem("medstaff_validation_schedule");
      if (saved) {
        const parsed = JSON.parse(saved) as ShiftSchedule[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Cannot parse medstaff_validation_schedule:", e);
    }
    return initialScheduleData;
  });

  const [selectedShift, setSelectedShift] = useState<ShiftSchedule | null>(
    null
  );
  const [currentWeekStart, setCurrentWeekStart] = useState(
    new Date(2025, 10, 24)
  );

  // toast
  const [toast, setToast] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);

  // lưu số lượng pending + báo cho MainLayout cập nhật badge
  useEffect(() => {
    const pendingCount = schedule.filter((s) => s.status === "Pending").length;

    // lưu vào localStorage
    localStorage.setItem("medstaff_pending_shifts", String(pendingCount));

    // bắn event để sidebar đọc lại
    window.dispatchEvent(new Event("medstaff-pending-updated"));
  }, [schedule]);

  // lưu lại toàn bộ schedule (kể cả khi bạn validate) để F5 vẫn giữ trạng thái
  useEffect(() => {
    localStorage.setItem(
      "medstaff_validation_schedule",
      JSON.stringify(schedule)
    );
  }, [schedule]);

  const visibleWorkingStaff = workingStaff.filter((s) => {
    if (onlyLate) return s.status === "Late";
    return true;
  });

  const handleFilterClick = () => {
    setFiltersOpen(true);
  };

  const handleSummaryClick = (type: "total" | "active" | "notStarted") => {
    setActiveTab("status");
    if (type === "active") {
      setOnlyLate(false);
      setOnlyNotClocked(false);
    } else if (type === "notStarted") {
      setOnlyNotClocked(true);
      setOnlyLate(false);
    } else {
      setOnlyLate(false);
      setOnlyNotClocked(false);
    }
  };

  const getDatesForWeek = () => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getShiftsForStaffAndDate = (staffId: string, date: Date) => {
    const dateStr = formatDate(date);
    return schedule.filter(
      (s) => s.staffId === staffId && s.date === dateStr
    );
  };

  // validate: đổi status -> Validated, đóng modal, show toast
  const handleValidateShift = () => {
    if (!selectedShift) return;

    const shift = selectedShift; // giữ lại cho toast
    setSchedule((prev) =>
      prev.map((s) =>
        s.id === shift.id ? { ...s, status: "Validated" } : s
      )
    );
    setSelectedShift(null);

    setToast({
      title: `Shift validated for ${shift.staffName}`,
      subtitle: `${shift.shiftType} shift on ${shift.date}`,
    });

    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="myteam-main-only">
      {/* ===== HEADER ===== */}
      <header className="myteam-header">
        <div className="header-top">
          <div>
            <h1 className="header-title">My Team</h1>
            <p className="header-subtitle">
              Monitor team activity and schedules in real-time
            </p>
          </div>

          <button className="filter-button" onClick={handleFilterClick}>
            <span>⚙️</span>
            <span>Filters</span>
          </button>
        </div>

        <div className="summary-cards">
          <button
            className="summary-card summary-card--button"
            onClick={() => handleSummaryClick("total")}
          >
            <div className="summary-icon summary-icon--muted">👤</div>
            <div>
              <div className="summary-label">Total Staff</div>
              <div className="summary-value">{TOTAL_STAFF}</div>
            </div>
          </button>

          <button
            className="summary-card summary-card--green summary-card--button"
            onClick={() => handleSummaryClick("active")}
          >
            <div className="summary-icon summary-icon--white">💓</div>
            <div>
              <div className="summary-label summary-label--green">
                Active
              </div>
              <div className="summary-value summary-value--green">
                {ACTIVE_STAFF}
              </div>
            </div>
          </button>

          <button
            className="summary-card summary-card--button"
            onClick={() => handleSummaryClick("notStarted")}
          >
            <div className="summary-icon summary-icon--muted">⏲</div>
            <div>
              <div className="summary-label">Not Started</div>
              <div className="summary-value">{NOT_STARTED}</div>
            </div>
          </button>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="myteam-content">
        {/* Tabs */}
        <div className="shift-tabs">
          <button
            className={
              "shift-tab" +
              (activeTab === "status" ? " shift-tab--active" : "")
            }
            onClick={() => setActiveTab("status")}
          >
            Active Shift Status
          </button>
          <button
            className={
              "shift-tab" +
              (activeTab === "schedule" ? " shift-tab--active" : "")
            }
            onClick={() => setActiveTab("schedule")}
          >
            Team Schedule Overview
          </button>
          <button
            className={
              "shift-tab" +
              (activeTab === "performance" ? " shift-tab--active" : "")
            }
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
        </div>

        {/* TAB: Currently Working */}
        {activeTab === "status" && (
          <section className="section section-working">
            <div className="section-header section-header--green">
              <div className="section-title-wrapper">
                <div className="section-dot section-dot--green">✓</div>
                <div className="section-title">
                  Currently Working ({visibleWorkingStaff.length})
                </div>
              </div>
            </div>

            <div className="section-body section-body--grid">
              {visibleWorkingStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </div>
          </section>
        )}

        {/* TAB: Team Schedule Overview */}
        {activeTab === "schedule" && (
          <section className="section">
            <div className="section-header section-header--grey">
              <div className="section-title-wrapper">
                <span className="section-icon">📅</span>
                <div className="section-title">Team Schedule Overview</div>
              </div>
              <div className="schedule-controls">
                <button className="view-toggle">Day</button>
                <button className="nav-button" onClick={goToPreviousWeek}>
                  ‹
                </button>
                <button className="nav-button" onClick={goToNextWeek}>
                  ›
                </button>
              </div>
            </div>

            <div className="section-body section-body--schedule">
              <div className="schedule-calendar">
                {/* header hàng ngày */}
                <div className="schedule-header">
                  <div className="staff-column-header">
                    <div className="staff-count">Staff (5)</div>
                  </div>
                  {getDatesForWeek().map((date, idx) => {
                    const isToday = formatDate(date) === "2025-11-30";
                    return (
                      <div
                        key={idx}
                        className={
                          "date-column-header" +
                          (isToday ? " date-column-header--today" : "")
                        }
                      >
                        <div className="date-day">
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="date-number">{date.getDate()}</div>
                        {isToday && <div className="today-badge">Today</div>}
                        <div className="date-stats">
                          {/* demo cứng 0/4 */}
                          <span className="date-stat">🟠 0/4</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* hàng nhân viên */}
                {workingStaff.map((staff) => (
                  <div key={staff.id} className="schedule-row">
                    <div className="staff-cell">
                      <div className="staff-avatar-small">
                        {staff.initials}
                      </div>
                      <div className="staff-name-dept">
                        <div className="staff-name-small">{staff.name}</div>
                        <div className="staff-dept-small">
                          {staff.department}
                        </div>
                      </div>
                    </div>

                    {getDatesForWeek().map((date, idx) => {
                      const shifts = getShiftsForStaffAndDate(
                        staff.id,
                        date
                      );
                      return (
                        <div key={idx} className="shift-cell">
                          {shifts.length > 0 ? (
                            shifts.map((shift) => (
                              <button
                                key={shift.id}
                                className={
                                  "shift-block " +
                                  `shift-block--${shift.shiftType.toLowerCase()} ` +
                                  (shift.status === "Pending"
                                    ? "shift-block--pending"
                                    : "shift-block--validated")
                                }
                                onClick={() => setSelectedShift(shift)}
                              >
                                <div className="shift-type">
                                  {shift.shiftType}
                                </div>
                                <div className="shift-hours">
                                  {shift.scheduledTime.split(" - ")[0]}
                                </div>

                                {shift.status === "Pending" && (
                                  <div className="shift-indicator" />
                                )}

                                {shift.status === "Validated" && (
                                  <div className="shift-indicator shift-indicator--validated">
                                    ✓
                                  </div>
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="shift-off">Off</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* TAB: Performance (demo) */}
        {activeTab === "performance" && (
          <section className="section">
            <div className="section-header section-header--grey">
              <div className="section-title-wrapper">
                <div className="section-title">Performance</div>
              </div>
            </div>
            <div className="section-body">
              <p>
                Đây là nội dung demo cho tab <strong>Performance</strong>.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* ===== FILTER PANEL ===== */}
      {filtersOpen && (
        <div
          className="filters-overlay"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="filters-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filters-header">
              <h3>Filters</h3>
              <button
                className="detail-close-btn"
                onClick={() => setFiltersOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="filters-body">
              <label className="filters-row">
                <input
                  type="checkbox"
                  checked={onlyLate}
                  onChange={(e) => setOnlyLate(e.target.checked)}
                />
                <span>Chỉ hiển thị staff bị Late (Currently Working)</span>
              </label>
              <label className="filters-row">
                <input
                  type="checkbox"
                  checked={onlyNotClocked}
                  onChange={(e) => setOnlyNotClocked(e.target.checked)}
                />
                <span>Chỉ quan tâm phần Not Clocked In</span>
              </label>
            </div>
            <div className="filters-footer">
              <button
                className="filter-button filter-button--small"
                onClick={() => {
                  setOnlyLate(false);
                  setOnlyNotClocked(false);
                }}
              >
                Clear
              </button>
              <button
                className="filter-button filter-button--primary filter-button--small"
                onClick={() => setFiltersOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SHIFT DETAIL MODAL ===== */}
      {selectedShift && (
        <div
          className="filters-overlay"
          onClick={() => setSelectedShift(null)}
        >
          <div
            className="shift-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="detail-close-btn detail-close-btn--absolute"
              onClick={() => setSelectedShift(null)}
            >
              ✕
            </button>

            <div className="shift-detail-header">
              <div className="shift-detail-staff">
                <div className="staff-avatar-large">
                  {selectedShift.staffInitials}
                </div>
                <div>
                  <div className="shift-detail-name">
                    {selectedShift.staffName}
                  </div>
                  <div className="shift-detail-dept">
                    {selectedShift.department}
                    <span className="shift-badge shift-badge--small">
                      {selectedShift.shiftType} Shift
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shift-detail-body">
              <div className="shift-detail-date">
                <span className="detail-icon">📅</span>
                {new Date(selectedShift.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                {selectedShift.status === "Pending" && (
                  <span className="status-badge status-badge--pending">
                    ⏳ Pending Validation
                  </span>
                )}
              </div>

              {selectedShift.patientsTreated !== undefined && (
                <div className="shift-stats">
                  <div className="stat-card stat-card--green">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <div className="stat-label">Patients Treated</div>
                      <div className="stat-value">
                        {selectedShift.patientsTreated}
                      </div>
                    </div>
                  </div>
                  <div className="stat-card stat-card--blue">
                    <div className="stat-icon">🕐</div>
                    <div className="stat-content">
                      <div className="stat-label">Hours Worked</div>
                      <div className="stat-value">
                        {selectedShift.hoursWorked}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="shift-detail-section">
                <div className="detail-section-title">
                  <span className="detail-icon">🕐</span>
                  Time Details
                </div>
                <div className="time-detail-row">
                  <span className="time-label">Scheduled Time</span>
                  <span className="time-value">
                    {selectedShift.scheduledTime}
                  </span>
                </div>
                {selectedShift.actualTime && (
                  <div className="time-detail-row">
                    <span className="time-label">Actual Time</span>
                    <span className="time-value">
                      {selectedShift.actualTime}
                    </span>
                  </div>
                )}
              </div>

              {selectedShift.notes && (
                <div className="shift-detail-section">
                  <div className="detail-section-title">
                    <span className="detail-icon">📝</span>
                    Doctor&apos;s Notes
                  </div>
                  <div className="notes-content">
                    {selectedShift.notes}
                  </div>
                </div>
              )}

              {selectedShift.status === "Pending" && (
                <button
                  className="validate-button"
                  onClick={handleValidateShift}
                >
                  <span>✓</span>
                  Validate Shift Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== TOAST ===== */}
      {toast && (
        <div className="myteam-toast">
          <div className="myteam-toast-icon">✓</div>
          <div className="myteam-toast-text">
            <div className="myteam-toast-title">{toast.title}</div>
            <div className="myteam-toast-subtitle">
              {toast.subtitle}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Card & status */
type StaffCardProps = {
  staff: Staff;
  onClick?: () => void;
};

const StaffCard: React.FC<StaffCardProps> = ({ staff, onClick }) => {
  return (
    <div className="staff-card" onClick={onClick}>
      <div className="staff-card-left">
        <div className="staff-avatar">{staff.initials}</div>
        <div className="staff-info">
          <div className="staff-name-row">
            <div className="staff-name">{staff.name}</div>
          </div>
          <div className="staff-role">
            {staff.role} • {staff.department}
          </div>

          <div className="staff-meta">
            <span className="shift-badge">{staff.shift}</span>
            <span className="shift-time">
              <span className="clock-icon">🕒</span> {staff.shiftTime}
            </span>
          </div>

          {staff.statusNote && (
            <div
              className={
                staff.status === "Late"
                  ? "staff-status-note staff-status-note--danger"
                  : "staff-status-note"
              }
            >
              {staff.statusNote}
            </div>
          )}
        </div>
      </div>

      <div className="staff-card-right">
        <StatusPill state={staff.status} />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ state: StaffState }> = ({ state }) => {
  if (state === "Active") {
    return <div className="status-pill status-pill--active">Active</div>;
  }
  if (state === "Late") {
    return <div className="status-pill status-pill--late">Late</div>;
  }
  return <div className="status-pill status-pill--muted">Not Clocked In</div>;
};

export default HomeView;
