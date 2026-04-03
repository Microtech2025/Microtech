"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: '4rem', paddingTop: '12rem', backgroundColor: 'var(--bg-alt)' }}>
        <div className="container" style={{ display: 'block', textAlign: 'center' }}>
          <span className="hero-tag">Contact Us</span>
          <h1>Get in <span style={{ color: 'var(--primary)' }}>Touch</span></h1>
          <p style={{ margin: '0 auto', maxWidth: '600px', color: 'var(--text-muted)' }}>
            We're here to answer any questions about our courses, PC services, or institutional partnerships.
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--bg-color)', paddingTop: 0 }}>
        <div className="container">
          <div className="split-section" style={{ alignItems: 'flex-start' }}>
            
            <div style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Send Us a Message</h2>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="First Name" style={{ flex: 1, padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
                  <input type="text" placeholder="Last Name" style={{ flex: 1, padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
                </div>
                <input type="email" placeholder="Email Address" style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} required />
                <input type="tel" placeholder="Phone Number" style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)' }} />
                <textarea placeholder="How can we help you?" rows={5} style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-light)', fontFamily: 'var(--font-body)', resize: 'vertical' }} required></textarea>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Message</button>
              </form>
            </div>

            <div>
               <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Contact Information</h2>
               <p style={{ marginBottom: '3rem' }}>Our administration office and technical service center are centrally located. Contact us during working hours for immediate assistance.</p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', height: 'fit-content' }}>
                     <MapPin size={24} />
                   </div>
                   <div>
                     <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Location</h4>
                     <p>Main Road, Perambra<br/>Kozhikode, Kerala 673525</p>
                   </div>
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', height: 'fit-content' }}>
                     <Phone size={24} />
                   </div>
                   <div>
                     <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Phone</h4>
                     <p><a href="tel:+919447332451" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>+91 9447332451</a></p>
                   </div>
                 </div>

                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', height: 'fit-content' }}>
                     <Mail size={24} />
                   </div>
                   <div>
                     <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Email</h4>
                     <p><a href="mailto:microtechcenter.in@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>microtechcenter.in@gmail.com</a></p>
                   </div>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ background: 'var(--bg-alt)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', height: 'fit-content' }}>
                     <Clock size={24} />
                   </div>
                   <div>
                     <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Working Hours</h4>
                     <p>Mon - Sat: 9:00 AM - 6:00 PM<br/>Sunday: Closed</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
