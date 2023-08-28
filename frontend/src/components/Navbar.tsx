import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__branding">
                <Link to={`/`}>TypeScript Quiz App</Link>
            </div>
            <ul className="navbar__menu">
                <li className="navbar__item">
                    <Link to={`/register`} className="navbar__link">Register</Link>
                </li>
                <li className="navbar__item">
                    <Link to={`/login`} className="navbar__link">Login</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;