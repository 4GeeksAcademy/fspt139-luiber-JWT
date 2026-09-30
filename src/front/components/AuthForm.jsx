import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const AuthForm = ({ isSignup }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const response = await fetch(`${backendUrl}/api/${isSignup ? "signup" : "token"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "No se pudo completar la solicitud.");

            if (isSignup) {
                navigate("/login", { replace: true, state: { registered: true } });
            } else {
                sessionStorage.setItem("access_token", data.access_token);
                navigate("/private", { replace: true });
            }
        } catch (requestError) {
            setError(requestError.message || "No se pudo conectar con el servidor.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-panel">
                <p className="auth-eyebrow">Acceso seguro</p>
                <h1>{isSignup ? "Crear cuenta" : "Iniciar sesión"}</h1>
                <p className="text-secondary">
                    {isSignup ? "Regístrate con tu correo electrónico." : "Ingresa con tu cuenta para continuar."}
                </p>
                {!isSignup && location.state?.registered && (
                    <div className="alert alert-success" role="status">Cuenta creada. Ya puedes iniciar sesión.</div>
                )}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Correo electrónico</label>
                        <input
                            className="form-control"
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input
                            className="form-control"
                            id="password"
                            type="password"
                            autoComplete={isSignup ? "new-password" : "current-password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                        {submitting ? "Enviando..." : isSignup ? "Registrarme" : "Entrar"}
                    </button>
                </form>
                <p className="auth-switch">
                    {isSignup ? "¿Ya tienes cuenta? " : "¿Aún no tienes cuenta? "}
                    <Link to={isSignup ? "/login" : "/signup"}>
                        {isSignup ? "Inicia sesión" : "Regístrate"}
                    </Link>
                </p>
            </section>
        </main>
    );
};
