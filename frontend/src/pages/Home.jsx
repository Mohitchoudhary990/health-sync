import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Your Health, <br />
                            <span className="gradient-text">Our Professional Priority</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with world-class medical specialists through a platform designed for modern clinical excellence and patient care.
                        </p>
                        <div className="hero-buttons">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: 'var(--secondary)', border: 'none' }}>
                                        Get Started Today →
                                    </Link>
                                    <Link to="/doctors" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                                        Find Doctors
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="btn btn-secondary btn-lg" style={{ background: 'var(--secondary)', border: 'none' }}>
                                        Go to Dashboard
                                    </Link>
                                    <Link to="/doctors" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                                        Book Appointment
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="floating-card card-1">
                            <span className="icon">🛡️</span>
                            <h4>Quality Standards</h4>
                            <p>Certified clinical excellence and safety protocols.</p>
                        </div>
                        <div className="floating-card card-2">
                            <span className="icon">🩺</span>
                            <h4>Elite Specialists</h4>
                            <p>Access to top-tier board-certified physicians.</p>
                        </div>
                        <div className="floating-card card-3">
                            <span className="icon">📅</span>
                            <h4>Direct Booking</h4>
                            <p>Real-time clinical scheduling.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <p style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: '600', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Platform Excellence</p>
                    <h2 className="section-title">Why Choose HealthSync?</h2>
                    <div style={{ width: '60px', height: '4px', background: 'var(--secondary)', margin: '-2rem auto 3rem', borderRadius: '2px' }}></div>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Find Specialists</h3>
                            <p>Search and filter from hundreds of qualified doctors across various specializations</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Booking</h3>
                            <p>Book appointments in seconds with real-time availability checking</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3>Manage Online</h3>
                            <p>Access your appointments, prescriptions, and medical records anytime, anywhere</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>Your health data is encrypted and protected with industry-standard security</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h3 className="stat-number">500+</h3>
                            <p className="stat-label">Expert Doctors</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-number">10k+</h3>
                            <p className="stat-label">Happy Patients</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-number">25+</h3>
                            <p className="stat-label">Specializations</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-number">24/7</h3>
                            <p className="stat-label">Support</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Get Started?</h2>
                        <p>Join thousands of patients who trust HealthSync for their healthcare needs</p>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Create Free Account
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
