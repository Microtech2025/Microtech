"use client";

import React from "react";
import { ChevronRight, Brain, Calculator, Trophy } from "lucide-react";

export default function GamaAdmission() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: '4rem', paddingTop: '12rem', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <h1 style={{ color: 'white' }}>Gama Abacus Admission</h1>
          <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>Unlocking the potential of young minds through mental arithmetic and abacus training.</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          <div className="form-container">
            <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', color: 'var(--primary)' }}>Enroll Now</h2>
            <form style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Student Name</label>
                <input type="text" placeholder="Full name of student" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', outline: 'none' }} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', gridColumn: '1 / -1' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Parent/Guardian Name</label>
                  <input type="text" placeholder="Authorized guardian" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Student Age</label>
                  <input type="number" placeholder="Years" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', outline: 'none' }} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Contact Number</label>
                <input type="tel" placeholder="+91 0000000000" style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', outline: 'none' }} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                   Register for Inquiry <ChevronRight size={18} />
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
                <div className="feature-icon" style={{ background: 'var(--bg-color)', margin: '0 auto 1.5rem' }}><Brain size={32} /></div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Cognitive Boost</h4>
                <p>Enhances concentration, memory, and spatial ability in children aged 5 to 15.</p>
             </div>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ background: 'var(--bg-color)', margin: '0 auto 1.5rem' }}><Calculator size={32} /></div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Math Excellence</h4>
                <p>Removes the fear of numbers by transforming mental math into a fun, rapid game.</p>
             </div>
             <div className="feature-card" style={{ textAlign: 'center' }}>
                <div className="feature-icon" style={{ background: 'var(--bg-color)', margin: '0 auto 1.5rem' }}><Trophy size={32} /></div>
                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Certified Mentors</h4>
                <p>Authorized Gama training center with world-class certified mental arithmetic coaches.</p>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
