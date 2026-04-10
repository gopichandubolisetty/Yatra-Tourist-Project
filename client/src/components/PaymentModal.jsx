import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PaymentModal({ open, onClose, booking, amount, onSuccess }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { method: 'upi', upiId: 'demo@yatra', cardLast4: '4242' },
  });
  const [busy, setBusy] = useState(false);

  if (!open || !booking) return null;

  const submit = async (values) => {
    setBusy(true);
    try {
      const { data } = await api.post('/api/payments/process', {
        bookingId: booking.id,
        amount,
        method: values.method,
        upiId: values.method === 'upi' ? values.upiId : undefined,
        cardLast4: values.method === 'card' ? values.cardLast4 : undefined,
      });
      onSuccess?.(data);
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Payment failed on YATRA');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-yatra-dark/50 backdrop-blur-sm">
      <div className="bg-yatra-bg rounded-2xl max-w-md w-full shadow-yatra-hover border-2 border-yatra-primary/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-bold text-yatra-dark">YatraPay</h2>
          <button type="button" className="text-yatra-dark/50 hover:text-yatra-danger" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="text-sm text-yatra-secondary mb-1">Mock payment — no real charge</p>
        <p className="text-2xl font-bold text-yatra-primary mb-4">₹{amount}</p>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-yatra-dark">Method</label>
            <select
              className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
              {...register('method')}
            >
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="cash">Cash (mark intent)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-yatra-dark">UPI ID (if UPI)</label>
            <input
              className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
              {...register('upiId')}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-yatra-dark">Card last 4 (if card)</label>
            <input
              className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
              maxLength={4}
              {...register('cardLast4')}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full btn-yatra-primary disabled:opacity-50"
          >
            {busy ? 'Processing YatraPay…' : 'Pay with YatraPay'}
          </button>
        </form>
      </div>
    </div>
  );
}
