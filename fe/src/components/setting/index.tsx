import React, { useEffect, useState } from "react";
import "./index.scss";

type ThemeMode = "light" | "dark";

const SettingsView: React.FC = () => {
  // Khởi tạo theme từ localStorage (không dùng setTheme trong effect nữa)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("medstaff_theme") as ThemeMode | null;
    return stored === "dark" ? "dark" : "light";
  });

  // Mỗi khi theme thay đổi thì apply class vào <body> + lưu lại localStorage
  useEffect(() => {
    const body = document.body;
    body.classList.remove("medstaff-theme-light", "medstaff-theme-dark");
    body.classList.add(
      theme === "light" ? "medstaff-theme-light" : "medstaff-theme-dark"
    );

    localStorage.setItem("medstaff_theme", theme);
  }, [theme]);

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
  };

  return (
    <div className='settings-page'>
      <header className='settings-header'>
        <h1 className='settings-title'>Settings</h1>
        <p className='settings-subtitle'>
          Manage your preferences and app settings
        </p>
      </header>

      <div className='settings-cards'>
        {/* LANGUAGE CARD */}
        <section className='settings-card'>
          <div className='settings-card-main'>
            <div className='settings-icon settings-icon--teal'>🌐</div>
            <div>
              <div className='settings-card-title'>Language</div>
              <div className='settings-card-desc'>
                Choose your preferred language
              </div>
              <div className='settings-card-meta'>
                <span className='settings-card-meta-label'>US</span>
                <span className='settings-card-meta-value'>English</span>
              </div>
            </div>
          </div>

          <button
            className='settings-card-chevron'
            onClick={() =>
              alert("Demo only – language picker is not implemented yet.")
            }>
            ›
          </button>
        </section>

        {/* APPEARANCE CARD */}
        <section className='settings-card'>
          <div className='settings-card-main'>
            <div className='settings-icon settings-icon--purple'>✨</div>
            <div>
              <div className='settings-card-title'>Appearance</div>
              <div className='settings-card-desc'>
                Customize your interface theme
              </div>
            </div>
          </div>

          <div className='settings-appearance-options'>
            <button
              className={
                "appearance-option" +
                (theme === "light" ? " appearance-option--active" : "")
              }
              onClick={() => handleThemeChange("light")}>
              <div className='appearance-icon'>☀️</div>
              <div className='appearance-label'>Light Mode</div>
              {theme === "light" && <div className='appearance-check'>✔</div>}
            </button>

            <button
              className={
                "appearance-option" +
                (theme === "dark" ? " appearance-option--active" : "")
              }
              onClick={() => handleThemeChange("dark")}>
              <div className='appearance-icon'>🌙</div>
              <div className='appearance-label'>Dark Mode</div>
              {theme === "dark" && <div className='appearance-check'>✔</div>}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
