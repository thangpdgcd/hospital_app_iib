// src/layout/mainlayout.tsx
import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import medstaffLogo from "../src/assets/Logo_benh_vien_199.png";
import "./mainlayout.scss";

const { Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pendingShifts, setPendingShifts] = useState(0);      // badge My Team
  const [pendingRequests, setPendingRequests] = useState(0);  // badge Manage Requests
  const collapsed = false; // sidebar luôn mở

  // map pathname -> menu key
  const selectedKey = (() => {
    if (location.pathname === "/") return "myteam";
    if (location.pathname.startsWith("/schedule")) return "schedule";
    if (location.pathname.startsWith("/manage-requests"))
      return "manage-requests";
    if (location.pathname.startsWith("/chat")) return "chat";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "myteam";
  })();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "myteam") navigate("/");
    if (key === "schedule") navigate("/schedule");
    if (key === "manage-requests") navigate("/manage-requests");
    if (key === "chat") navigate("/chat");
    if (key === "settings") navigate("/settings");
  };

  const handleLogout = () => {
    // localStorage.removeItem("auth_token");
    navigate("/login");
  };

  // ====== ĐỌC SỐ PENDING CỦA MY TEAM (VALIDATION SHIFT) ======
  useEffect(() => {
    const readPendingShifts = () => {
      const raw = localStorage.getItem("medstaff_pending_shifts");
      setPendingShifts(raw ? Number(raw) : 0);
    };

    readPendingShifts();
    window.addEventListener("medstaff-pending-updated", readPendingShifts);

    return () => {
      window.removeEventListener(
        "medstaff-pending-updated",
        readPendingShifts
      );
    };
  }, []);

  // ====== ĐỌC SỐ PENDING CỦA MANAGE REQUESTS ======
  useEffect(() => {
    const readPendingRequests = () => {
      const raw = localStorage.getItem("medstaff_pending_requests");
      setPendingRequests(raw ? Number(raw) : 0);
    };

    readPendingRequests();
    window.addEventListener(
      "medstaff-requests-updated",
      readPendingRequests
    );

    return () => {
      window.removeEventListener(
        "medstaff-requests-updated",
        readPendingRequests
      );
    };
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={260}
        className="ms-sider"
      >
        {/* logo */}
        <div className="ms-sider-logo">
          <div className="ms-logo-img-wrapper">
            <img src={medstaffLogo} alt="MedStaff" className="ms-logo-img" />
          </div>
          {!collapsed && (
            <div className="ms-logo-text">
              <div className="ms-logo-title">MedStaff</div>
              <div className="ms-logo-subtitle">Hospital System</div>
            </div>
          )}
        </div>

        {/* user card */}
        <div className="ms-sider-user">
          <div className="ms-user-avatar">SC</div>
          {!collapsed && (
            <div className="ms-user-info">
              <div className="ms-user-name">Dr. Sarah Chen</div>
              <div className="ms-user-role">Cardiology · ICU</div>
              <div className="ms-user-status">
                <span className="ms-user-status-dot">●</span>
                <span>Online</span>
              </div>
            </div>
          )}
        </div>

        {/* main menu */}
        <Menu
          className="ms-menu"
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: "myteam",
              icon: <UserOutlined />,
              label: (
                <span className="ms-menu-item-with-badge">
                  <span>My Team</span>
                  {pendingShifts > 0 && (
                    <span className="ms-menu-badge">
                      {pendingShifts}
                    </span>
                  )}
                </span>
              ),
            },
            {
              key: "schedule",
              icon: <CalendarOutlined />,
              label: "Schedule Planning",
            },
            {
              key: "manage-requests",
              icon: <ProfileOutlined />,
              label: (
                <span className="ms-menu-item-with-badge">
                  <span>Manage Requests</span>
                  {pendingRequests > 0 && (
                    <span className="ms-menu-badge">
                      {pendingRequests}
                    </span>
                  )}
                </span>
              ),
            },
            {
              key: "chat",
              icon: <MessageOutlined />,
              label: "Chat",
            },
          ]}
          style={{ marginTop: 8 }}
        />

        {/* bottom: settings + logout */}
        <div className="ms-sider-bottom">
          <button
            className="ms-sider-bottom-item"
            onClick={() => navigate("/settings")}
          >
            <SettingOutlined />
            {!collapsed && <span>Settings</span>}
          </button>

          <button
            className="ms-sider-bottom-item ms-sider-bottom-item--logout"
            onClick={handleLogout}
          >
            <LogoutOutlined />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </Sider>

      <Layout>
        <Content
          style={{
            margin: 0,
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
