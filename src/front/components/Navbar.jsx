import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const isAuthenticated = Boolean(sessionStorage.getItem("access_token"));

	const logout = () => {
		sessionStorage.removeItem("access_token");
		navigate("/login", { replace: true });
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Mi cuenta</span>
				</Link>
				<div className="ml-auto">
					{isAuthenticated ? (
						<>
							<Link className="btn btn-outline-primary me-2" to="/private">Área privada</Link>
							<button className="btn btn-primary" onClick={logout}>Cerrar sesión</button>
						</>
					) : (
						<>
							<Link className="btn btn-outline-primary me-2" to="/login">Iniciar sesión</Link>
							<Link className="btn btn-primary" to="/signup">Crear cuenta</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};