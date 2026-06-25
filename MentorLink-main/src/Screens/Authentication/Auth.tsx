// Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";

import type { ChangeEvent } from "react";
import style from "./Auth.module.css";
import logoIcon from "../../assets/logo.svg";
import { Eye, EyeOff, X } from "lucide-react";

type Props = {
  onClose: () => void;
};

function Auth({ onClose }: Props) {
  const [view, setView] = useState<"auth" | "forgot">("auth");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ normalize email (remove spaces)
  const normalizeEmail = (email: string) => email.replace(/\s/g, "").toLowerCase();

  // ✅ NTU email validation (cs or ct only)
  const isValidStudentEmail = (email: string) =>
    /^[0-9]{2}ntu(cs|ct)[a-z]*[0-9]+@student\.ntu\.edu\.pk$/.test(email);

  // ---------------- SIGN UP / SIGN IN ----------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const cleanEmail = normalizeEmail(email);

    if (!isValidStudentEmail(cleanEmail)) {
      setErrorMessage(
        "Invalid NTU email format. Example: 23ntucsfl1002@student.ntu.edu.pk"
      );
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verified`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      navigate("/email-sent", { state: { email: cleanEmail } });
      setEmail("");
      setPassword("");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    navigate("/student", { replace: true });
    setLoading(false);
  }

  // ---------------- FORGOT PASSWORD ----------------
  async function handleForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const cleanEmail = normalizeEmail(email);

    if (!isValidStudentEmail(cleanEmail)) {
      setErrorMessage(
        "Invalid email format. Example: 23ntucsfl1002@student.ntu.edu.pk"
      );
      setLoading(false);
      return;
    }

    localStorage.setItem("reset-email-input", cleanEmail);

    const { error } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setForgotSuccess(true);
  }

  // ---------------- UI ----------------
  return (
    <div className={style.overlay}>
      <div className={style.loginCard}>
        <div className={style.closeBtn}>
          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {view === "forgot" ? (
          <>
            <img src={logoIcon} className={style.logoImg} />
            <h2 className={style.title}>Reset Password</h2>

            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className={style.form}>
                <input
                  className={style.input}
                  type="email"
                  placeholder="23ntucsfl1002@student.ntu.edu.pk"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                />

                {errorMessage && (
                  <p className={style.error}>{errorMessage}</p>
                )}

                <button className={style.submitBtn} disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <button
                  type="button"
                  onClick={() => setView("auth")}
                  className={style.backToLoginBtn}
                >
                  Back to Sign In
                </button>
              </form>
            ) : (
              <div>
                <h3>Check your email</h3>
                <p>Reset link sent to {email}</p>

                <button
                  onClick={() => {
                    onClose();
                    navigate("/reset-password");
                  }}
                >
                  Continue
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <img src={logoIcon} className={style.logoImg} />
            <h2>NTUConnect</h2>

            <div>
              <button onClick={() => setIsSignUp(false)}>Sign In</button>
              <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            </div>

            <form onSubmit={handleSubmit} className={style.form}>
              <input
                className={style.input}
                type="email"
                placeholder="23ntucsfl1002@student.ntu.edu.pk"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />

              <div className={style.passwordWrapper}>
                <input
                  className={style.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errorMessage && (
                <p className={style.error}>{errorMessage}</p>
              )}

              <button className={style.submitBtn} disabled={loading}>
                {loading
                  ? "Loading..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("forgot");
                  setErrorMessage("");
                  setForgotSuccess(false);
                }}
                className={style.backToLoginBtn}
              >
                Forgot Password?
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;