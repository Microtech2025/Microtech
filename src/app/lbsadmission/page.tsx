"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function LbsAdmission() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: '4rem', paddingTop: '12rem', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <h1 style={{ color: 'white' }}>LBS Skill Centre Admission</h1>
          <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>Official registration for Government-certified skill courses through MicroTech Center.</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '3.5rem', borderRadius: '1.5rem', border: '1px solid var(--border-light)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            <h2 style={{ marginBottom: '2rem', borderBottom: '2px solid var(--bg-alt)', paddingBottom: '1rem' }}>Admission Form</h2>
            <form style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                <input type="text" placeholder="Enger your legal name" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mobile Number</label>
                <input type="tel" placeholder="+91 0000000000" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                <input type="email" placeholder="email@example.com" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Desired Course</label>
                <select style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', background: 'white' }} required>
                   <option value="">Select a Course...</option>
                   <option value="diploma">Diploma in Software Engineering</option>
                   <option value="accountancy">Computerized Accountancy (Tally)</option>
                   <option value="multimedia">Multimedia & Graphics</option>
                   <option value="networking">Networking & Hardware</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Current Qualification</label>
                <input type="text" placeholder="SSLC / +2 / Degree" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Submit Application <ChevronRight size={18} />
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
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Course Duration</h4>
                <p>Most LBS courses range from 3 months to 1 year based on the specialization chosen.</p>
             </div>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Certification</h4>
                <p>Certificates are issued directly by LBS State Centre for Science and Technology, Govt. of Kerala.</p>
             </div>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Job Placement</h4>
                <p>Our dedicated placement cell assists students in finding vacancies in established IT firms.</p>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
