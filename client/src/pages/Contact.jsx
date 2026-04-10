import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function Contact() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const onSubmit = () => {
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-yatra-dark">Contact YATRA</h1>
      <p className="text-yatra-secondary mt-1">We are here to help with your journey.</p>

      <div className="mt-10 grid lg:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl border border-yatra-primary/10 shadow-yatra p-8">
          <h2 className="font-display text-xl font-bold text-yatra-dark mb-6">Send a message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="c-name" className="text-sm font-medium text-yatra-dark">
                Name
              </label>
              <input
                id="c-name"
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                {...register('name', { required: true })}
              />
            </div>
            <div>
              <label htmlFor="c-email" className="text-sm font-medium text-yatra-dark">
                Email
              </label>
              <input
                id="c-email"
                type="email"
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                {...register('email', { required: true })}
              />
            </div>
            <div>
              <label htmlFor="c-subject" className="text-sm font-medium text-yatra-dark">
                Subject
              </label>
              <input
                id="c-subject"
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                {...register('subject', { required: true })}
              />
            </div>
            <div>
              <label htmlFor="c-msg" className="text-sm font-medium text-yatra-dark">
                Message
              </label>
              <textarea
                id="c-msg"
                rows={5}
                className="w-full mt-1 border border-yatra-secondary/30 rounded-xl px-3 py-2 bg-white"
                {...register('message', { required: true })}
              />
            </div>
            <button type="submit" className="btn-yatra-primary w-full">
              Send message
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-yatra-secondary/10 rounded-2xl p-8 border border-yatra-secondary/20">
            <h2 className="font-display text-xl font-bold text-yatra-dark mb-4">Contact details</h2>
            <ul className="space-y-3 text-yatra-dark/90">
              <li>
                <span className="text-yatra-secondary text-sm font-semibold">Email</span>
                <br />
                <a href="mailto:support@yatra.com" className="text-yatra-primary font-medium">
                  support@yatra.com
                </a>
              </li>
              <li>
                <span className="text-yatra-secondary text-sm font-semibold">Phone</span>
                <br />
                <a href="tel:+919876543210" className="text-yatra-primary font-medium">
                  +91 98765 43210
                </a>
              </li>
              <li>
                <span className="text-yatra-secondary text-sm font-semibold">Address</span>
                <br />
                VIT-AP University, Amaravati, Andhra Pradesh - 522237
              </li>
              <li>
                <span className="text-yatra-secondary text-sm font-semibold">Working hours</span>
                <br />
                Mon–Sat, 9AM – 6PM IST
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-yatra-primary/10 shadow-yatra p-8">
            <h2 className="font-display text-xl font-bold text-yatra-dark mb-4">Follow YATRA</h2>
            <div className="flex flex-wrap gap-3">
              {['Facebook', 'Instagram', 'X', 'YouTube', 'LinkedIn'].map((label) => (
                <span
                  key={label}
                  className="px-4 py-2 rounded-full bg-yatra-bg border border-yatra-secondary/20 text-sm font-medium text-yatra-dark cursor-default"
                  title="Demo link"
                >
                  {label}
                </span>
              ))}
            </div>
            <p className="text-xs text-yatra-dark/50 mt-3">Social links are for display only in this demo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
