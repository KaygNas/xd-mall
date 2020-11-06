import "./Header.scss";
function Header(props) {
    return (
        <header className="header">
            <span className="header__icon"></span>
            <a className="header__title" href="#">{props.title}</a>
        </header>
    );
}

export default Header;