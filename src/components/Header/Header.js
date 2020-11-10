import "./Header.scss";
import { ShopFilled } from "@ant-design/icons";

function Header(props) {
    return (
        <header className="header">
            <ShopFilled className="header__icon" />
            <a className="header__title" href="/#">{props.title}</a>
        </header>
    );
}

export default Header;