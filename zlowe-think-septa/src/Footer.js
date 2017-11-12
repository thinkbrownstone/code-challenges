import React from 'react';
import PropTypes from 'prop-types';

const Footer = (props) => {

			return (

    <footer className="navbar-fixed-bottom">
        <div className="container">
          <div className="row">

                   <div className="col-md-4 col-sm-6 col-xs-12">
                     <span className="logo">cre<span className="createorlog4">ART</span>ivity</span>
                   </div>

                   <div className="col-md-4 col-sm-6 col-xs-12">
                       <ul className="menu">
                            <span>Menu</span>
                            <li>
                               <a href="#">Home</a>
                             </li>

                             <li>
                                <a href="./CanvasPage.js">About</a>
                             </li>

                             <li>
                               <a href="#">creART</a>
                             </li>
                        </ul>
                   </div>

                   <div className="col-md-4 col-sm-6 col-xs-12">
                     <ul className="adress">
                           <span>Contact</span>
                           <li>
                              <i className="fa fa-github" aria-hidden="true"></i> <a href="https://github.com/SKornahrens/creARTivity">GitHub</a>
                           </li>
                           <li>
                              <i className="fa fa-map-marker" aria-hidden="true"></i> <a href="#">Adress</a>
                           </li>
                           <li>
                              <i className="fa fa-envelope" aria-hidden="true"></i> <a href="#">Email</a>
                           </li>
                      </ul>
                  </div>


              </div>
           </div>
   </footer>

			);
		};

export default Footer;
