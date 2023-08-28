import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__branding">
            </div>
            <ul className="navbar__menu">
                <li>
                    <Link to={`/`}>Home</Link>
                </li>
                <li>
                    <Link to={`/register`}>Register</Link>
                </li>
                <li>
                    <Link to={`/login`}>Login</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;