"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function CaptAdmission() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: '4rem', paddingTop: '12rem', backgroundColor: 'var(--bg-alt)' }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <span className="hero-tag">Professional Training</span>
          <h1 style={{ color: 'var(--primary)' }}>CAPT Computer Training</h1>
          <p style={{ margin: '0 auto', color: 'var(--text-muted)' }}>Advanced certificate programs for computing and specialized digital arts.</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '3.5rem', borderRadius: '1.5rem', border: '1px solid var(--border-light)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid var(--bg-alt)', paddingBottom: '1rem' }}>Admission Form</h2>
            <form style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                <input type="text" placeholder="Enter full name" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contact Number</label>
                <input type="tel" placeholder="+91 0000000000" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email ID</label>
                <input type="email" placeholder="example@email.com" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Selected Program</label>
                <select style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', background: 'white' }} required>
                   <option value="">Choose a Program...</option>
                   <option value="basic">Basic Computing (DCA)</option>
                   <option value="dtp">Desktop Publishing (DTP)</option>
                   <option value="hardware">Computer Hardware Maintenance</option>
                   <option value="multimedia">Multimedia & Animation</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Address</label>
                <textarea rows={3} placeholder="Mailing address" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', resize: 'vertical' }}></textarea>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                   Submit Enrollment Application <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: '6rem' }}>
        <div className="container">
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Govt. Certified</h4>
                <p>Training provided by Kerala State Electronics Development Corporation (KELTRON) and similar institutions.</p>
             </div>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Practical Sessions</h4>
                <p>Majority of the curriculum is focused on hands-on practical experience in our labs.</p>
             </div>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Expert Faculty</h4>
                <p>Experienced mentors ensure every student masters the fundamentals and advanced tech.</p>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
