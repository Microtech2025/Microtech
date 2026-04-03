"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Building2, ShieldCheck, Brain } from "lucide-react";

export default function About() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: '4rem', paddingTop: '12rem', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <h1 style={{ color: 'white' }}>About MicroTech Center</h1>
          <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>Empowering the future through excellence in technology education and infrastructure services since 1999.</p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--bg-color)' }}>
        <div className="container split-section">
          <div className="split-images">
            <img src="/micro-tech-center.jpg.png" alt="MicroTech Building" style={{ height: '400px', objectFit: 'cover' }} />
          </div>
          <div>
            <span className="hero-tag">Our History</span>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '2.5rem' }}>A Legacy of Learning</h2>
            <p>
              Founded in 1999 by Jenny K Paulose, Micro Tech Center was established with a singular vision: to bridge the digital divide by providing accessible, high-quality computer education to the community of Perambra, Kozhikode.
            </p>
            <p>
              Over the past two decades, we have grown from a modest computer training institute into a comprehensive educational hub and technology service provider. Today, we stand as a trusted pillar in the region, recognized for our commitment to excellence and innovation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-alt" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="features-header">
            <h2>Our Core Pillars</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Building2 size={40} /></div>
              <h3 style={{ color: 'var(--primary)' }}>Academic Excellence</h3>
              <p>We partner with premier government institutions like LBS Skill Centre and CAPT to offer certified, industry-standard courses.</p>
            </div>
            <div className="feature-card">
              <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><ShieldCheck size={40} /></div>
              <h3 style={{ color: 'var(--primary)' }}>Practical Expertise</h3>
              <p>Our Micro Computers division ensures students learn on state-of-the-art hardware while providing top-tier IT services to the community.</p>
            </div>
            <div className="feature-card">
              <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}><Brain size={40} /></div>
              <h3 style={{ color: 'var(--primary)' }}>Holistic Growth</h3>
              <p>Through programs like Gama Abacus and Fashion Designing, we cater to creative and cognitive development beyond traditional IT.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '6rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="hero-tag">Credentials</span>
            <h2>Recognized & Authorized</h2>
            <p>Our academic programs are backed by prestigious authorizations and state-level partnerships.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
             <div style={{ padding: '2rem', borderLeft: '4px solid var(--accent)', background: 'var(--bg-subtle)', borderRadius: '0 1rem 1rem 0' }}>
               <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>LBS State Centre</h4>
               <p style={{ fontSize: '0.95rem' }}>We are an official LBS Skill Development Centre, authorized by the State Centre for Science and Technology, Govt. of Kerala.</p>
             </div>
             <div style={{ padding: '2rem', borderLeft: '4px solid var(--accent)', background: 'var(--bg-subtle)', borderRadius: '0 1rem 1rem 0' }}>
               <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Kerala CAPT</h4>
               <p style={{ fontSize: '0.95rem' }}>Authorized training provider for the Kerala State Centre for Advanced Printing and Training under the Higher Education Dept.</p>
             </div>
             <div style={{ padding: '2rem', borderLeft: '4px solid var(--accent)', background: 'var(--bg-subtle)', borderRadius: '0 1rem 1rem 0' }}>
               <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Authorized Gama Centre</h4>
               <p style={{ fontSize: '0.95rem' }}>The region's primary authorized training partner for Gama Abacus, specializing in advanced mental arithmetic programs.</p>
             </div>
          </div>
        </div>
      </section>

      <section className="cta-section" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="cta-box" style={{ background: 'var(--primary)', color: 'white' }}>
            <h2 style={{ color: 'white' }}>Ready to Start Your Journey?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Join our community of over 30,000 successful students. Enroll in one of our diverse programs today.</p>
            <Link href="/course" className="btn btn-white">
              Explore Our Courses <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
