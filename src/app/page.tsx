"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, ShieldCheck, Brain, Menu, X, Phone,
  BookOpen, Award, Users, ChevronRight, Play
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Hero */}


      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">Educate. Innovate. Lead.</div>
            <h1>Turn Your Ambition into <i>Achievement</i></h1>
            <p>Empowering students with world-class education, innovation, and global opportunities.</p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/course" className="btn btn-primary">
                Apply Now 
              </Link>
              <Link href="#about" className="btn" style={{ color: 'var(--text-dark)' }}>
                <Play size={18} style={{ marginRight: '0.5rem' }} /> Explore Campus
              </Link>
            </div>
          </div>
          <div className="hero-images">
            <img src="/How to effectively organize small groups in classes (opinion).jfif" alt="University Campus" className="hero-img-1" />
            <img src="/Premium Photo _ Young multiethnic students using computer inside university classroom.jpeg" alt="Students" className="hero-img-2" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-item">
            <h3>99%</h3>
            <p>Our Success Rate</p>
          </div>
          <div className="avatars">
            <img src="/Neutral Abstract Background – Beige Organic Shapes.jpeg" className="avatar" alt="User 1"/>
            <img src="/Neutral Abstract Background – Beige Organic Shapes.jpeg" className="avatar" alt="User 2"/>
            <img src="/Neutral Abstract Background – Beige Organic Shapes.jpeg" className="avatar" alt="User 3"/>
            <span className="avatar-text">30K+ Total Students</span>
          </div>
        </div>
      </section>

      {/* Dark Split Section */}
      <section className="bg-primary split-section-wrapper" style={{ padding: '8rem 0' }}>
        <div className="container split-section">
          <div className="split-images">
            <img 
              src="/Sewing fashion designer constructor work on the creation of clothes a specialist designs closet items creates drawings and patterns technical implementation of fashion ideas _ Premium AI-generated image.jpeg" 
              alt="Graduation" 
            />
            <img 
              src="/office-desk-5954672_1280.jpg" 
              alt="Students cheering" 
            />
          </div>
          <div className="split-content">
            <span style={{ display: 'inline-block', padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '2rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'white' }}>
              SINCE 1999
            </span>
            <h2>The right opportunity can turn dreams into limitless potential.</h2>
            <p>Founded in 1999, MICROTECH CENTER is a community-driven institution renowned for its unique contributions to technical and vocational education.</p>
            <div className="split-stats">
              <div>
                <h3>30%</h3>
                <p>Daily growing students are still grinding.</p>
              </div>
              <div>
                <h3>95%</h3>
                <p>They are in a job related to their field of study.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="container">
          <div className="features-container">
            <div className="features-header">
              <span className="hero-tag">Why Choose Us</span>
              <h2>One of the largest, most diverse institutions in the Region</h2>
              <p>Home to students from every corner, fostering diversity, inclusion, and world-class academic excellence.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><BookOpen size={48} strokeWidth={1.5} /></div>
                <h3>Inspiring Student Life</h3>
                <p>We have focused on generating new knowledge & promoting inclusive environments.</p>
                <Link href="#" className="read-more">Read More ↗</Link>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Award size={48} strokeWidth={1.5} /></div>
                <h3>Education Affordability</h3>
                <p>We have focused on generating new knowledge & promoting affordable learning paths.</p>
                <Link href="#" className="read-more">Read More ↗</Link>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Users size={48} strokeWidth={1.5} /></div>
                <h3>Core-level Academics</h3>
                <p>We have focused on generating new knowledge & promoting hands-on skill development.</p>
                <Link href="#" className="read-more">Read More ↗</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="partners-section" style={{ padding: '4rem 0', backgroundColor: '#fdfdfd' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="features-header" style={{ marginBottom: '3.5rem' }}>
            <span className="hero-tag">Authorized Partners</span>
            <h2 style={{ fontSize: '2.5rem' }}>Our Accredited Providers</h2>
            <p>We are proud to collaborate with leading government and private institutions to deliver world-class training.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <Link href="/lbsadmission" style={{ textDecoration: 'none' }}>
              <div className="feature-card" style={{ padding: '2rem', height: '100%', borderColor: 'var(--border-light)', background: 'white' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Building2 size={40} strokeWidth={1} /></div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>LBS State Centre</h4>
                <p style={{ fontSize: '0.9rem' }}>Official LBS Skill Development Centre providing over 70 government-certified technical and vocational programs.</p>
              </div>
            </Link>

            <Link href="/captadmission" style={{ textDecoration: 'none' }}>
              <div className="feature-card" style={{ padding: '2rem', height: '100%', borderColor: 'var(--border-light)', background: 'white' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><ShieldCheck size={40} strokeWidth={1} /></div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>KERALA CAPT</h4>
                <p style={{ fontSize: '0.9rem' }}>Authorized center for the Kerala State Centre for Advanced Printing & Training, offering elite professional computing diplomas.</p>
              </div>
            </Link>

            <Link href="/gamaadmission" style={{ textDecoration: 'none' }}>
              <div className="feature-card" style={{ padding: '2rem', height: '100%', borderColor: 'var(--border-light)', background: 'white' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Brain size={40} strokeWidth={1} /></div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>GAMA ABACUS</h4>
                <p style={{ fontSize: '0.9rem' }}>The region's leading authorized Gama Abacus training provider, focusing on cognitive development and mental arithmetic.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Voices */}

      <section className="testimonials" style={{ paddingBottom: '6rem' }}>
         <div className="container">
            <div className="features-header" style={{ marginBottom: '4rem' }}>
              <span className="hero-tag" style={{ border: 'none', background: 'white', padding: '0' }}>Testimonials</span>
              <h2>Voices From Our Global Community</h2>
            </div>
            
            <div className="testimonials-grid" style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '3.5rem 3rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                 <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', marginBottom: '3rem', fontSize: '1.25rem', lineHeight: 1.8 }}>
                   "Studying here allowed me to connect with students from different cultures while gaining a strong academic foundation. The global exposure has truly shaped my view."
                 </p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url("/Neutral Abstract Background – Beige Organic Shapes.jpeg")', backgroundSize: 'cover' }}></div>
                   <div>
                     <h4 style={{ color: 'white', margin: 0, fontSize: '1rem', paddingBottom: '0.2rem' }}>Leslie Alexander</h4>
                     <div style={{ display: 'flex', color: '#ffb800', gap: '0.25rem', fontSize: '0.8rem' }}>
                       <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                     </div>
                   </div>
                 </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ background: 'white', border: '1px solid var(--border-light)', padding: '2.5rem', borderRadius: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    "The faculty support and hands-on learning approach helped me grow both academically and personally."
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url("/Neutral Abstract Background – Beige Organic Shapes.jpeg")', backgroundSize: 'cover' }}></div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>Jacob Jones</h4>
                      <div style={{ display: 'flex', color: '#ffb800', gap: '0.25rem', fontSize: '0.8rem' }}>
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ background: 'white', border: '1px solid var(--border-light)', padding: '2rem', borderRadius: '1.5rem', flex: 1 }}>
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                      "A truly global university that prepares you for real-world challenges."
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url("/Neutral Abstract Background – Beige Organic Shapes.jpeg")', backgroundSize: 'cover' }}></div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Ralph Edwards</h4>
                        <div style={{ display: 'flex', color: '#ffb800', gap: '0.25rem', fontSize: '0.7rem' }}>
                          <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         </div>
      </section>

      {/* CTA Box */}
      <section className="cta-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-box">
            <h2>Start Your Journey<br/>Toward a Brighter Future.</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', color: 'var(--text-muted)' }}>
              Join a diverse, forward-thinking academic community committed to excellence, innovation, and global opportunity.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Apply Now 
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
