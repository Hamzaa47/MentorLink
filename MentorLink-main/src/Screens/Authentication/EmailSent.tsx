// EmailVerifyCard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { useLocation, useNavigate } from "react-router-dom";

import style from "./EmailVerified.module.css";
import logoIcon from "../../assets/logo.svg";

function ConfirmEmail() {
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    // ─── Cross-tab detection ───────────────────────────────────────────────
    // When the user clicks the email link in a different tab, the verification
    // tab writes "sb-session" to localStorage. We listen here so this tab
    // automatically navigates to /email-verified once verification is done.
    function handleStorageChange(event: StorageEvent) {
      if (event.key === "sb-session" && event.newValue) {
        try {
          const session = JSON.parse(event.newValue);
          if (session?.access_token) {
            navigate("/email-verified");
          }
        } catch {
          // ignore malformed values
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);

    // ─── Same-tab detection (auth state change) ───────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/email-verified");
      }
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleResendEmail() {
    setResendMessage("");
    setResendError("");
    setResendLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/email-verified`,
      },
    } as Parameters<typeof supabase.auth.resend>[0]);

    setResendLoading(false);

    if (error) {
      setResendError(error.message);
    } else {
      setResendMessage("✅ Verification email resent! Check your inbox.");
    }
  }

  return (
    <div className={style.verifyContainer}>
      <div className={style.verifyCard}>
        <img src={logoIcon} className={style.logoImg} alt="NTUConnect Logo" />
        <h2 className={style.brand}>NTUConnect</h2>
        <h3>Verify your email address</h3>
        <p className={style.message}>
          We've sent a verification link to your email. Please check your inbox
          (and <strong>Junk / Spam</strong> folder) and click the link to
          activate your account.
        </p>
        <div className={style.emailBox}>📩 {email}</div>
        <p className={style.note}>
          If the link in the email doesn't work, try right-clicking it and
          selecting <em>"Open link"</em>, or copy the URL and paste it in your
          browser.
        </p>
        <button
          className={`${resendLoading ? style.spinner : style.resendBtn}`}
          onClick={handleResendEmail}
          disabled={resendLoading}
        >
          {resendLoading ? (
            <span className={style.spinnner}></span>
          ) : (
            "Resend Email"
          )}
        </button>
        {resendMessage && <p className={style.successText}>{resendMessage}</p>}
        {resendError && <p className={style.errorText}>{resendError}</p>}
      </div>
    </div>
  );
}

export default ConfirmEmail;
