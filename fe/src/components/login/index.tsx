import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";

const imgLoginView = new URL(
  "../../assets/Logo_benh_vien_199.png",
  import.meta.url
).href;

// ========== FAKE DATABASE CHO DEMO ==========
type FakeUser = {
  staffId: string;
  password: string;
  name: string;
  role: string;
};

const fakeUsers: FakeUser[] = [
  { staffId: "SC001", password: "123456", name: "Alex Nguyen", role: "Scheduler" },
  { staffId: "DR123", password: "med2025", name: "Dr. Lan", role: "Doctor" },
  { staffId: "NR456", password: "nurse2025", name: "Nurse Hoa", role: "Nurse" },
];

function validateLogin(staffId: string, password: string): FakeUser | null {
  const user = fakeUsers.find(
    (u) =>
      u.staffId.toLowerCase() === staffId.trim().toLowerCase() &&
      u.password === password
  );
  return user ?? null;
}

// ========== UI ==========

const LoginView: React.FC = () => {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (!staffId || !password) {
      alert("Please enter both Staff ID and Password");
      return;
    }

    const user = validateLogin(staffId, password);
    if (!user) {
      alert("Invalid Staff ID or Password. Please try again.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem(
        "medstaff_user",
        JSON.stringify({
          staffId: user.staffId,
          name: user.name,
          role: user.role,
        })
      );
    }

    navigate("/");
  };

  return (
    <div className='login-page'>
      <div className='login-bg login-bg--left' />
      <div className='login-bg login-bg--right' />

      <div className='login-card'>
        <div className='login-logo-wrapper'>
          <div className='login-logo-circle'>
            <img src={imgLoginView} alt='MedStaff Logo' />
          </div>
        </div>

        <h1 className='login-title'>MedStaff Portal</h1>
        <p className='login-subtitle'>Hospital Staff Scheduling System</p>

        {/* ===== FORM BẮT ENTER ===== */}
        <form
          className='login-form'
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          {/* Staff ID */}
          <label className='login-field-label' htmlFor='staffId'>
            Staff ID
          </label>
          <div className='login-field'>
            <span className='login-field-icon'>👤</span>
            <input
              id='staffId'
              type='text'
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder='Enter your staff ID'
            />
          </div>

          {/* Password */}
          <label className='login-field-label' htmlFor='password'>
            Password
          </label>
          <div className='login-field'>
            <span className='login-field-icon'>🔒</span>
            <input
              id='password'
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
            />
            <button
              type='button'
              className='login-eye-btn'
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* remember + forgot */}
          <div className='login-row'>
            <label className='login-remember'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button
              type='button'
              className='login-link'
              onClick={() =>
                alert("Forgot password? Please contact your administrator.")
              }
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In */}
          <button type='submit' className='login-submit'>
            Sign In
          </button>
        </form>

        {/* demo */}
        <div className='login-demo'>
          <p>Demo Access - Use any credentials to login</p>
          <div className='login-demo-box'>
            <p>
              <strong>Staff ID:</strong>&nbsp;Any ID (e.g., SC001, DR123)
            </p>
            <p>
              <strong>Password:</strong>&nbsp;Any password
            </p>
          </div>
        </div>
      </div>

      <p className='login-footer'>
        © 2025 MedStaff Hospital System. All rights reserved.
      </p>
    </div>
  );
};

export default LoginView;
