import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="logo">
                            <span className="logo-icon">🏥</span>
                            <span>HealthSync</span>
                        </div>
                        <p>Advancing medical connectivity with professional excellence.</p>
                    </div>

                    <div className="footer-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/doctors">Find Doctors</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h3>Legal</h3>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h3>Contact Us</h3>
                        <p>Email: support@healthsync.com</p>
                        <p>Phone: +1 (555) 123-4567</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} HealthSync Professional. All rights reserved.</p>
                    <div className="certified-badge">
                        <span>✓ Certified Platform</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
