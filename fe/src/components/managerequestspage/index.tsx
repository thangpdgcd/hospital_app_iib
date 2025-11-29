import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";

type RequestStatus = "Pending" | "Approved" | "Declined";
type RequestKind = "shiftChange" | "additionalShift" | "dayOff";

type BaseRequest = {
  id: string;
  doctorId: number;
  doctorName: string;
  doctorTitle: string;
  department: string;
  kind: RequestKind;
  status: RequestStatus;
  createdAt: string; // 2025-11-20
};

type ShiftInfo = {
  dayLabel: string; // Monday
  shiftLabel: string; // Morning Shift
  time: string; // 08:00 - 16:00
};

type ShiftChangeRequest = BaseRequest & {
  kind: "shiftChange";
  currentShift: ShiftInfo;
  requestedShift: ShiftInfo;
  reason: string;
};

type AdditionalShiftRequest = BaseRequest & {
  kind: "additionalShift";
  requestedShift: {
    dateLabel: string; // Friday, 28/11/2025
    time: string; // 22:00 - 06:00
    hours: string; // 8 hours
    location: string; // Emergency Room
    shiftLabel: string; // Night Shift
  };
  monthlyHours: {
    current: number; // 120
    required: number; // 150
  };
  reason: string;
  additionalNote?: string;
};

type DayOffAffectedShift = {
  dateLabel: string; // Saturday, 29/11/2025
  time: string; // 08:00 - 16:00
  shiftLabel: string; // Morning Shift
  department: string; // ICU
};

type DayOffRequest = BaseRequest & {
  kind: "dayOff";
  leaveBalanceDays: number;
  timeOff: {
    startDateLabel: string; // Saturday, 29/11/2025
    endDateLabel: string; // Sunday, 30/11/2025
    durationLabel: string; // 2 days (16 hours)
    summaryLabel: string; // Saturday - Sunday (2 days)
  };
  affectedShifts: DayOffAffectedShift[];
  reason: string;
  additionalNote?: string;
};

type ShiftRequest = ShiftChangeRequest | AdditionalShiftRequest | DayOffRequest;

type ReplacementDoctor = {
  id: number;
  name: string;
  initials: string;
  title: string;
  monthlyHours: number;
  requiredHours: number;
};

type TypeFilter = "all" | RequestKind;
type StatusFilter = "all" | RequestStatus;

const replacementDoctors: ReplacementDoctor[] = [
  {
    id: 101,
    name: "Dr. David Kim",
    initials: "DK",
    title: "Cardiologist",
    monthlyHours: 150,
    requiredHours: 160,
  },
  {
    id: 102,
    name: "Dr. Lisa Martinez",
    initials: "LM",
    title: "Cardiologist",
    monthlyHours: 140,
    requiredHours: 160,
  },
  {
    id: 103,
    name: "Dr. Michael Roberts",
    initials: "MR",
    title: "Cardiologist",
    monthlyHours: 130,
    requiredHours: 160,
  },
];

