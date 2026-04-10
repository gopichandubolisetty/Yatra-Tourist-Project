import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to YATRA!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials — try YATRA demo account');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-yatra-bg">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-yatra-hover border border-yatra-primary/10 p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/yatra-logo.svg" alt="" className="w-16 h-16 mb-2" />
          <p className="font-display text-yatra-primary font-bold">यात्रा YATRA</p>
        </div>
        <h1 className="font-display text-2xl font-bold text-yatra-dark text-center">
          Welcome Back, Traveller
        </h1>
        <p className="text-center text-sm text-yatra-secondary mt-1 mb-6">Your Journey, Your Way</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-yatra-dark">Email</label>
            <input
              type="email"
              className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-4 py-2"
              {...register('email', { required: true })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-yatra-dark">Password</label>
            <input
              type="password"
              className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-4 py-2"
              {...register('password', { required: true })}
            />
          </div>
          <p className="text-xs text-yatra-dark/60 bg-yatra-bg rounded-lg p-2">
            YATRA demo: <strong>demo@yatra.com</strong> / <strong>demo123</strong>
          </p>
          <button type="submit" className="w-full btn-yatra-primary">
            Continue My Yatra
          </button>
        </form>
        <p className="text-center text-sm mt-6 text-yatra-dark/70">
          New to YATRA?{' '}
          <Link to="/register" className="text-yatra-primary font-semibold">
            Start Your Yatra
          </Link>
        </p>
      </div>
    </div>
  );
}
