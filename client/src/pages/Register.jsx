import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register: regUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await regUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      toast.success('YATRA account created!');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-yatra-bg">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-yatra-hover border border-yatra-primary/10 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/yatra-logo.svg" alt="" className="w-16 h-16 mb-2" />
          <p className="font-display text-yatra-primary font-bold">यात्रा YATRA</p>
        </div>
        <h1 className="font-display text-2xl font-bold text-yatra-dark text-center">Join YATRA</h1>
        <p className="text-center text-sm text-yatra-secondary mt-1 mb-6">Your Journey, Your Way</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input className="w-full mt-1 border rounded-xl px-4 py-2" {...register('name', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full mt-1 border rounded-xl px-4 py-2" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input className="w-full mt-1 border rounded-xl px-4 py-2" {...register('phone')} />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="w-full mt-1 border rounded-xl px-4 py-2" {...register('password', { required: true })} />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input type="password" className="w-full mt-1 border rounded-xl px-4 py-2" {...register('confirmPassword', { required: true })} />
          </div>
          <button type="submit" className="w-full btn-yatra-primary">
            Start My Yatra
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-yatra-dark/70">
          Already a traveller?{' '}
          <Link to="/login" className="text-yatra-primary font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
