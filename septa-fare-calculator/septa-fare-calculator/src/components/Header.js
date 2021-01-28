import React from 'react';
import septaLogo from '../SEPTA.svg';


const Header = (props) => (
	<div className="header">
		<div className="header__container">
			<img src={septaLogo} className="header__logo" alt="Septa Logo" />
			<h1 className="header__title">{props.title}</h1>
		</div>
	</div>
);

Header.defaultProps = {
	title: 'Regional Rail Fares'
};

export default Header;