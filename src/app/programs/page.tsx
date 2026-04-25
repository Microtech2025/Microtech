"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Laptop, Calculator, Scissors, ChevronRight } from "lucide-react";

export default function Programs() {
  return (
    <>
      {/* Header matching screenshot */}
      <section className="hero" style={{ 
        paddingBottom: '4rem', 
        paddingTop: '12rem', 
        backgroundColor: '#1a3a34', 
        color: 'white' 
      }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800 }}>Academic Programs</h1>
          <p style={{ margin: '1.5rem auto 0', color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', maxWidth: '800px' }}>
            Discover certified courses tailored for career success and personal growth.
          </p>
        </div>
      </section>

      {/* Program Cards Grid */}
      <section style={{ backgroundColor: '#f4f7f6', padding: '8rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {/* LBS Skill Centre */}
            <div style={{ background: 'white', borderRadius: '2rem', padding: '2.5rem 1.5rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#1a3a34', marginBottom: '2.5rem' }}>
                <GraduationCap size={64} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3a34', marginBottom: '1.5rem' }}>
                LBS Skill Centre <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: 500 }}>(Govt. of Kerala)</span>
              </h3>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                Choose from over 70 state-certified skill development programs encompassing IT, Management, and Technical trades. Perfect for higher education and job readiness.
              </p>
              <Link href="/lbsadmission" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '1.25rem', 
                background: '#1a3a34', 
                color: 'white', 
                borderRadius: '1.25rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}>
                Apply for LBS <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>

            {/* CAPT Computer Courses */}
            <div style={{ background: 'white', borderRadius: '2rem', padding: '4rem 2.5rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#1a3a34', marginBottom: '2.5rem' }}>
                <Laptop size={64} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3a34', marginBottom: '1.5rem' }}>
                CAPT Computer Courses
              </h3>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                Master fundamental to advanced computing with comprehensive modules in programming, web architecture, and desktop publishing.
              </p>
              <Link href="/captadmission" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '1.25rem', 
                background: '#1a3a34', 
                color: 'white', 
                borderRadius: '1.25rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}>
                Apply for CAPT <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>

            {/* Gama Abacus Coaching */}
            <div style={{ background: 'white', borderRadius: '2rem', padding: '4rem 2.5rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#1a3a34', marginBottom: '2.5rem' }}>
                <Calculator size={64} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a3a34', marginBottom: '1.5rem' }}>
                Gama Abacus Coaching
              </h3>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                Authorized Gama Abacus center providing specialized mental arithmetic training to enhance focus, memory, and cognitive skills for younger students.
              </p>
              <Link href="/gamaadmission" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '1.25rem', 
                background: '#1a3a34', 
                color: 'white', 
                borderRadius: '1.25rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}>
                Apply for Abacus <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>

            {/* Fashion Designing */}
            <div style={{ background: 'white', borderRadius: '2rem', padding: '4rem 2.5rem', textAlign: 'center', boxShadow: '0 15px 40px rgba(0,0,0,0.04)' }}>
              <div style={{ color: '#1a3a34', marginBottom: '2.5rem' }}>
                <Scissors size={64} strokeWidth={1} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a3a34', marginBottom: '1.5rem' }}>
                Fashion Designing
              </h3>
              <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                Unleash your creativity with our intensive fashion design programs covering garment construction, professional illustration, and boutique management.
              </p>
              <Link href="/contact" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '1.25rem', 
                background: '#1a3a34', 
                color: 'white', 
                borderRadius: '1.25rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}>
                Request Info <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: '#f4f7f6', paddingBottom: '10rem' }}>
        <div className="container">
          <div style={{ background: 'white', padding: '6rem 2rem', borderRadius: '3rem', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1a3a34', marginBottom: '1.5rem' }}>Need Guidance?</h2>
            <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
              Our academic counselors are here to help you choose the right path for your specific career goals.
            </p>
            <Link href="/contact" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '1.5rem 4rem', 
              background: '#1a3a34', 
              color: 'white', 
              borderRadius: '1.5rem',
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}>
              Contact an Advisor <ChevronRight size={24} style={{ marginLeft: '0.75rem' }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
