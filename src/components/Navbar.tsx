"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="nav-container">
            <Link href="/" className="logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img src="/Microtech/mt_transparent.png" alt="MicroTech Logo" style={{ height: '40px', objectFit: 'contain' }} />
              <span className="logo-text" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>MICROTECH</span>
            </Link>

            <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <li><Link href="/" onClick={closeMenu}>Home</Link></li>
              <li><Link href="/about" onClick={closeMenu}>About Us</Link></li>
              <li><Link href="/course" onClick={closeMenu}>Courses</Link></li>
              <li><Link href="/contact" onClick={closeMenu}>Contact</Link></li>
              <li className="mobile-only-action">
                 <a href="tel:+919447332451" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', color: 'white' }}>
                  <Phone size={16} /> Call Now
                </a>
              </li>
            </ul>

            <div className="nav-actions">
              <a href="tel:+919447332451" className="btn btn-outline">
                <Phone size={16} /> +91 9447332451
              </a>
            </div>
            
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
               {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
      <style jsx global>{`
        .navbar.scrolled .nav-container {
           box-shadow: 0 10px 40px rgba(0,0,0,0.1);
           background: rgba(255, 255, 255, 0.95);
           backdrop-filter: blur(10px);
        }
        
        .mobile-only-action {
          display: none;
          margin-top: 1rem;
        }

        .mobile-toggle {
          display: none;
        }

        @media (max-width: 900px) {
          .logo-text {
            display: none;
          }
          
          .nav-links.mobile-open {
             display: flex !important;
             position: absolute;
             top: calc(100% + 1rem);
             left: 1rem;
             right: 1rem;
             width: auto;
             background: white;
             padding: 2rem;
             border-radius: 1.5rem;
             flex-direction: column;
             box-shadow: 0 20px 50px rgba(0,0,0,0.15);
             gap: 1.5rem;
             animation: slideIn 0.3s ease-out;
             border: 1px solid var(--border-light);
             z-index: 1000;
          }

          .nav-links.mobile-open a.btn-primary {
            color: white !important;
          }

          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .mobile-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
            background: var(--bg-subtle) !important;
            border: none;
            cursor: pointer;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            color: var(--primary);
            transition: all 0.2s;
          }
          
          .mobile-toggle:active {
            transform: scale(0.9);
          }

          .mobile-only-action {
            display: block;
          }
          
          .nav-actions {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
