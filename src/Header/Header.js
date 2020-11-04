import "./Header.scss";
function Header(props) {
    return (
        <header className="header deep-blue-bg-2">
            <span className="header__icon"></span>
            <a className="header__title" href="#">{props.title}</a>
        </header>
    );
}

export default Header;