import React, { useState, useEffect } from 'react';
import { project } from '../data/nitaara.data';

export interface EnquiryPrefill {
  floor?: number;
  unitNo?: string;
  label?: string;
  price?: string;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'floorplan' | 'sitevisit';
  prefill?: EnquiryPrefill | null;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'floorplan',
  prefill,
}) => {
  const [mode, setMode] = useState<'floorplan' | 'sitevisit'>(initialMode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setIsSubmitted(false);
  }, [initialMode, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unitDesc = prefill?.unitNo
    ? `Floor ${prefill.floor || ''} · Flat ${prefill.unitNo} (${prefill.label || 'Residence'})${prefill.price ? ' - ' + prefill.price : ''}`
    : 'Nitaara Tower Nigdi Pradhikaran (3 & 4 BHK Luxury Residences)';

  const defaultWhatsappMessage =
    mode === 'floorplan'
      ? `Hello Nitaara Tower! I am interested in requesting the official floor plan & brochure for ${unitDesc}. My name is ${name || 'Buyer'} (Phone: ${phone || 'contact me'}).`
      : `Hello Nitaara Tower! I would like to request a site visit for Nitaara Tower, Bhakti Shakti Chowk, Nigdi Pradhikaran. Interested in: ${unitDesc}. Preferred Date: ${date || 'Soon'}. Name: ${name || 'Buyer'} (Phone: ${phone || 'contact me'}).`;

  const whatsappUrl = `https://wa.me/918600612808?text=${encodeURIComponent(
    defaultWhatsappMessage
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  return (
    <div
      className="enquiry-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(12, 14, 28, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="enquiry-modal-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(34, 33, 31, 0.96)',
          border: '1px solid rgba(197, 155, 60, 0.4)',
          borderRadius: '8px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(197, 155, 60, 0.1)',
          padding: '28px',
          position: 'relative',
          color: '#f4efe6',
          fontFamily: 'Tw Cen MT, Roboto, sans-serif',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          className="enquiry-modal-close"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'rgba(244, 239, 230, 0.6)',
            fontSize: '22px',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✕
        </button>

        {/* Tab Toggle */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('floorplan');
              setIsSubmitted(false);
            }}
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: mode === 'floorplan' ? '#c59b3c' : 'rgba(244, 239, 230, 0.5)',
              borderBottom: mode === 'floorplan' ? '2px solid #c59b3c' : 'none',
              cursor: 'pointer',
            }}
          >
            Request Floor Plan
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('sitevisit');
              setIsSubmitted(false);
            }}
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: mode === 'sitevisit' ? '#c59b3c' : 'rgba(244, 239, 230, 0.5)',
              borderBottom: mode === 'sitevisit' ? '2px solid #c59b3c' : 'none',
              cursor: 'pointer',
            }}
          >
            Request for Site Visit
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(197, 155, 60, 0.15)',
                border: '2px solid #c59b3c',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 16px',
                fontSize: '24px',
                color: '#c59b3c',
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: '20px', color: '#c59b3c', marginBottom: '8px' }}>
              Enquiry Received Successfully
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(244, 239, 230, 0.8)',
                lineHeight: 1.6,
                maxWidth: '400px',
                margin: '0 auto 20px',
              }}
            >
              Thank you, <strong>{name || 'valued customer'}</strong>! Our senior relationship
              manager for Nitaara Tower will connect with you regarding {unitDesc}.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                <span>Instant WhatsApp Connect</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#f4efe6',
                  fontSize: '12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#c59b3c',
                  marginBottom: '6px',
                }}
              >
                Residence of Interest
              </label>
              <div
                style={{
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(197, 155, 60, 0.3)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#f4efe6',
                }}
              >
                {unitDesc}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label
                  htmlFor="enq-name"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(244, 239, 230, 0.7)',
                    marginBottom: '4px',
                  }}
                >
                  Your Name *
                </label>
                <input
                  id="enq-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="enq-phone"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(244, 239, 230, 0.7)',
                    marginBottom: '4px',
                  }}
                >
                  Phone Number (+91) *
                </label>
                <input
                  id="enq-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: mode === 'sitevisit' ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label
                  htmlFor="enq-email"
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(244, 239, 230, 0.7)',
                    marginBottom: '4px',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="enq-email"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '13px',
                  }}
                />
              </div>

              {mode === 'sitevisit' && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(244, 239, 230, 0.7)',
                      marginBottom: '4px',
                    }}
                  >
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '13px',
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(244, 239, 230, 0.7)',
                  marginBottom: '4px',
                }}
              >
                Notes or Specific Questions
              </label>
              <textarea
                rows={2}
                placeholder="Inquire about payment schedules, floor rise policy, or bank loan sanctions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '13px',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  background: '#c59b3c',
                  border: 'none',
                  color: '#22211f',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                {isSubmitting ? 'Sending Request...' : mode === 'floorplan' ? 'Send Floor Plan Request' : 'Confirm Site Visit'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat directly on WhatsApp"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 16px',
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                <span>WhatsApp</span>
              </a>
            </div>

            <div
              style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '11px',
                color: 'rgba(244, 239, 230, 0.45)',
                lineHeight: 1.5,
              }}
            >
              MahaRERA: <strong>{project.rera.number}</strong> · Direct Helpline:{' '}
              <a href="tel:+918600612808" style={{ color: '#c59b3c', textDecoration: 'none' }}>
                +91 8600612808
              </a>
              <br />
              Location: Bhakti Shakti Chowk, Nigdi Pradhikaran, Pune 411044.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

