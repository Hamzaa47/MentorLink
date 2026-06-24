import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { realtimeSupabase } from "../../supabase-client";
import style from "./EmailVerified.module.css";
import logoIcon from "../../assets/logo.svg";

function ConfirmEmail() {
  const navigate = useNavigate();
  const [sessionReady, setSessionReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get("error");
    return error ? "Verification link expired or already used. Please request a new one." : "";
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenHash = queryParams.get("token_hash");
    const type = queryParams.get("type") || "signup";
    const error = queryParams.get("error");

    if (error) {
      setErrorMessage("Verification link expired or already used. Please request a new one.");
      return;
    }

    if (tokenHash) {
      // Use the REAL Supabase JS client (realtimeSupabase) so verifyOtp talks
      // directly to Supabase Auth REST — this works with the anon key and
      // correctly sets the session in the real Supabase client storage.
      realtimeSupabase.auth
        .verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "recovery" | "email_change",
        })
        .then(({ data, error: verifyError }) => {
          if (verifyError) {
            console.error("verifyOtp error:", verifyError.message);
            setErrorMessage(
              verifyError.message.includes("expired") || verifyError.message.includes("invalid")
                ? "Verification link expired or already used. Please request a new one."
                : verifyError.message
            );
            return;
          }
          if (data?.session) {
            // Persist session in localStorage so our custom supabase-client picks it up
            localStorage.setItem("sb-session", JSON.stringify(data.session));
            if (data.session.user) {
              localStorage.setItem("sb-user", JSON.stringify(data.session.user));
            }
            // Notify any other tabs that verification happened
            window.dispatchEvent(new StorageEvent("storage", {
              key: "sb-session",
              newValue: JSON.stringify(data.session),
              storageArea: localStorage,
            }));
            setSessionReady(true);
          } else {
            // Token was valid but no session (e.g., link already used once — session was set)
            // Check if we already have a session from this verification
            const existing = localStorage.getItem("sb-session");
            if (existing) {
              setSessionReady(true);
            } else {
              setErrorMessage("Verification complete but no session was created. Try signing in.");
            }
          }
        });
    } else {
      // No token_hash — check if already verified (user opened this URL manually or returned)
      const existing = localStorage.getItem("sb-session");
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (parsed?.access_token) {
            setSessionReady(true);
            return;
          }
        } catch {
          // ignore
        }
      }
      setErrorMessage("No verification token found. Please click the link in your email.");
    }
  }, []);


  return (
      <div className={style.verifyContainer}>
        <div className={style.verifyCard}>
          <img src={logoIcon} className={style.logoImg} alt="NTUConnect Logo" />
          <h2 className={style.brand}>NTUConnect</h2>
        
        {!errorMessage ? (
          <>
            <div className={style.successWrapper}>
              <svg className={style.circleSvg} viewBox="0 0 52 52">
                <circle className={style.circle} cx="26" cy="26" r="22" />
                <path className={style.check} d="M14 27 l8 8 l16 -16" />
              </svg>
            </div>
            <h3>Email Verified!</h3>
            <p className={style.message}>
              Your email has been confirmed. Let's set up your profile.
            </p>
          </>
        ) : (
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ color: '#ff4d4f' }}>Verification Required</h3>
            <p className={style.message} style={{ color: '#ff4d4f' }}>{errorMessage}</p>
          </div>
        )}

        <button
          className={style.resendBtn}
          onClick={() => navigate(errorMessage ? "/auth" : "/profile")}
          disabled={!errorMessage && !sessionReady}
        >
          {sessionReady ? (
            <>
              Complete Profile <span className={style.arrow}>→</span>
            </>
          ) : errorMessage ? (
            "Go back to Login"
          ) : (
            "Setting up session..."
          )}
        </button>
      </div>
    </div>
  );
}

export default ConfirmEmail;
