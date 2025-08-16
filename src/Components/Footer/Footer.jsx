import React from 'react'
import Menu from '../Menu/Menu';
import './Footer.css'
import SocialLinks from '../SocialLinks/SocialLinks';
import { Link } from 'react-router-dom';
const Footer = () => {
        let currentYear = new Date().getFullYear();
        const footerMenu1 = {
                menuTitle: "Useful links",
                menuLinks: [
                        {
                        url: '/web-assessiblity',
                        title: 'Web Accessibility'
                        },
                        {
                        url: '/editorial-policy',
                        title: 'Editorial policy'
                        },
                ]
        };

        const footerMenu2 = {
                menuTitle: "Other sites",
                menuLinks: [
                        {
                        url: '/',
                        title: 'Wonderful Copenhagen'
                        },
                        {
                        url: '/',
                        title: 'Cruise Denmark – Copenhagen and beyond'
                        },
                         {
                        url: '/',
                        title: 'Copenhagen Convention Bureau'
                        },
                         {
                        url: '/',
                        title: 'Travel Trade'
                        },
                         {
                        url: '/',
                        title: 'Copenhagen Card'
                        },
                ]
        };

        const footerMenu3 = {
                menuTitle: "Contact",
                menuLinks: [
                        {
                        url: '/contact',
                        title: 'Contact VisitCopenhagen'
                        },
                ]
        };        
      
  return (
    <div className='footer-wrapper'>
        <SocialLinks/>
      <div className="container">
        <div className='row'>
                <div className="col-sm-3">
                        <Menu menuTitle={footerMenu1.menuTitle} menulinks={footerMenu1.menuLinks} className="footer-menu footer-menu1"/>
                        </div>
                <div className="col-sm-3">
                        <Menu menuTitle={footerMenu2.menuTitle} menulinks={footerMenu2.menuLinks} className="footer-menu footer-menu2"/>
                        </div>
                <div className="col-sm-3">
                        <Menu menuTitle={footerMenu3.menuTitle} menulinks={footerMenu3.menuLinks} className="footer-menu  footer-menu3"/>
                </div>
        </div>
        <div className="footer-bottom d-flex gap-4">
                <div className="copyright-text">
                        <p>Visit Copenhagen © {currentYear}</p>
                </div>
                <Link to='/'>Data Protection Notice</Link>
        </div>

      </div>
    </div>
  )
}

export default Footer
