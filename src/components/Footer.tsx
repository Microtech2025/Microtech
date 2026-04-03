import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', textDecoration: 'none' }}>
              <img src="/Microtech/mt_transparent.png" alt="MicroTech Logo" style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0) invert(1)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'white', letterSpacing: '0.05em', whiteSpace: 'nowrap', flexShrink: 0 }}>MICROTECH</span>
            </div>
            <p>Join thousands of students experiencing stress-free learning with our well-structured curriculum and expert faculty.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="#" style={{ color: 'white', opacity: 0.8 }}><i className="fab fa-facebook-f"></i></a>
              <a href="#" style={{ color: 'white', opacity: 0.8 }}><i className="fab fa-instagram"></i></a>
              <a href="#" style={{ color: 'white', opacity: 0.8 }}><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 'fit-content' }}>
              <h4>Menu</h4>
              <ul className="footer-links">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About us</Link></li>
                <li><Link href="/course">Courses</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 'fit-content' }}>
              <h4>Admissions</h4>
              <ul className="footer-links">
                <li><Link href="/lbsadmission">LBS Skill Centre</Link></li>
                <li><Link href="/captadmission">CAPT Centre</Link></li>
                <li><Link href="/gamaadmission">Gama Abacus</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Join thousands of students experiencing stress-free tips via email.
            </p>
            <div className="newsletter-input">
              <input type="email" placeholder="Email address" />
              <button>Subscribe ↗</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Microtech. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