// ========== DEMO DATA ==========
const initialRequests: ShiftRequest[] = [
  {
    id: "r1",
    doctorId: 1,
    doctorName: "Dr. Michael Roberts",
    doctorTitle: "Cardiologist",
    department: "Cardiology",
    kind: "shiftChange",
    status: "Pending",
    createdAt: "2025-11-20",
    currentShift: {
      dayLabel: "Monday",
      shiftLabel: "Morning Shift",
      time: "08:00 - 16:00",
    },
    requestedShift: {
      dayLabel: "Tuesday",
      shiftLabel: "Evening Shift",
      time: "14:00 - 22:00",
    },
    reason:
      "Family emergency - need to attend my daughter's school event on Monday morning.",
  },
  {
    id: "r2",
    doctorId: 2,
    doctorName: "Dr. Emily Watson",
    doctorTitle: "Emergency Physician",
    department: "Emergency",
    kind: "additionalShift",
    status: "Pending",
    createdAt: "2025-11-21",
    requestedShift: {
      dateLabel: "Friday, 28/11/2025",
      time: "22:00 - 06:00",
      hours: "8 hours",
      location: "Emergency Room",
      shiftLabel: "Night Shift",
    },
    monthlyHours: {
      current: 120,
      required: 150,
    },
    reason: "I want to help cover holiday period and earn extra hours.",
    additionalNote:
      "I am available and would like to contribute during the busy period.",
  },
  {
    id: "r3",
    doctorId: 3,
    doctorName: "Dr. James Anderson",
    doctorTitle: "ICU Specialist",
    department: "ICU",
    kind: "dayOff",
    status: "Pending",
    createdAt: "2025-11-22",
    leaveBalanceDays: 12,
    timeOff: {
      startDateLabel: "Saturday, 29/11/2025",
      endDateLabel: "Sunday, 30/11/2025",
      durationLabel: "2 days (16 hours)",
      summaryLabel: "Saturday - Sunday (2 days)",
    },
    affectedShifts: [
      {
        dateLabel: "Saturday, 29/11/2025",
        time: "08:00 - 16:00",
        shiftLabel: "Morning Shift",
        department: "ICU",
      },
      {
        dateLabel: "Sunday, 30/11/2025",
        time: "08:00 - 16:00",
        shiftLabel: "Morning Shift",
        department: "ICU",
      },
    ],
    reason: "Family vacation",
    additionalNote: '“Planning a weekend trip with family”',
  },
  {
    id: "r4",
    doctorId: 4,
    doctorName: "Dr. Lisa Martinez",
    doctorTitle: "Cardiologist",
    department: "Cardiology",
    kind: "additionalShift",
    status: "Pending",
    createdAt: "2025-11-23",
    requestedShift: {
      dateLabel: "Monday, 24/11/2025",
      time: "14:00 - 22:00",
      hours: "8 hours",
      location: "Cardiology Ward",
      shiftLabel: "Evening Shift",
    },
    monthlyHours: {
      current: 140,
      required: 160,
    },
    reason: "Willing to support evening coverage.",
  },
  {
    id: "r5",
    doctorId: 5,
    doctorName: "Dr. David Kim",
    doctorTitle: "Cardiologist",
    department: "Cardiology",
    kind: "dayOff",
    status: "Pending",
    createdAt: "2025-11-24",
    leaveBalanceDays: 7,
    timeOff: {
      startDateLabel: "Tuesday, 24/11/2025",
      endDateLabel: "Tuesday, 24/11/2025",
      durationLabel: "1 day (8 hours)",
      summaryLabel: "Tuesday - Tuesday (1 day)",
    },
    affectedShifts: [
      {
        dateLabel: "Tuesday, 24/11/2025",
        time: "08:00 - 16:00",
        shiftLabel: "Morning Shift",
        department: "Cardiology",
      },
    ],
    reason: "Personal appointment.",
  },
];

type ModalStep =
  | null
  | "view" // main detail modal
  | "assignPrompt" // Assign replacement?
  | "assignDoctor" // doctor list
  | "manualEditor"; // schedule editor

const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

const ManageRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ShiftRequest[]>(() => {
    try {
      const saved = localStorage.getItem("medstaff_shift_requests");
      if (saved) {
        const parsed = JSON.parse(saved) as ShiftRequest[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Cannot parse saved requests:", e);
    }
    return initialRequests;
  });

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [toast, setToast] = useState<string | null>(null);

  const activeRequest = useMemo(
    () => requests.find((r) => r.id === activeRequestId) || null,
    [activeRequestId, requests]
  );

  // Lưu requests + pending count → localStorage (để dùng cho badge)
  useEffect(() => {
    localStorage.setItem("medstaff_shift_requests", JSON.stringify(requests));
    const pendingCount = requests.filter((r) => r.status === "Pending").length;
    localStorage.setItem("medstaff_pending_requests", String(pendingCount));
    window.dispatchEvent(new Event("medstaff-requests-updated"));
  }, [requests]);

  // lọc danh sách theo search + filter
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (
        searchText &&
        !r.doctorName.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      if (typeFilter !== "all" && r.kind !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [requests, searchText, typeFilter, statusFilter]);

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const openRequestDetails = (id: string) => {
    setActiveRequestId(id);
    setModalStep("view");
  };

  const closeAllModals = () => {
    setActiveRequestId(null);
    setModalStep(null);
  };

  const handleValidateChangeRequest = () => {
    // step: show Assign Replacement? modal
    setModalStep("assignPrompt");
  };

  const handleSkipReplacement = () => {
    if (!activeRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id ? { ...r, status: "Approved" } : r
      )
    );
    closeAllModals();
    setToast("Shift change request approved.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleGoAssignReplacement = () => {
    setModalStep("assignDoctor");
  };

  const handleAssignDoctor = (doc: ReplacementDoctor) => {
    if (!activeRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id
          ? {
              ...r,
              status: "Approved",
            }
          : r
      )
    );
    closeAllModals();
    setToast(`Assigned ${doc.name} as replacement.`);
    setTimeout(() => setToast(null), 2500);
  };

  const handleOpenManualEditor = () => {
    setModalStep("manualEditor");
  };

  const handleSaveManualSchedule = () => {
    if (!activeRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id ? { ...r, status: "Approved" } : r
      )
    );
    closeAllModals();
    setToast("Schedule updated and request approved.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleApproveAdditional = () => {
    if (!activeRequest || activeRequest.kind !== "additionalShift") return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id ? { ...r, status: "Approved" } : r
      )
    );
    closeAllModals();
    setToast("Additional shift approved.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleDeclineAdditional = () => {
    if (!activeRequest || activeRequest.kind !== "additionalShift") return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id ? { ...r, status: "Declined" } : r
      )
    );
    closeAllModals();
    setToast("Request declined.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleApproveDayOff = () => {
    if (!activeRequest || activeRequest.kind !== "dayOff") return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id ? { ...r, status: "Approved" } : r
      )
    );
    closeAllModals();
    setToast("Day off approved.");
    setTimeout(() => setToast(null), 2500);
  };

  const handleDeclineDayOff = () => {
    if (!activeRequest || activeRequest.kind !== "dayOff") return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequest.id ? { ...r, status: "Declined" } : r
      )
    );
    closeAllModals();
    setToast("Day off request declined.");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="mr-wrapper">
      {/* HEADER */}
      <header className="mr-header">
        <div className="mr-header-left">
          <div className="mr-header-icon">📋</div>
          <div>
            <h1 className="mr-title">Manage Requests</h1>
            <p className="mr-subtitle">
              Review and process all shift-related requests from doctors.
            </p>
          </div>
        </div>
        <div className="mr-header-right">
          <button className="mr-pending-chip">
            {pendingCount} Pending Requests
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <section className="mr-filters">
        <div className="mr-search">
          <span className="mr-search-icon">🔍</span>
          <input
            placeholder="Search by doctor name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="mr-filter-selects">
          <select
            value={typeFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setTypeFilter(e.target.value as TypeFilter)
            }
          >
            <option value="all">All Request Types</option>
            <option value="shiftChange">Shift Change</option>
            <option value="additionalShift">Additional Shift</option>
            <option value="dayOff">Day Off</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </section>

      {/* LIST */}
      <section className="mr-list">
        {filteredRequests.map((req) => (
          <article key={req.id} className="mr-card">
            <div className="mr-card-main">
              <div className="mr-avatar" data-type={req.kind}>
                {getInitials(req.doctorName)}
              </div>
              <div className="mr-card-info">
                <div className="mr-card-name-row">
                  <div className="mr-card-name">{req.doctorName}</div>
                  <span
                    className={`mr-badge-type mr-badge-type--${req.kind}`}
                  >
                    {req.kind === "shiftChange"
                      ? "Shift Change"
                      : req.kind === "additionalShift"
                      ? "Additional Shift"
                      : "Day Off"}
                  </span>
                </div>
                <div className="mr-card-role">
                  {req.doctorTitle} · {req.department}
                </div>

                <div className="mr-card-summary">
                  {req.kind === "shiftChange" ? (
                    <>
                      {req.currentShift.dayLabel.toLowerCase()}{" "}
                      {req.currentShift.shiftLabel.toLowerCase()} →{" "}
                      {req.requestedShift.dayLabel.toLowerCase()}{" "}
                      {req.requestedShift.shiftLabel.toLowerCase()}
                    </>
                  ) : req.kind === "additionalShift" ? (
                    <>
                      {req.requestedShift.dateLabel} ·{" "}
                      {req.requestedShift.shiftLabel.toLowerCase()} (
                      {req.requestedShift.time})
                    </>
                  ) : (
                    <>
                      {req.timeOff.summaryLabel}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mr-card-side">
              <div className="mr-card-side-top">
                <span
                  className={`mr-status mr-status--${req.status.toLowerCase()}`}
                >
                  {req.status === "Pending"
                    ? "Pending Approval"
                    : req.status === "Approved"
                    ? "Approved"
                    : "Declined"}
                </span>
                <span className="mr-date-label">
                  {new Date(req.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
              <button
                className="mr-view-btn"
                onClick={() => openRequestDetails(req.id)}
              >
                👁 View Details
              </button>
            </div>
          </article>
        ))}

        {filteredRequests.length === 0 && (
          <div className="mr-empty">No requests match your filters.</div>
        )}
      </section>

      {/* ========= MODALS ========= */}

      {/* SHIFT CHANGE DETAIL MODAL */}
      {activeRequest &&
        activeRequest.kind === "shiftChange" &&
        modalStep === "view" && (
          <div className="mr-modal-overlay" onClick={closeAllModals}>
            <div
              className="mr-modal mr-modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mr-modal-close" onClick={closeAllModals}>
                ✕
              </button>
              <div className="mr-modal-header mr-modal-header--gradient">
                <div className="mr-modal-avatar-row">
                  <div className="mr-modal-avatar">
                    {getInitials(activeRequest.doctorName)}
                  </div>
                  <div>
                    <div className="mr-modal-title-main">
                      Shift Change Request
                    </div>
                    <div className="mr-modal-sub-title">
                      {activeRequest.doctorName} ·{" "}
                      {activeRequest.doctorTitle} ·{" "}
                      {activeRequest.department}
                    </div>
                  </div>
                </div>
                <div className="mr-modal-status-pill">Pending</div>
              </div>

              <div className="mr-modal-body">
                <div className="mr-two-columns">
                  <div className="mr-shift-box mr-shift-box--current">
                    <div className="mr-shift-box-label">Current Shift</div>
                    <div className="mr-shift-box-day">
                      {activeRequest.currentShift.dayLabel}
                    </div>
                    <div className="mr-shift-box-type">
                      {activeRequest.currentShift.shiftLabel}
                    </div>
                    <div className="mr-shift-box-time">
                      {activeRequest.currentShift.time}
                    </div>
                  </div>

                  <div className="mr-shift-arrow">→</div>

                  <div className="mr-shift-box mr-shift-box--requested">
                    <div className="mr-shift-box-label">Requested Shift</div>
                    <div className="mr-shift-box-day">
                      {activeRequest.requestedShift.dayLabel}
                    </div>
                    <div className="mr-shift-box-type">
                      {activeRequest.requestedShift.shiftLabel}
                    </div>
                    <div className="mr-shift-box-time">
                      {activeRequest.requestedShift.time}
                    </div>
                  </div>
                </div>

                <div className="mr-reason-block">
                  <div className="mr-reason-label">Reason for Request</div>
                  <div className="mr-reason-text">
                    {activeRequest.reason}
                  </div>
                </div>
              </div>

              <div className="mr-modal-footer">
                <button
                  className="mr-btn mr-btn-primary"
                  onClick={handleValidateChangeRequest}
                >
                  ✓ Validate Change Request
                </button>
                <button
                  className="mr-btn mr-btn-ghost"
                  onClick={handleOpenManualEditor}
                >
                  ✎ Change Manually
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ASSIGN REPLACEMENT? PROMPT */}
      {activeRequest &&
        activeRequest.kind === "shiftChange" &&
        modalStep === "assignPrompt" && (
          <div className="mr-modal-overlay" onClick={closeAllModals}>
            <div
              className="mr-modal mr-modal-small"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mr-modal-close" onClick={closeAllModals}>
                ✕
              </button>
              <div className="mr-modal-header">
                <div className="mr-modal-title-main">
                  Assign Replacement for Removed Shift?
                </div>
                <div className="mr-modal-sub-title">
                  This shift is now unassigned. Would you like to assign a
                  doctor to cover this time slot on{" "}
                  {activeRequest.currentShift.dayLabel}?
                </div>
              </div>
              <div className="mr-unassigned-box">
                <div className="mr-unassigned-day">
                  {activeRequest.currentShift.dayLabel}
                </div>
                <div className="mr-unassigned-type">
                  {activeRequest.currentShift.shiftLabel}
                </div>
                <div className="mr-unassigned-time">
                  {activeRequest.currentShift.time}
                </div>
                <div className="mr-unassigned-dept">
                  {activeRequest.department} Ward
                </div>
              </div>
              <div className="mr-modal-footer">
                <button
                  className="mr-btn mr-btn-primary"
                  onClick={handleGoAssignReplacement}
                >
                  Assign Replacement
                </button>
                <button
                  className="mr-btn mr-btn-ghost"
                  onClick={handleSkipReplacement}
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ASSIGN REPLACEMENT DOCTOR LIST */}
      {activeRequest &&
        activeRequest.kind === "shiftChange" &&
        modalStep === "assignDoctor" && (
          <div className="mr-modal-overlay" onClick={closeAllModals}>
            <div
              className="mr-modal mr-modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mr-modal-close" onClick={closeAllModals}>
                ✕
              </button>
              <div className="mr-modal-header mr-modal-header--blue">
                <div>
                  <div className="mr-modal-title-main">
                    Assign Replacement Doctor
                  </div>
                  <div className="mr-modal-sub-title">
                    Select an eligible doctor to cover the{" "}
                    {activeRequest.currentShift.shiftLabel.toLowerCase()} on{" "}
                    {activeRequest.currentShift.dayLabel}.
                  </div>
                </div>
                <div className="mr-pill-context">
                  {activeRequest.currentShift.shiftLabel} ·{" "}
                  {activeRequest.currentShift.time} ·{" "}
                  {activeRequest.department}
                </div>
              </div>

              <div className="mr-modal-body">
                <div className="mr-replacement-list">
                  {replacementDoctors.map((doc) => {
                    const needs =
                      doc.requiredHours - doc.monthlyHours;
                    return (
                      <div key={doc.id} className="mr-replacement-row">
                        <div className="mr-replacement-left">
                          <div className="mr-replacement-avatar">
                            {doc.initials}
                          </div>
                          <div>
                            <div className="mr-replacement-name">
                              {doc.name}
                            </div>
                            <div className="mr-replacement-title">
                              {doc.title}
                            </div>
                          </div>
                        </div>

                        <div className="mr-replacement-middle">
                          <div className="mr-hours-row">
                            <span>
                              Monthly Hours: {doc.monthlyHours}h /{" "}
                              {doc.requiredHours}h
                            </span>
                          </div>
                          <div className="mr-hours-progress">
                            <div
                              className="mr-hours-bar"
                              style={{
                                width: `${
                                  (doc.monthlyHours / doc.requiredHours) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="mr-hours-note">
                            {needs <= 0 ? (
                              <span className="mr-hours-danger">
                                Requirement met
                              </span>
                            ) : (
                              <span className="mr-hours-ok">
                                Needs {needs} more hours
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mr-replacement-right">
                          <span className="mr-availability-pill">
                            Available
                          </span>
                          <button
                            className="mr-btn mr-btn-primary mr-btn-sm"
                            onClick={() => handleAssignDoctor(doc)}
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mr-modal-footer mr-modal-footer--right">
                <button
                  className="mr-btn mr-btn-ghost"
                  onClick={closeAllModals}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      {/* MANUAL SCHEDULE EDITOR (simple demo) */}
      {activeRequest &&
        activeRequest.kind === "shiftChange" &&
        modalStep === "manualEditor" && (
          <div className="mr-modal-overlay" onClick={closeAllModals}>
            <div
              className="mr-modal mr-modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mr-modal-close" onClick={closeAllModals}>
                ✕
              </button>
              <div className="mr-modal-header mr-modal-header--teal">
                <div className="mr-modal-title-main">
                  Manual Schedule Editor
                </div>
                <div className="mr-modal-sub-title">
                  Editing schedule for {activeRequest.doctorName} (
                  {activeRequest.department}). Hover over shifts and adjust
                  as needed.
                </div>
              </div>

              <div className="mr-modal-body">
                <div className="mr-manual-grid">
                  <div className="mr-manual-row mr-manual-row--header">
                    <div>Week of Nov 24 - Nov 30, 2025</div>
                  </div>
                  <div className="mr-manual-row mr-manual-row--days">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                  <div className="mr-manual-row mr-manual-row--shifts">
                    <div className="mr-manual-shift mr-manual-shift--empty" />
                    <div className="mr-manual-shift mr-manual-shift--evening">
                      Evening · 14:00 - 22:00
                    </div>
                    <div className="mr-manual-shift mr-manual-shift--empty" />
                    <div className="mr-manual-shift mr-manual-shift--morning">
                      Morning · 08:00 - 16:00
                    </div>
                    <div className="mr-manual-shift mr-manual-shift--evening">
                      Evening · 14:00 - 22:00
                    </div>
                    <div className="mr-manual-shift mr-manual-shift--night">
                      Night · 22:00 - 06:00
                    </div>
                    <div className="mr-manual-shift mr-manual-shift--morning">
                      Morning · 08:00 - 16:00
                    </div>
                  </div>
                </div>
              </div>

              <div className="mr-modal-footer">
                <button
                  className="mr-btn mr-btn-ghost"
                  onClick={closeAllModals}
                >
                  Cancel
                </button>
                <button
                  className="mr-btn mr-btn-primary"
                  onClick={handleSaveManualSchedule}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ADDITIONAL SHIFT REQUEST MODAL */}
      {activeRequest &&
        activeRequest.kind === "additionalShift" &&
        modalStep === "view" && (
          <div className="mr-modal-overlay" onClick={closeAllModals}>
            <div
              className="mr-modal mr-modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mr-modal-close" onClick={closeAllModals}>
                ✕
              </button>
              <div className="mr-modal-header mr-modal-header--light">
                <div className="mr-modal-avatar-row">
                  <div className="mr-modal-avatar mr-modal-avatar--blue">
                    {getInitials(activeRequest.doctorName)}
                  </div>
                  <div>
                    <div className="mr-modal-title-main">
                      Additional Shift Request
                    </div>
                    <div className="mr-modal-sub-title">
                      {activeRequest.doctorName} ·{" "}
                      {activeRequest.doctorTitle} ·{" "}
                      {activeRequest.department}
                    </div>
                  </div>
                </div>
                <div className="mr-modal-status-pill">Pending</div>
              </div>

              <div className="mr-modal-body">
                <div className="mr-additional-top">
                  <div className="mr-additional-shift-box">
                    <div className="mr-additional-label">
                      Requested Shift Details
                    </div>
                    <div className="mr-additional-date">
                      {activeRequest.requestedShift.dateLabel}
                    </div>
                    <div className="mr-additional-main">
                      <span>{activeRequest.requestedShift.time}</span> ·{" "}
                      <span>{activeRequest.requestedShift.hours}</span>
                    </div>
                    <div className="mr-additional-location">
                      📍 {activeRequest.requestedShift.location}
                    </div>
                  </div>

                  <div className="mr-additional-hours-box">
                    <div className="mr-additional-label">
                      Monthly Hours Status
                    </div>
                    <div className="mr-hours-grid">
                      <div>
                        <div className="mr-hours-caption">
                          Current Hours
                        </div>
                        <div className="mr-hours-value">
                          {activeRequest.monthlyHours.current}h of{" "}
                          {activeRequest.monthlyHours.required}h required
                        </div>
                      </div>
                      <div>
                        <div className="mr-hours-caption">Hours Needed</div>
                        <div className="mr-hours-value">
                          {activeRequest.monthlyHours.required -
                            activeRequest.monthlyHours.current}
                          h to meet requirement
                        </div>
                      </div>
                    </div>
                    <div className="mr-hours-progress">
                      <div
                        className="mr-hours-bar"
                        style={{
                          width: `${
                            (activeRequest.monthlyHours.current /
                              activeRequest.monthlyHours.required) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mr-reason-block">
                  <div className="mr-reason-label">Reason for Request</div>
                  <div className="mr-reason-text">
                    {activeRequest.reason}
                  </div>
                </div>

                {"additionalNote" in activeRequest &&
                  activeRequest.additionalNote && (
                    <div className="mr-reason-block">
                      <div className="mr-reason-label">Additional Note</div>
                      <div className="mr-reason-text">
                        {activeRequest.additionalNote}
                      </div>
                    </div>
                  )}
              </div>

              <div className="mr-modal-footer">
                <button
                  className="mr-btn mr-btn-primary"
                  onClick={handleApproveAdditional}
                >
                  ✓ Approve Additional Shift
                </button>
                <button
                  className="mr-btn mr-btn-danger"
                  onClick={handleDeclineAdditional}
                >
                  ✕ Decline Request
                </button>
              </div>
            </div>
          </div>
        )}

      {/* DAY OFF REQUEST MODAL */}
      {activeRequest &&
        activeRequest.kind === "dayOff" &&
        modalStep === "view" && (
          <div className="mr-modal-overlay" onClick={closeAllModals}>
            <div
              className="mr-modal mr-modal-large"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mr-modal-close" onClick={closeAllModals}>
                ✕
              </button>
              <div className="mr-modal-header mr-modal-header--light">
                <div className="mr-modal-avatar-row">
                  <div className="mr-modal-avatar mr-modal-avatar--purple">
                    {getInitials(activeRequest.doctorName)}
                  </div>
                  <div>
                    <div className="mr-modal-title-main">
                      Day Off Request
                    </div>
                    <div className="mr-modal-sub-title">
                      {activeRequest.doctorName} ·{" "}
                      {activeRequest.doctorTitle} ·{" "}
                      {activeRequest.department}
                    </div>
                  </div>
                  <div className="mr-leave-balance">
                    <span>Leave Balance</span>
                    <strong>{activeRequest.leaveBalanceDays} days</strong>
                  </div>
                </div>
                <div className="mr-modal-status-pill">Pending</div>
              </div>

              <div className="mr-modal-body">
                {/* Requested time off */}
                <div className="mr-dayoff-timeoff">
                  <div className="mr-dayoff-timeoff-row">
                    <div className="mr-dayoff-timeoff-col">
                      <div className="mr-dayoff-label">Start Date</div>
                      <div className="mr-dayoff-value">
                        {activeRequest.timeOff.startDateLabel}
                      </div>
                    </div>
                    <div className="mr-dayoff-timeoff-col">
                      <div className="mr-dayoff-label">End Date</div>
                      <div className="mr-dayoff-value">
                        {activeRequest.timeOff.endDateLabel}
                      </div>
                    </div>
                    <div className="mr-dayoff-timeoff-col">
                      <div className="mr-dayoff-label">Duration</div>
                      <div className="mr-dayoff-value">
                        {activeRequest.timeOff.durationLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affected shifts */}
                <div className="mr-dayoff-affected">
                  <div className="mr-dayoff-label">
                    Affected Shifts ({activeRequest.affectedShifts.length})
                  </div>
                  <div className="mr-dayoff-affected-list">
                    {activeRequest.affectedShifts.map((s, idx) => (
                      <div key={idx} className="mr-dayoff-affected-item">
                        <div className="mr-dayoff-affected-main">
                          <div className="mr-dayoff-affected-date">
                            {s.dateLabel}
                          </div>
                          <div className="mr-dayoff-affected-meta">
                            {s.shiftLabel} · {s.time}
                          </div>
                        </div>
                        <div className="mr-dayoff-affected-dept">
                          {s.department}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mr-dayoff-replacement-note">
                    ⚠ Replacement Required – If approved, you will be prompted
                    to assign replacement doctors for the affected shifts.
                  </div>
                </div>

                {/* Reason + note */}
                <div className="mr-reason-block">
                  <div className="mr-reason-label">Reason for Leave</div>
                  <div className="mr-reason-text">
                    {activeRequest.reason}
                  </div>
                </div>

                {activeRequest.additionalNote && (
                  <div className="mr-reason-block">
                    <div className="mr-reason-label">Additional Note</div>
                    <div className="mr-reason-text">
                      {activeRequest.additionalNote}
                    </div>
                  </div>
                )}
              </div>

              <div className="mr-modal-footer">
                <button
                  className="mr-btn mr-btn-primary"
                  onClick={handleApproveDayOff}
                >
                  ✓ Approve Day Off
                </button>
                <button
                  className="mr-btn mr-btn-danger"
                  onClick={handleDeclineDayOff}
                >
                  ✕ Decline Request
                </button>
              </div>
            </div>
          </div>
        )}

      {/* TOAST */}
      {toast && (
        <div className="mr-toast">
          <div className="mr-toast-content">✅ {toast}</div>
        </div>
      )}
    </div>
  );
};

export default ManageRequestsPage;
