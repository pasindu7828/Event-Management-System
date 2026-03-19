import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import AuthService from '../services/authService';
import EventService from '../services/eventService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100';

const EventPaymentPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [ticketName, setTicketName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: '',
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [confirmPayment, setConfirmPayment] = useState(false);

  const role = (currentUser?.user?.role || currentUser?.role || '').toLowerCase();
  const isStudent = role === 'student';

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await EventService.getEventById(eventId);
        const loaded = response?.data?.event;
        setEvent(loaded);
        if (loaded?.tickets?.length > 0) {
          setTicketName(loaded.tickets[0].name);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  useEffect(() => {
    const loadExistingRegistration = async () => {
      if (!isStudent || !eventId) return;

      try {
        const response = await EventService.getMyRegistrations();
        const existing = (response?.data?.registrations || []).find(
          (item) => item?.event?._id === eventId
        );

        if (existing) {
          setRegistration(existing);
        }
      } catch {
        // Ignore optional prefetch failure and allow normal payment flow.
      }
    };

    loadExistingRegistration();
  }, [eventId, isStudent]);

  const selectedTicket = useMemo(() => {
    if (!event?.tickets?.length) return { name: 'General Admission', price: 0 };
    return event.tickets.find((ticket) => ticket.name === ticketName) || event.tickets[0];
  }, [event, ticketName]);

  const amount = Number(selectedTicket?.price || 0);
  const maskedCard = paymentDetails.cardNumber.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();

  const validatePaymentDetails = () => {
    const cardDigits = paymentDetails.cardNumber.replace(/\D/g, '');

    if (!paymentDetails.bankName.trim()) return 'Bank name is required';
    if (!paymentDetails.cardHolderName.trim()) return 'Card holder name is required';
    if (cardDigits.length !== 16) return 'Card number must contain 16 digits';
    if (!/^\d{2}$/.test(paymentDetails.expiryMonth) || Number(paymentDetails.expiryMonth) < 1 || Number(paymentDetails.expiryMonth) > 12) {
      return 'Expiry month must be between 01 and 12';
    }
    if (!/^\d{2}$/.test(paymentDetails.expiryYear)) return 'Expiry year must be 2 digits (e.g. 28)';
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) return 'CVV must be 3 or 4 digits';
    if (!confirmPayment) return 'Please confirm payment before continuing';

    return '';
  };

  const executePayment = async () => {
    setProcessing(true);
    setError('');
    toast.info('Processing payment...', { position: 'top-right' });

    try {
      const response = await EventService.registerForEvent(eventId, {
        ticketName: selectedTicket?.name,
        paymentMethod: 'card',
        paymentDetails: {
          bankName: paymentDetails.bankName.trim(),
          cardHolderName: paymentDetails.cardHolderName.trim(),
          cardNumber: paymentDetails.cardNumber,
          expiryMonth: paymentDetails.expiryMonth,
          expiryYear: paymentDetails.expiryYear,
          cvv: paymentDetails.cvv,
        },
      });

      if (response?.data?.success) {
        setRegistration(response.data.registration);
        setShowConfirmModal(false);
        toast.success('Payment successful. E-ticket generated!', { position: 'top-right' });
      } else {
        setError(response?.data?.message || 'Payment failed');
        toast.error(response?.data?.message || 'Payment failed', { position: 'top-right' });
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Payment failed');
      toast.error(err?.response?.data?.message || 'Payment failed', { position: 'top-right' });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!isStudent) {
      setError('Only students can register for events.');
      return;
    }

    const paymentValidationError = validatePaymentDetails();
    if (paymentValidationError) {
      setError(paymentValidationError);
      toast.error(paymentValidationError, { position: 'top-right' });
      return;
    }

    setShowConfirmModal(true);
  };

  const drawRoundedRect = (ctx, x, y, w, h, r, fillStyle, strokeStyle) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const downloadFullTicket = async () => {
    if (!registration) return;

    try {
      const canvas = document.createElement('canvas');
      const width = 1800;
      const height = 980;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#f0f7ff');
      bg.addColorStop(1, '#eefdf9');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      drawRoundedRect(ctx, 30, 30, width - 60, height - 60, 26, '#ffffff', '#dbe6f3');
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 48px Segoe UI, Arial';
      ctx.fillText(registration?.event?.title || 'Event Ticket', 80, 130);

      const coverX = 80;
      const coverY = 145;
      const coverW = 960;
      const coverH = 190;
      drawRoundedRect(ctx, coverX, coverY, coverW, coverH, 20, '#f8fafc', '#e2e8f0');
      if (registration?.event?.coverImageUrl) {
        try {
          const coverImg = await loadImage(registration.event.coverImageUrl);

          // Draw the cover without distortion: scale to fill and center-crop.
          const scale = Math.max(coverW / coverImg.width, coverH / coverImg.height);
          const drawW = coverImg.width * scale;
          const drawH = coverImg.height * scale;
          const drawX = coverX + (coverW - drawW) / 2;
          const drawY = coverY + (coverH - drawH) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(coverX + 10, coverY);
          ctx.lineTo(coverX + coverW - 10, coverY);
          ctx.quadraticCurveTo(coverX + coverW, coverY, coverX + coverW, coverY + 10);
          ctx.lineTo(coverX + coverW, coverY + coverH - 10);
          ctx.quadraticCurveTo(coverX + coverW, coverY + coverH, coverX + coverW - 10, coverY + coverH);
          ctx.lineTo(coverX + 10, coverY + coverH);
          ctx.quadraticCurveTo(coverX, coverY + coverH, coverX, coverY + coverH - 10);
          ctx.lineTo(coverX, coverY + 10);
          ctx.quadraticCurveTo(coverX, coverY, coverX + 10, coverY);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(coverImg, drawX, drawY, drawW, drawH);
          ctx.restore();
        } catch {
          ctx.fillStyle = '#64748b';
          ctx.font = '700 18px Segoe UI, Arial';
          ctx.fillText('Event cover unavailable', coverX + 20, coverY + coverH / 2);
        }
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '700 18px Segoe UI, Arial';
        ctx.fillText('No event cover image', coverX + 20, coverY + coverH / 2);
      }

      ctx.fillStyle = '#0369a1';
      ctx.font = '700 20px Segoe UI, Arial';
      ctx.fillText('EVENT ADMISSION PASS', 80, 85);

      ctx.strokeStyle = '#dbe6f3';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(1080, 80);
      ctx.lineTo(1080, 900);
      ctx.stroke();
      ctx.setLineDash([]);

      const info = [
        ['Attendee', `${registration?.student?.firstName || ''} ${registration?.student?.lastName || ''}`.trim() || '-'],
        ['Ticket Type', registration?.ticketName || '-'],
        ['Date & Time', `${registration?.event?.startDate ? new Date(registration.event.startDate).toLocaleDateString() : '-'} • ${registration?.event?.startTime || '-'}`],
        ['Venue', registration?.event?.isOnline ? (registration?.event?.meetLink || 'Online Event') : (registration?.event?.venue || '-')],
        ['Ticket Code', registration?.ticketCode || '-'],
        ['Transaction', registration?.transactionId || '-'],
        ['Amount Paid', `LKR ${registration?.amount || 0}`],
        ['Paid Via', `${registration?.paymentBankName || 'Bank Card'} • **** ${registration?.paymentCardLast4 || '----'}`],
      ];

      let y = 365;
      info.forEach(([label, value], idx) => {
        const x = idx % 2 === 0 ? 80 : 580;
        if (idx % 2 === 0 && idx !== 0) y += 100;
        drawRoundedRect(ctx, x, y, 460, 80, 16, '#f8fafc', '#e2e8f0');
        ctx.fillStyle = '#64748b';
        ctx.font = '700 14px Segoe UI, Arial';
        ctx.fillText(label.toUpperCase(), x + 18, y + 28);
        ctx.fillStyle = label === 'Amount Paid' ? '#059669' : '#0f172a';
        ctx.font = '800 28px Segoe UI, Arial';
        const trimmed = String(value).length > 28 ? `${String(value).slice(0, 28)}...` : String(value);
        ctx.fillText(trimmed, x + 18, y + 64);
      });

      drawRoundedRect(ctx, 1140, 180, 590, 620, 24, '#f8fafc', '#e2e8f0');
      ctx.fillStyle = '#334155';
      ctx.font = '800 34px Segoe UI, Arial';
      ctx.fillText('SECURE QR', 1320, 240);

      if (registration?.qrCodeDataUrl) {
        try {
          const qrImg = await loadImage(registration.qrCodeDataUrl);
          ctx.drawImage(qrImg, 1240, 270, 390, 390);
        } catch {
          ctx.fillStyle = '#64748b';
          ctx.font = '700 20px Segoe UI, Arial';
          ctx.fillText('QR unavailable', 1320, 480);
        }
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '600 22px Segoe UI, Arial';
      ctx.fillText('Show this ticket at entrance for validation.', 1180, 700);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const safeEventName = String(registration?.event?.title || 'event-ticket')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      link.href = dataUrl;
      link.download = `${safeEventName || 'event-ticket'}-${registration?.ticketCode || 'ticket'}.png`;
      link.click();
    } catch {
      toast.error('Failed to download full ticket. Please try again.', { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#eef6ff] via-[#f8fbff] to-[#ecfffb]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading payment details...</div>
        ) : error && !event ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
        ) : registration ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-[0_16px_32px_-14px_rgba(16,185,129,0.4)]">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">E-Ticket Issued</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Payment Successful</h1>
              <p className="mt-1 text-sm text-slate-600">Your modern e-ticket is ready with secure QR verification.</p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
              <div className="grid lg:grid-cols-[1.4fr_1px_1fr]">
                <section className="relative p-6 md:p-8">
                  <div className="absolute right-0 top-6 hidden h-[88%] w-2 border-r-2 border-dashed border-slate-200 lg:block" />
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">Event Admission Pass</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{registration?.event?.title}</h2>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {registration?.event?.coverImageUrl ? (
                      <img
                        src={registration.event.coverImageUrl}
                        alt={`${registration?.event?.title || 'Event'} cover`}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-sm font-bold text-slate-400">
                        No event cover image
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendee</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{registration?.student?.firstName} {registration?.student?.lastName}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Type</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{registration?.ticketName}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {registration?.event?.startDate ? new Date(registration.event.startDate).toLocaleDateString() : '-'} • {registration?.event?.startTime || '-'}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {registration?.event?.isOnline ? (registration?.event?.meetLink || 'Online Event') : (registration?.event?.venue || '-')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Code</p>
                      <p className="mt-1 text-sm font-black text-slate-900">{registration?.ticketCode}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction</p>
                      <p className="mt-1 text-sm font-black text-slate-900">{registration?.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</p>
                      <p className="mt-1 text-sm font-black text-emerald-700">LKR {registration?.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paid Via</p>
                      <p className="mt-1 text-sm font-black text-slate-900">{registration?.paymentBankName || 'Bank Card'} • **** {registration?.paymentCardLast4 || '----'}</p>
                    </div>
                  </div>
                </section>

                <div className="hidden bg-slate-100 lg:block" />

                <section className="flex flex-col items-center justify-center bg-slate-50 p-6 md:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Secure QR</p>
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    {registration?.qrCodeDataUrl ? (
                      <img src={registration.qrCodeDataUrl} alt="Ticket QR" className="mx-auto w-full max-w-60" />
                    ) : (
                      <p className="text-center text-sm text-slate-500">QR is not available.</p>
                    )}
                  </div>
                  <p className="mt-3 text-center text-xs text-slate-500">Show this QR at the event entrance for validation.</p>
                  {registration?.qrCodeDataUrl && (
                    <a
                      href={registration.qrCodeDataUrl}
                      download={`ticket-${registration.ticketCode}.png`}
                      className="mt-4 inline-block rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-700"
                    >
                      Download E-Ticket QR
                    </a>
                  )}
                </section>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadFullTicket}
                className="rounded-xl bg-linear-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-bold text-white hover:from-slate-800 hover:to-slate-600"
              >
                Download Full E-Ticket
              </button>
              <Link
                to="/events"
                className="rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-bold text-white hover:from-cyan-700 hover:to-blue-700"
              >
                Back to Events
              </Link>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Go Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-cyan-100 bg-linear-to-br from-white via-cyan-50/50 to-blue-50 p-6 shadow-[0_16px_28px_-18px_rgba(6,182,212,0.45)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Event Payment</p>
              <h1 className="mt-2 text-2xl font-black text-slate-900">{event?.title}</h1>
              <p className="mt-2 text-sm text-slate-600">{event?.description}</p>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p><span className="font-bold">Date:</span> {event?.startDate ? new Date(event.startDate).toLocaleDateString() : '-'}</p>
                <p><span className="font-bold">Time:</span> {event?.startTime || '-'}</p>
                <p><span className="font-bold">Mode:</span> {event?.isOnline ? 'Online' : 'Physical'}</p>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-sm">
                {event?.coverImageUrl ? (
                  <img
                    src={event.coverImageUrl}
                    alt={event?.title || 'Event cover'}
                    className="h-72 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-6 text-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Event Cover</p>
                      <p className="mt-2 text-sm font-bold text-slate-500">No cover image uploaded for this event</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-[0_16px_30px_-18px_rgba(6,182,212,0.38)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Payment Details</p>

              {!isStudent && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  Only student accounts can register and pay for events.
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Select Ticket</label>
                  <select
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    className={inputClass}
                  >
                    {(event?.tickets?.length ? event.tickets : [{ name: 'General Admission', price: 0 }]).map((ticket) => (
                      <option key={ticket.name} value={ticket.name}>
                        {ticket.name} - LKR {ticket.price || 0}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Amount</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">LKR {amount}</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50/60 via-white to-slate-50 px-4 py-4 space-y-3 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Bank Details</p>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Bank Name</label>
                    <input
                      type="text"
                      value={paymentDetails.bankName}
                      onChange={(e) => setPaymentDetails((prev) => ({ ...prev, bankName: e.target.value }))}
                      placeholder="e.g. Commercial Bank"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Card Holder Name</label>
                    <input
                      type="text"
                      value={paymentDetails.cardHolderName}
                      onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardHolderName: e.target.value }))}
                      placeholder="Name on card"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                    <input
                      type="text"
                      value={maskedCard}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const grouped = digits.replace(/(.{4})/g, '$1 ').trim();
                        setPaymentDetails((prev) => ({ ...prev, cardNumber: grouped }));
                      }}
                      placeholder="1234 5678 9012 3456"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">MM</label>
                      <input
                        type="text"
                        value={paymentDetails.expiryMonth}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                        placeholder="08"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">YY</label>
                      <input
                        type="text"
                        value={paymentDetails.expiryYear}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, expiryYear: e.target.value.replace(/\D/g, '').slice(0, 2) }))}
                        placeholder="28"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">CVV</label>
                      <input
                        type="password"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={confirmPayment}
                      onChange={(e) => setConfirmPayment(e.target.checked)}
                    />
                    I confirm payment details are correct and authorize this payment.
                  </label>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!isStudent || processing}
                  className="w-full rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:from-cyan-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing ? 'Processing Payment...' : 'Confirm Payment & Register'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500">
              <span className="text-2xl font-black">!</span>
            </div>
            <h3 className="text-center text-2xl font-black text-slate-900">Are you sure?</h3>
            <p className="mt-2 text-center text-sm text-slate-500">
              You are about to pay <span className="font-bold text-slate-700">LKR {amount}</span> for <span className="font-bold text-slate-700">{selectedTicket?.name || 'General Admission'}</span>.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={executePayment}
                disabled={processing}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {processing ? 'Paying...' : 'Yes, confirm'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={processing}
                className="rounded-lg bg-red-500 px-3 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-red-600 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        theme="colored"
        newestOnTop
        closeOnClick={false}
        pauseOnHover
      />
    </div>
  );
};

export default EventPaymentPage;
