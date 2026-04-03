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

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="nav-container">
            <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img src="/Microtech/mt_transparent.png" alt="MicroTech Logo" style={{ height: '40px', objectFit: 'contain' }} />
              <span className="d-none d-sm-block" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>MICROTECH</span>
            </Link>

            <ul className="nav-links" style={{ display: mobileMenuOpen ? 'flex' : '' }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/course">Courses</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>

            <div className="nav-actions" style={{ display: 'flex', gap: '1rem' }}>
              <a href="tel:+919447332451" className="btn btn-outline" style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
                <Phone size={16} /> +91 9447332451
              </a>
            </div>
            
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
               {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
      <style jsx global>{`
        .navbar.scrolled .nav-container {
           box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        @media (max-width: 900px) {
          .nav-links {
             position: absolute;
             top: 80px;
             left: 5%;
             width: 90%;
             background: white;
             padding: 2rem;
             border-radius: 1.5rem;
             flex-direction: column;
             box-shadow: 0 10px 40px rgba(0,0,0,0.1);
             display: none;
          }
          .mobile-toggle {
            display: block !important;
            padding-right: 0.5rem;
          }
          .nav-actions {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
