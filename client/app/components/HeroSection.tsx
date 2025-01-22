export default function HeroSection() {
    return (
      <div className="relative h-[70vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/images/cinematic-bg.jpg)' }}>
        <div className="absolute inset-0 bg-cinematic-gradient"></div>
        <div className="relative text-center">
          <h1 className="text-6xl font-bold text-accent mb-4">CINEMATIC</h1>
          <p className="text-xl text-text mb-8">Licensed Music | Custom Scores | Original Compositions</p>
          <div className="space-x-4">
            <button className="bg-accent text-primary px-6 py-3 rounded hover:bg-opacity-90">
              View Music Library
            </button>
            <button className="border border-accent text-accent px-6 py-3 rounded hover:bg-accent hover:text-primary">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    );
  }