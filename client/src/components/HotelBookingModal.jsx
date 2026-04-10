import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { hotelBookingAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function HotelBookingModal({ open, poi, onClose, onBooked }) {
  const [step, setStep] = useState('details');
  const [busy, setBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [formValues, setFormValues] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const isHotel = poi?.category === 'HOTEL';
  const fallbackPhone = poi?.phone || '+91 98765 43210';

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      checkIn: '',
      checkOut: '',
      bookingDate: '',
      timeSlot: '19:00',
      guests: 2,
      specialRequests: '',
      upiId: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      bank: 'SBI',
    },
  });

  const amount = useMemo(() => {
    if (!poi) return 0;
    if (!formValues) return 0;
    if (!isHotel) return 0;
    const rates = { budget: 2000, mid: 4000, luxury: 8000 };
    const rate = rates[poi.priceLevel || 'mid'] || rates.mid;
    const nights = Math.max(
      1,
      Math.ceil((new Date(formValues.checkOut) - new Date(formValues.checkIn)) / 86400000) || 1
    );
    return rate * nights;
  }, [formValues, isHotel, poi?.priceLevel, poi]);

  if (!open || !poi) return null;

  const submitDetails = (values) => {
    if (isHotel && new Date(values.checkOut) <= new Date(values.checkIn)) {
      toast.error('Check-out must be after check-in');
      return;
    }
    setFormValues(values);
    setStep('payment');
  };

  const resetState = () => {
    reset();
    setBusy(false);
    setStep('details');
    setPaymentMethod('upi');
    setFormValues(null);
    setConfirmedBooking(null);
  };

  const completeBooking = async () => {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const success = Math.random() < 0.95;
    if (!success) {
      setBusy(false);
      toast.error('Payment Failed. Please try again.');
      return;
    }
    try {
      const payload = {
        poiId: poi.id,
        poiName: poi.name,
        poiType: poi.category,
        address: poi.address,
        phone: poi.phone,
        priceLevel: poi.priceLevel || 'mid',
        guests: Number(formValues.guests) || 1,
        specialRequests: formValues.specialRequests || '',
        totalCost: amount,
        paymentMethod,
      };
      if (isHotel) {
        payload.checkIn = formValues.checkIn;
        payload.checkOut = formValues.checkOut;
      } else {
        payload.bookingDate = formValues.bookingDate;
        payload.timeSlot = formValues.timeSlot;
      }
      const { data } = await hotelBookingAPI.create(payload);
      setConfirmedBooking(data);
      setStep('success');
      onBooked?.(data);
      toast.success('Booking Confirmed!');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Booking error:', e);
      toast.error(e.response?.data?.message || 'Booking failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-yatra-dark/50 backdrop-blur-sm">
      <div className="bg-yatra-bg rounded-2xl max-w-md w-full shadow-yatra-hover border-2 border-yatra-primary/20 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold text-yatra-dark">
            {step === 'success'
              ? 'Booking Confirmed!'
              : step === 'payment'
                ? 'Complete payment'
                : `Book ${isHotel ? 'Hotel' : 'Table'}`}
          </h2>
          <button
            type="button"
            className="text-yatra-dark/50 hover:text-yatra-danger"
            onClick={() => {
              resetState();
              onClose();
            }}
          >
            ✕
          </button>
        </div>
        <p className="text-sm font-semibold text-yatra-secondary mb-1">{poi.name}</p>
        <p className="text-xs text-yatra-dark/60 mb-4">{poi.address}</p>

        {step === 'details' && (
          <form onSubmit={handleSubmit(submitDetails)} className="space-y-4">
            {isHotel ? (
              <>
                <div>
                  <label className="text-sm font-medium text-yatra-dark">Check-in</label>
                  <input
                    type="date"
                    required
                    className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                    {...register('checkIn', { required: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-yatra-dark">Check-out</label>
                  <input
                    type="date"
                    required
                    className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                    {...register('checkOut', { required: true })}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-yatra-dark">Date</label>
                  <input
                    type="date"
                    required
                    className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                    {...register('bookingDate', { required: true })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-yatra-dark">Time slot</label>
                  <input
                    type="time"
                    className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                    {...register('timeSlot')}
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium text-yatra-dark">Guests</label>
              <input
                type="number"
                min={1}
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                {...register('guests')}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-yatra-dark">Special requests</label>
              <textarea
                rows={2}
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                {...register('specialRequests')}
              />
            </div>
            <button type="submit" className="w-full btn-yatra-primary">
              Confirm booking
            </button>
          </form>
        )}

        {step === 'payment' && formValues && (
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-yatra-primary/10 p-4">
              <p className="text-sm font-semibold text-yatra-dark">Booking summary</p>
              <p className="text-sm text-yatra-dark/80 mt-2">{poi.name}</p>
              <p className="text-xs text-yatra-dark/60 mt-1">
                {isHotel
                  ? `${formValues.checkIn} → ${formValues.checkOut}`
                  : `${formValues.bookingDate} · ${formValues.timeSlot || 'Flexible'}`}
              </p>
              <p className="text-xs text-yatra-dark/60">Guests: {formValues.guests}</p>
              <p className="text-xl font-bold text-yatra-primary mt-3">₹{amount}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-yatra-dark">Payment method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
              >
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
                <option value="netbanking">Net Banking</option>
                <option value="cash">Cash on Arrival</option>
              </select>
            </div>

            {paymentMethod === 'upi' && (
              <div>
                <label className="text-sm font-medium text-yatra-dark">UPI ID</label>
                <input
                  type="text"
                  placeholder="name@bank"
                  className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                  {...register('upiId')}
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="text-sm font-medium text-yatra-dark">Card number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                    {...register('cardNumber')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-yatra-dark">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                      {...register('expiry')}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-yatra-dark">CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                      {...register('cvv')}
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'netbanking' && (
              <div>
                <label className="text-sm font-medium text-yatra-dark">Bank</label>
                <select
                  className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                  {...register('bank')}
                >
                  <option value="SBI">SBI</option>
                  <option value="HDFC">HDFC</option>
                  <option value="ICICI">ICICI</option>
                  <option value="Axis">Axis</option>
                  <option value="Kotak">Kotak</option>
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                className="w-1/3 rounded-xl border border-yatra-secondary/30 px-4 py-3 text-yatra-secondary font-semibold"
                onClick={() => setStep('details')}
              >
                Back
              </button>
              <button
                type="button"
                disabled={busy}
                className="w-2/3 btn-yatra-primary disabled:opacity-50"
                onClick={completeBooking}
              >
                {busy ? 'Processing…' : `Pay ₹${amount}`}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && confirmedBooking && (
          <div className="space-y-4 text-center">
            <div className="text-5xl">✅</div>
            <div>
              <h3 className="font-display text-2xl font-bold text-yatra-dark">Booking Confirmed!</h3>
              <p className="text-sm text-yatra-secondary mt-1">
                Confirmation number: {confirmedBooking.confirmationNumber}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-yatra-primary/10 p-4 text-left space-y-2">
              <p className="font-semibold text-yatra-dark">{confirmedBooking.poiName}</p>
              <p className="text-sm text-yatra-dark/70">
                {isHotel
                  ? `${confirmedBooking.checkIn} → ${confirmedBooking.checkOut}`
                  : `${confirmedBooking.bookingDate} · ${confirmedBooking.timeSlot || 'Flexible'}`}
              </p>
              <p className="text-sm text-yatra-dark/70">Amount paid: ₹{confirmedBooking.totalCost}</p>
              <p className="text-sm text-yatra-dark/70">Hotel phone: {fallbackPhone}</p>
              <p className="text-sm text-yatra-dark/70">Address: {poi.address}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="btn-yatra-primary"
                onClick={() => toast.success('Receipt downloaded (demo).')}
              >
                Download Receipt
              </button>
              <Link
                to="/hotel-bookings"
                className="rounded-xl border border-yatra-secondary/30 px-4 py-3 font-semibold text-yatra-secondary"
                onClick={() => {
                  resetState();
                  onClose();
                }}
              >
                View My Bookings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
