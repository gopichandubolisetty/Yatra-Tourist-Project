import { Link } from 'react-router-dom';

const pins = ['📍', '📍', '📍', '📍', '📍'];

export default function Landing() {
  return (
    <div className="mandala-bg">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-yatra-primary/90 via-yatra-secondary/85 to-yatra-dark/90" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {pins.map((p, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-40 animate-bounce hidden md:block"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 15}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {p}
            </span>
          ))}
          <p className="font-display text-5xl md:text-7xl text-white font-bold drop-shadow-lg">
            यात्रा
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-yatra-accent font-extrabold tracking-widest mt-2">
            YATRA
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mt-4 font-sans font-semibold">
            Your Journey, Your Way
          </p>
          <p className="text-white/80 mt-2 max-w-xl mx-auto">
            YATRA is your tourist management companion — plan multi-stop yatras, book Indian rides, and
            track every journey offline on your laptop.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link to="/register" className="btn-yatra-primary !text-lg !px-8 bg-white !text-yatra-primary hover:!opacity-95">
              Start Your Yatra
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl text-center text-yatra-dark font-bold mb-12">
          Why travellers choose YATRA
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🗺️',
              title: 'Multi-Stop Planning',
              text: '📍 Plan up to 5 stops in one Yatra with maps and smart routing.',
            },
            {
              icon: '🚗',
              title: 'Instant Ride Booking',
              text: '📍 Compare YatraRide, SwiftCab, and BharatDrive in ₹.',
            },
            {
              icon: '📍',
              title: 'Live GPS Tracking',
              text: '📍 Track your driver in real time with YATRA live maps.',
            },
          ].map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-8 shadow-yatra hover:shadow-yatra-hover transition-shadow border border-yatra-primary/10"
            >
              <span className="text-4xl">{c.icon}</span>
              <h3 className="font-display text-xl font-bold text-yatra-secondary mt-4">{c.title}</h3>
              <p className="text-yatra-dark/80 mt-2">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-yatra-secondary/10 py-20 px-4">
        <h2 className="font-display text-3xl text-center text-yatra-dark font-bold mb-12">How Yatra Works</h2>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {['Sign up on YATRA', 'Plan your yatra & stops', 'Book & pay with YatraPay', 'Track live on the map'].map(
            (t, i) => (
              <div key={t} className="text-center">
                <div className="w-14 h-14 rounded-full bg-yatra-primary text-white font-display font-bold text-xl flex items-center justify-center mx-auto shadow-yatra">
                  {i + 1}
                </div>
                <p className="mt-3 font-semibold text-yatra-dark">{t}</p>
              </div>
            )
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-display text-3xl text-center text-yatra-dark font-bold mb-4">
          YATRA Destinations
        </h2>
        <p className="text-center text-yatra-dark/75 max-w-2xl mx-auto mb-8">
          Discover every Indian state and Union Territory — 36 regions with hand-picked cities and iconic
          stops for your next yatra.
        </p>
        <div className="flex justify-center mb-10">
          <Link
            to="/destinations"
            className="btn-yatra-primary !px-8"
          >
            View all states &amp; UTs
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ['Goa', 'photo-1507525428034-b723cf961d3e'],
            ['Rajasthan', 'photo-1524492412932-e14a62106c7b'],
            ['Kerala', 'photo-1602216056096-3b40cc0c9944'],
            ['Ladakh', 'photo-1589308078059-be1415eab4c3'],
            ['Varanasi', 'photo-1561361058-6e0fcb0e9273'],
          ].map(([name, id]) => (
            <div key={name} className="relative aspect-square rounded-2xl overflow-hidden shadow-yatra group">
              <img
                src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop`}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yatra-dark/80 to-transparent flex items-end p-3">
                <span className="text-white font-display font-bold">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
