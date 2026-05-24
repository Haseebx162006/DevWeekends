import { useState, useEffect } from 'react';
import { Menu, X, Clock, ArrowRight } from 'lucide-react';
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';

interface HeroProps {
  onBookCall: () => void;
  onStartProject: () => void;
}

export default function Hero({ onBookCall, onStartProject }: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [londonTime, setLondonTime] = useState('');

  // Update London time
  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date());
      setLondonTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#EFEFEF] flex flex-col justify-between overflow-hidden">
      {/* SHADER BACKGROUND */}
      <div className="absolute inset-0 z-10 pointer-events-none w-full h-full opacity-60">
        <Shader className="w-full h-full">
          <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          <ChromaFlow
            baseColor="#ffffff"
            downColor="#ff5f03"
            leftColor="#ff5f03"
            rightColor="#ff5f03"
            upColor="#ff5f03"
            momentum={13}
            radius={3.5}
          />
          <FlutedGlass
            aberration={0.61}
            angle={31}
            frequency={8}
            highlight={0.12}
            highlightSoftness={0}
            lightAngle={-90}
            refraction={4}
            shape="rounded"
            softness={1}
            speed={0.15}
          />
          <FilmGrain strength={0.05} />
        </Shader>
      </div>

      {/* HEADER & NAVIGATION */}
      <header className="w-full z-20 px-2 sm:px-3 pt-4 sm:pt-6 max-w-[1440px] mx-auto">
        <nav className="bg-white rounded-full p-[5px] flex items-center justify-between shadow-sm border border-gray-100/50">
          {/* Left Navigation */}
          <div className="flex items-center gap-6 pl-2">
            {/* Logo */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-300">
              <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-tight">AX</span>
            </div>
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#projects" className="text-[14px] text-gray-900 hover:text-gray-500 font-medium transition-colors duration-300">Projects</a>
              <a href="#studio" className="text-[14px] text-gray-900 hover:text-gray-500 font-medium transition-colors duration-300">Studio</a>
              <a href="#journal" className="text-[14px] text-gray-900 hover:text-gray-500 font-medium transition-colors duration-300">Journal</a>
              <a href="#connect" className="text-[14px] text-gray-900 hover:text-gray-500 font-medium transition-colors duration-300">Connect</a>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-4 sm:gap-6 pr-1">
            {/* Info Badges */}
            <div className="hidden md:flex items-center gap-5">
              <span className="text-[13px] text-gray-600 hidden lg:inline">Taking on projects for Q1 2026</span>
              <div className="flex items-center gap-1.5 text-gray-600">
                <Clock size={14} className="text-gray-500" />
                <span className="text-[13px]">{londonTime || '--:--'} in London</span>
              </div>
            </div>

            {/* Book Strategy Call CTA */}
            <button
              onClick={onBookCall}
              className="hidden md:flex group items-center bg-gray-900 hover:bg-gray-800 text-white rounded-full pl-5 pr-2 py-2 gap-3 cursor-pointer transition-colors duration-300 select-none"
            >
              <div className="overflow-hidden h-[20px]">
                <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                  <span className="h-[20px] leading-[20px] text-[13px] font-medium whitespace-nowrap">Book a strategy call</span>
                  <span className="h-[20px] leading-[20px] text-[13px] font-medium whitespace-nowrap">Book a strategy call</span>
                </div>
              </div>
              <div className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight size={13} className="text-gray-900" />
              </div>
            </button>

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-800 duration-300"
            >
              <Menu size={16} />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          {/* Tap outside to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setMobileMenuOpen(false)} />

          {/* Bottom Sheet */}
          <div className="bg-white rounded-2xl mx-3 mb-3 p-6 flex flex-col gap-6 shadow-2xl transform translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
            {/* Header in sheet */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                <Clock size={12} />
                <span className="text-[12px] font-medium">{londonTime || '--:--'} in London</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col gap-4 py-2">
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                Projects
              </a>
              <a
                href="#studio"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                Studio
              </a>
              <a
                href="#journal"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                Journal
              </a>
              <a
                href="#connect"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[28px] sm:text-[32px] font-medium text-gray-900 hover:text-gray-500 transition-colors"
              >
                Connect
              </a>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartProject();
                }}
                className="w-full bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full py-3.5 flex items-center justify-center gap-3 font-medium transition-colors duration-300"
              >
                <span>Start a project</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookCall();
                }}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-3.5 flex items-center justify-center gap-3 font-medium transition-colors duration-300"
              >
                <span>Book a strategy call</span>
                <Clock size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO CONTENT */}
      <div className="flex-1 flex flex-col justify-end w-full max-w-[1440px] mx-auto z-20 px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
        {/* Label */}
        <p className="text-[13px] sm:text-[14px] text-gray-900 font-semibold tracking-widest uppercase mb-5 sm:mb-8">
          Axion Studio
        </p>

        {/* Headline */}
        <h1 className="text-gray-900 font-medium leading-[1.08] tracking-[-0.03em] text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] max-w-[90%] lg:max-w-[80%]">
          We craft digital experiences <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          for brands ready to dominate <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          their category online.
        </h1>

        {/* CTA Buttons Row */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {/* Start Project Button */}
          <button
            onClick={onStartProject}
            className="group flex items-center bg-[#F26522] hover:bg-[#e05a1a] text-white rounded-full pl-5 sm:pl-6 pr-2 py-2 gap-3 sm:gap-4 cursor-pointer transition-colors duration-300 select-none"
          >
            <div className="overflow-hidden h-[20px]">
              <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                <span className="h-[20px] leading-[20px] text-[13px] sm:text-[14px] font-medium whitespace-nowrap">Start a project</span>
                <span className="h-[20px] leading-[20px] text-[13px] sm:text-[14px] font-medium whitespace-nowrap">Start a project</span>
              </div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-[#F26522] rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
              <ArrowRight size={15} className="text-[#F26522]" />
            </div>
          </button>

          {/* Partner Badge */}
          <div className="bg-white rounded-[4px] py-1.5 sm:py-2 px-3 sm:px-4 flex items-center gap-2 sm:gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer">
            <span className="text-[#E8704E] flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
              </svg>
            </span>
            <span className="text-[13px] sm:text-[14px] font-semibold text-gray-900 whitespace-nowrap">Certified Partner</span>
            <span className="text-[10px] sm:text-[11px] bg-gray-900 text-white font-medium px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider select-none">
              Featured
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
