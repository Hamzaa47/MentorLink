// Auth.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase-client";

import type { ChangeEvent } from "react";
import style from "./Auth.module.css";
import { Eye, EyeOff, X } from "lucide-react";

type Props = {
  onClose: () => void;
};

function Auth({ onClose }: Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function isValidStudentEmail(email: string) {
    const regex = /^(2[0-9])ntucsfl\d{4}@student\.ntu\.edu\.pk$/;
    return regex.test(email);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (isSignUp) {
      if (!isValidStudentEmail(email)) {
        setErrorMessage(
          "Invalid email format. Use: 23ntucsfl1003@student.ntu.edu.pk"
        );
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
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

      if (data?.user?.identities?.length === 0) {
        setErrorMessage("Email already registered. Please sign in.");
        setLoading(false);
        return;
      }

      navigate("/email-sent", {
        state: { email },
      });

      setEmail("");
      setPassword("");
      setLoading(false);
      return;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
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
  }

  return (
    <div className={style.overlay}>
      <div className={style.loginCard}>
        <div className={style.closeBtn}>
          <button type="button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>
        
        <h2 className={style.title}>MentorLink</h2>
        
        <p className={style.subtitle}>
          {isSignUp 
            ? "Create your student account to connect with mentors." 
            : "Sign in to your student account to connect with mentors."}
        </p>

        {/* Tab Switcher */}
        <div className={style.tabContainer}>
          <button 
            type="button" 
            className={`${style.tab} ${!isSignUp ? style.activeTab : style.inactiveTab}`}
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage("");
            }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className={`${style.tab} ${isSignUp ? style.activeTab : style.inactiveTab}`}
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.inputGroup}>
            <label className={style.label}>Student Email</label>
            <input
              className={style.input}
              type="email"
              placeholder="23ntucsfl1003@student.ntu.edu.pk"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className={style.inputGroup}>
            <label className={style.label}>Password</label>
            <div className={style.passwordWrapper}>
              <input
                className={`${style.input} ${style.passwordInput}`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••••••••••"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
              <button
                className={style.togglePassword}
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errorMessage && <p className={style.error}>{errorMessage}</p>}
          </div>

          <button
            className={style.submitBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className={style.spinner}></span>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>

          <div className={style.footer}>
            <span>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              className={style.footerBtn}
              onClick={() => {
                setIsSignUp((p) => !p);
                setErrorMessage("");
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
