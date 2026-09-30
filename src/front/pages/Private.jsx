import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        const token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/login", { replace: true });
            return () => { active = false; };
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/private`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    sessionStorage.removeItem("access_token");
                    navigate("/login", { replace: true });
                    return;
                }
                if (active) setUser(data.user);
            })
            .catch(() => {
                if (active) setError("No se pudo validar la sesión. Comprueba la conexión e inténtalo de nuevo.");
            });

        return () => { active = false; };
    }, [navigate]);

    if (error) {
        return (
            <main className="private-page">
                <div className="alert alert-warning" role="alert">
                    {error} <button className="btn btn-link p-0" onClick={() => window.location.reload()}>Reintentar</button>
                </div>
            </main>
        );
    }

    if (!user) {
        return <main className="private-page" aria-live="polite">Validando sesión...</main>;
    }

    return (
        <main className="private-page">
            <p className="auth-eyebrow">Sesión verificada</p>
            <h1>Bienvenido</h1>
            <p>Has iniciado sesión como <strong>{user.email}</strong>.</p>
        </main>
    );
};