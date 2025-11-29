// src/components/home/index.tsx
import React, { useState } from "react";
import "./index.scss";
import ChatView from "../chat";

import { useNavigate } from "react-router-dom";

// chỉnh đường dẫn logo cho đúng với dự án của bạn
import medstaffLogo from "../../assets/Logo_benh_vien_199.png";

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

const notClockedStaff: Staff[] = [
  {
    id: "6",
    name: "Dr. David Kim",
    initials: "DK",
    role: "Neurologist",
    department: "Neurology",
    shift: "Evening",
    shiftTime: "14:00 - 22:00",
    status: "NotClocked",
    statusNote: "Late by 68 min",
  },
];

const TOTAL_STAFF = 6;
const ACTIVE_STAFF = 4;
const NOT_STARTED = 2;

// menu bên trái
type MenuKey = "myteam" | "schedule" | "requests" | "chat" | "settings";

// tab trong My Team
type TabKey = "status" | "schedule" | "performance";

const HomeView: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("myteam");
  const [activeTab, setActiveTab] = useState<TabKey>("status");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [onlyLate, setOnlyLate] = useState(false);
  const [onlyNotClocked, setOnlyNotClocked] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const navigate = useNavigate();

  // áp dụng filter đơn giản
  const visibleWorkingStaff = workingStaff.filter((s) => {
    if (onlyLate) return s.status === "Late";
    return true;
  });

  const visibleNotClockedStaff = notClockedStaff.filter((s) => {
    if (onlyNotClocked) return s.status === "NotClocked";
    return true;
  });

  const handleFilterClick = () => {
    setFiltersOpen(true);
  };

  const handleLogout = () => {
    // Xoá thông tin user demo nếu có
    localStorage.removeItem("medstaff_user");
    // Điều hướng về trang login
    navigate("/login", { replace: true });
  };

  const handleSummaryClick = (type: "total" | "active" | "notStarted") => {
    // luôn chuyển về màn My Team + tab status
    setActiveMenu("myteam");
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

  const handleNavClick = (menu: MenuKey) => {
    if (menu === "settings") {
      navigate("/settings"); // sang route Settings mới
      return;
    }

    setActiveMenu(menu);
    setSelectedStaff(null);
  };

  const renderMainContent = () => {
    // ========== MY TEAM ==========
    if (activeMenu === "myteam") {
      return (
        <>
          {/* Summary cards */}
          <section className='summary-cards'>
            <button
              className='summary-card summary-card--button'
              onClick={() => handleSummaryClick("total")}>
              <div className='summary-icon summary-icon--muted'>👤</div>
              <div>
                <div className='summary-label'>Total Staff</div>
                <div className='summary-value'>{TOTAL_STAFF}</div>
              </div>
            </button>

            <button
              className='summary-card summary-card--green summary-card--button'
              onClick={() => handleSummaryClick("active")}>
              <div className='summary-icon summary-icon--white'>💓</div>
              <div>
                <div className='summary-label summary-label--green'>Active</div>
                <div className='summary-value summary-value--green'>
                  {ACTIVE_STAFF}
                </div>
              </div>
            </button>

            <button
              className='summary-card summary-card--button'
              onClick={() => handleSummaryClick("notStarted")}>
              <div className='summary-icon summary-icon--muted'>⏲</div>
              <div>
                <div className='summary-label'>Not Started</div>
                <div className='summary-value'>{NOT_STARTED}</div>
              </div>
            </button>
          </section>

          {/* Tabs */}
          <div className='shift-tabs'>
            <button
              className={
                "shift-tab" +
                (activeTab === "status" ? " shift-tab--active" : "")
              }
              onClick={() => setActiveTab("status")}>
              Active Shift Status
            </button>
            <button
              className={
                "shift-tab" +
                (activeTab === "schedule" ? " shift-tab--active" : "")
              }
              onClick={() => setActiveTab("schedule")}>
              Team Schedule Overview
            </button>
            <button
              className={
                "shift-tab" +
                (activeTab === "performance" ? " shift-tab--active" : "")
              }
              onClick={() => setActiveTab("performance")}>
              Performance
            </button>
          </div>

          {/* Nội dung theo tab */}
          {activeTab === "status" && (
            <>
              {/* Currently working */}
              <section className='section section-working'>
                <div className='section-header section-header--green'>
                  <div className='section-title-wrapper'>
                    <div className='section-dot section-dot--green'>✓</div>
                    <div className='section-title'>
                      Currently Working ({visibleWorkingStaff.length})
                    </div>
                  </div>
                </div>

                <div className='section-body section-body--grid'>
                  {visibleWorkingStaff.map((staff) => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      onClick={() => setSelectedStaff(staff)}
                    />
                  ))}
                </div>
              </section>

              {/* Not clocked in */}
              <section className='section section-notclocked'>
                <div className='section-header section-header--grey'>
                  <div className='section-title-wrapper'>
                    <div className='section-dot section-dot--grey'>⦻</div>
                    <div className='section-title'>
                      Not Clocked In ({visibleNotClockedStaff.length})
                    </div>
                  </div>
                </div>

                <div className='section-body'>
                  {visibleNotClockedStaff.map((staff) => (
                    <StaffCard
                      key={staff.id}
                      staff={staff}
                      onClick={() => setSelectedStaff(staff)}
                    />
                  ))}
                </div>
              </section>

              {/* Panel chi tiết staff khi click */}
              {selectedStaff && (
                <section className='section section-detail'>
                  <div className='section-header section-header--grey'>
                    <div className='section-title-wrapper'>
                      <div className='section-title'>Staff detail</div>
                    </div>
                    <button
                      className='detail-close-btn'
                      onClick={() => setSelectedStaff(null)}>
                      ✕
                    </button>
                  </div>

                  {/* show big card same style as list card */}
                  <div className='section-body section-body--detail'>
                    <StaffCard staff={selectedStaff} />
                  </div>
                </section>
              )}
            </>
          )}

          {activeTab === "schedule" && (
            <section className='section'>
              <div className='section-header section-header--grey'>
                <div className='section-title-wrapper'>
                  <div className='section-title'>Team Schedule Overview</div>
                </div>
              </div>
              <div className='section-body'>
                <p>
                  Đây là nội dung demo cho tab{" "}
                  <strong>Team Schedule Overview</strong>. Bạn có thể thay bằng
                  bảng lịch, calendar, v.v.
                </p>
              </div>
            </section>
          )}

          {activeTab === "performance" && (
            <section className='section'>
              <div className='section-header section-header--grey'>
                <div className='section-title-wrapper'>
                  <div className='section-title'>Performance</div>
                </div>
              </div>
              <div className='section-body'>
                <p>
                  Đây là nội dung demo cho tab <strong>Performance</strong>. Chỗ
                  này có thể là biểu đồ KPI, tỉ lệ đi trễ, v.v.
                </p>
              </div>
            </section>
          )}
        </>
      );
    }

    // ========== CÁC MÀN KHÁC ==========
    if (activeMenu === "schedule") {
      return (
        <section className='section'>
          <div className='section-header section-header--grey'>
            <div className='section-title-wrapper'>
              <div className='section-title'>Schedule Planning</div>
            </div>
          </div>
          <div className='section-body'>
            <p>
              Demo màn <strong>Schedule Planning</strong>. Bạn có thể thêm
              timetable, form tạo ca trực, v.v.
            </p>
          </div>
        </section>
      );
    }

    if (activeMenu === "requests") {
      return (
        <section className='section'>
          <div className='section-header section-header--grey'>
            <div className='section-title-wrapper'>
              <div className='section-title'>Manage Requests</div>
            </div>
          </div>
          <div className='section-body'>
            <p>
              Demo màn <strong>Manage Requests</strong> (yêu cầu đổi ca, nghỉ
              phép…).
            </p>
          </div>
        </section>
      );
    }

    if (activeMenu === "chat") {
      // Cho ChatView chiếm full nội dung
      return (
        <section className='section'>
          <div className='section-header section-header--grey'>
            <div className='section-title-wrapper'>
              <div className='section-title'>Team Chat</div>
            </div>
          </div>
          <div className='section-body section-body--chat'>
            <ChatView />
          </div>
        </section>
      );
    }

    // settings
    return (
      <section className='section'>
        <div className='section-header section-header--grey'>
          <div className='section-title-wrapper'>
            <div className='section-title'>Settings</div>
          </div>
        </div>
        <div className='section-body'>
          <p>
            Demo màn <strong>Settings</strong>. Có thể chứa đổi theme, thông tin
            user…
          </p>
        </div>
      </section>
    );
  };

  return (
    <div className='myteam-layout'>
      {/* SIDEBAR */}
      <aside className='myteam-sidebar'>
        <div className='sidebar-logo'>
          <div className='logo-img-wrapper'>
            <img src={medstaffLogo} alt='MedStaff logo' className='logo-img' />
          </div>
          <div className='logo-text'>
            <div className='logo-title'>MedStaff</div>
            <div className='logo-subtitle'>Hospital System</div>
          </div>
        </div>

        <div className='sidebar-user'>
          <div className='user-avatar'>SC</div>
          <div className='user-info'>
            <div className='user-name'>Dr. Sarah Chen</div>
            <div className='user-role'>Cardiology • ICU</div>
            <div className='user-status'>● Online</div>
          </div>
        </div>

        <nav className='sidebar-nav'>
          <button
            className={
              "nav-item" + (activeMenu === "myteam" ? " nav-item--active" : "")
            }
            onClick={() => handleNavClick("myteam")}>
            <span className='nav-icon'>👥</span>
            <span>My Team</span>
          </button>
          <button
            className={
              "nav-item" +
              (activeMenu === "schedule" ? " nav-item--active" : "")
            }
            onClick={() => handleNavClick("schedule")}>
            <span className='nav-icon'>📅</span>
            <span>Schedule Planning</span>
          </button>
          <button
            className={
              "nav-item" +
              (activeMenu === "requests" ? " nav-item--active" : "")
            }
            onClick={() => handleNavClick("requests")}>
            <span className='nav-icon'>📨</span>
            <span>Manage Requests</span>
          </button>
          <button
            className={
              "nav-item" + (activeMenu === "chat" ? " nav-item--active" : "")
            }
            onClick={() => handleNavClick("chat")}>
            <span className='nav-icon'>💬</span>
            <span>Chat</span>
          </button>
        </nav>

        <div className='sidebar-bottom'>
          <button
            className={
              "nav-item" +
              (activeMenu === "settings" ? " nav-item--active" : "")
            }
            onClick={() => handleNavClick("settings")}>
            <span className='nav-icon'>⚙️</span>
            <span>Settings</span>
          </button>
          <button className='nav-item nav-item--logout' onClick={handleLogout}>
            <span className='nav-icon'>⏏</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className='myteam-main'>
        <header className='myteam-header'>
          <div>
            <h1 className='header-title'>My Team</h1>
            <p className='header-subtitle'>
              Monitor team activity and schedules in real-time
            </p>
          </div>

          <button className='filter-button' onClick={handleFilterClick}>
            <span>⚙️</span>
            <span>Filters</span>
          </button>
        </header>

        <main className='myteam-content'>{renderMainContent()}</main>
      </div>

      {/* FILTER PANEL */}
      {filtersOpen && (
        <div className='filters-overlay'>
          <div className='filters-panel'>
            <div className='filters-header'>
              <h3>Filters</h3>
              <button
                className='detail-close-btn'
                onClick={() => setFiltersOpen(false)}>
                ✕
              </button>
            </div>
            <div className='filters-body'>
              <label className='filters-row'>
                <input
                  type='checkbox'
                  checked={onlyLate}
                  onChange={(e) => setOnlyLate(e.target.checked)}
                />
                <span>Chỉ hiển thị staff bị Late (Currently Working)</span>
              </label>
              <label className='filters-row'>
                <input
                  type='checkbox'
                  checked={onlyNotClocked}
                  onChange={(e) => setOnlyNotClocked(e.target.checked)}
                />
                <span>Chỉ quan tâm phần Not Clocked In</span>
              </label>
            </div>
            <div className='filters-footer'>
              <button
                className='filter-button filter-button--small'
                onClick={() => {
                  setOnlyLate(false);
                  setOnlyNotClocked(false);
                }}>
                Clear
              </button>
              <button
                className='filter-button filter-button--primary filter-button--small'
                onClick={() => setFiltersOpen(false)}>
                Apply
              </button>
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
    <div className='staff-card' onClick={onClick}>
      <div className='staff-card-left'>
        <div className='staff-avatar'>{staff.initials}</div>
        <div className='staff-info'>
          <div className='staff-name-row'>
            <div className='staff-name'>{staff.name}</div>
          </div>
          <div className='staff-role'>
            {staff.role} • {staff.department}
          </div>

          <div className='staff-meta'>
            <span className='shift-badge'>{staff.shift}</span>
            <span className='shift-time'>
              <span className='clock-icon'>🕒</span> {staff.shiftTime}
            </span>
          </div>

          {staff.statusNote && (
            <div
              className={
                staff.status === "Late"
                  ? "staff-status-note staff-status-note--danger"
                  : "staff-status-note"
              }>
              {staff.statusNote}
            </div>
          )}
        </div>
      </div>

      <div className='staff-card-right'>
        <StatusPill state={staff.status} />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{ state: StaffState }> = ({ state }) => {
  if (state === "Active") {
    return <div className='status-pill status-pill--active'>Active</div>;
  }
  if (state === "Late") {
    return <div className='status-pill status-pill--late'>Late</div>;
  }
  return <div className='status-pill status-pill--muted'>Not Clocked In</div>;
};

export default HomeView;
