"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Laptop, Calculator, Scissors, ChevronRight, BookOpen, Clock, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DBCourse {
  id: string;
  name: string;
  providers: string[];
  duration: string;
  batch_timings: string;
  status: string;
  image_url?: string;
}

export default function Courses() {
  const [dbCourses, setDbCourses] = useState<DBCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'active')
          .order('name', { ascending: true });

        if (error) throw error;
        setDbCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <>
      {/* Premium Header - Matching Screenshot */}
      <section className="hero" style={{ 
        paddingBottom: '4rem', 
        paddingTop: '12rem', 
        backgroundColor: '#1a3a34', // Deep green from screenshot
        color: 'white' 
      }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 400, marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Academic Programs</h1>
          <p style={{ margin: '0 auto', color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', maxWidth: '800px' }}>
            Discover certified courses tailored for career success and personal growth.
          </p>
        </div>
      </section>

      {/* Main Programs Grid */}
      <section style={{ backgroundColor: '#f4f7f6', padding: '6rem 0' }}>
        <div className="container">
          <div className="features-grid" style={{ gap: '2.5rem' }}>
            {/* LBS Skill Centre */}
            <div className="feature-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              background: 'white', 
              borderRadius: '1.5rem',
              padding: '3rem 2rem',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ color: '#1a3a34', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <GraduationCap size={56} strokeWidth={1.5} />
              </div>
              <h3 style={{ color: '#1a3a34', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem' }}>
                LBS Skill Centre <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>(Govt. of Kerala)</span>
              </h3>
              <p style={{ flex: 1, textAlign: 'center', color: '#555', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2rem' }}>
                Choose from over 70 state-certified skill development programs encompassing IT, Management, and Technical trades. Perfect for higher education and job readiness.
              </p>
              <Link href="/lbsadmission" className="btn btn-primary" style={{ backgroundColor: '#1a3a34', borderRadius: '1rem', padding: '1.2rem', fontWeight: 700 }}>
                Apply for LBS <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>

            {/* CAPT Computer Courses */}
            <div className="feature-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              background: 'white', 
              borderRadius: '1.5rem',
              padding: '3rem 2rem',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ color: '#1a3a34', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Laptop size={56} strokeWidth={1.5} />
              </div>
              <h3 style={{ color: '#1a3a34', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem' }}>
                CAPT Computer Courses
              </h3>
              <p style={{ flex: 1, textAlign: 'center', color: '#555', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2rem' }}>
                Master fundamental to advanced computing with comprehensive modules in programming, web architecture, and desktop publishing.
              </p>
              <Link href="/captadmission" className="btn btn-primary" style={{ backgroundColor: '#1a3a34', borderRadius: '1rem', padding: '1.2rem', fontWeight: 700 }}>
                Apply for CAPT <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>

            {/* Gama Abacus Coaching */}
            <div className="feature-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              background: 'white', 
              borderRadius: '1.5rem',
              padding: '3rem 2rem',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ color: '#1a3a34', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Calculator size={56} strokeWidth={1.5} />
              </div>
              <h3 style={{ color: '#1a3a34', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem' }}>
                Gama Abacus Coaching
              </h3>
              <p style={{ flex: 1, textAlign: 'center', color: '#555', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2rem' }}>
                Authorized Gama Abacus center providing specialized mental arithmetic training to enhance focus, memory, and cognitive skills for younger students.
              </p>
              <Link href="/gamaadmission" className="btn btn-primary" style={{ backgroundColor: '#1a3a34', borderRadius: '1rem', padding: '1.2rem', fontWeight: 700 }}>
                Apply for Abacus <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>
            
            {/* Fashion Designing */}
            <div className="feature-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              background: 'white', 
              borderRadius: '1.5rem',
              padding: '3rem 2rem',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ color: '#1a3a34', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Scissors size={56} strokeWidth={1.5} />
              </div>
              <h3 style={{ color: '#1a3a34', fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.5rem' }}>
                Fashion Designing
              </h3>
              <p style={{ flex: 1, textAlign: 'center', color: '#555', lineHeight: '1.7', fontSize: '1.05rem', marginBottom: '2rem' }}>
                Unleash your creativity with our intensive fashion design programs covering garment construction, professional illustration, and boutique management.
              </p>
              <Link href="/contact" className="btn btn-primary" style={{ backgroundColor: '#1a3a34', borderRadius: '1rem', padding: '1.2rem', fontWeight: 700 }}>
                Request Info <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Supabase Courses Section */}
      {!loading && dbCourses.length > 0 && (
        <section style={{ padding: '6rem 0', backgroundColor: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <span className="hero-tag">Specialized Training</span>
              <h2 style={{ fontSize: '2rem', color: '#1a3a34' }}>All Available Courses</h2>
              <p style={{ maxWidth: '700px', margin: '0 auto' }}>Extended list of professional certifications and vocational training available at our center.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {dbCourses.map((course) => (
                <div key={course.id} className="feature-card" style={{ 
                  borderRadius: '1rem', 
                  padding: '2rem', 
                  border: '1px solid #eee', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem',
                  transition: 'transform 0.3s ease',
                  cursor: 'default'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ padding: '0.75rem', background: '#f0f7f6', borderRadius: '0.75rem', color: '#1a3a34' }}>
                      <BookOpen size={24} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {course.providers.map((p, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: '#eee', borderRadius: '0.3rem', fontWeight: 700, color: '#666' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '1.25rem', color: '#333', marginBottom: '0.5rem', fontWeight: 800 }}>{course.name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> {course.duration}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {course.batch_timings}
                      </div>
                    </div>
                  </div>

                  <Link href="/contact" style={{ 
                    marginTop: 'auto', 
                    textAlign: 'center', 
                    padding: '0.8rem', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #1a3a34', 
                    color: '#1a3a34', 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    Inquire Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guidance Section */}
      <section className="cta-section" style={{ padding: '4rem 0 8rem', backgroundColor: '#f4f7f6' }}>
        <div className="container">
          <div className="cta-box" style={{ 
            background: 'white', 
            padding: '5rem 2rem', 
            borderRadius: '2rem', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            border: 'none',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a3a34', fontWeight: 800 }}>Need Guidance?</h2>
            <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>Our academic counselors are here to help you choose the right path for your specific career goals.</p>
            <Link href="/contact" className="btn btn-primary" style={{ backgroundColor: '#1a3a34', padding: '1.2rem 3rem', borderRadius: '1rem', fontWeight: 700 }}>
              Contact an Advisor <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
