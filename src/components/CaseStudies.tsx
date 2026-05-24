import { ArrowRight } from 'lucide-react';

interface CaseStudiesProps {
  onCaseStudyClick: (project: string) => void;
}

export default function CaseStudies({ onCaseStudyClick }: CaseStudiesProps) {
  return (
    <section id="projects" className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 w-full">
      <div className="max-w-[1440px] mx-auto">
        {/* Badge Row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-[11px] sm:text-[12px] font-semibold select-none">
            2
          </div>
          <div className="text-[12px] sm:text-[13px] text-gray-900 font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
            Featured client work
          </div>
        </div>

        {/* Heading h2 */}
        <div className="px-5 sm:px-8 lg:px-12 mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-gray-900 font-medium leading-[1.08] tracking-[-0.03em] text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)]">
            Our projects
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 px-5 sm:px-8 lg:px-12">
          {/* Card 1 (Narrativ) */}
          <div className="flex flex-col group cursor-pointer" onClick={() => onCaseStudyClick('Narrativ')}>
            {/* Video Container */}
            <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] shadow-sm">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Hover Button */}
              <div className="absolute bottom-4 left-4 h-9 bg-white rounded-full flex items-center pl-3 pr-2.5 shadow-md w-9 group-hover:w-[148px] overflow-hidden transition-all duration-300 ease-in-out select-none">
                <div className="flex items-center justify-between w-full min-w-[124px]">
                  <span className="text-[13px] text-gray-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
                    Learn more
                  </span>
                  <span className="flex items-center justify-center text-gray-900 transition-transform duration-300 -rotate-45 group-hover:rotate-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed max-w-[95%]">
              Winner of Site of the Month 2025 - an interactive 3D showcase driving record engagement
            </p>

            {/* Title */}
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
              Narrativ
            </h3>
          </div>

          {/* Card 2 (Luminar) */}
          <div className="flex flex-col group cursor-pointer" onClick={() => onCaseStudyClick('Luminar')}>
            {/* Video Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] shadow-sm">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Hover Button */}
              <div className="absolute bottom-4 left-4 h-9 bg-gray-900 rounded-full flex items-center pl-3.5 pr-2.5 shadow-md w-9 group-hover:w-[168px] overflow-hidden transition-all duration-300 ease-in-out select-none">
                <div className="flex items-center justify-between w-full min-w-[144px]">
                  <span className="text-[13px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
                    View case study
                  </span>
                  <span className="flex items-center justify-center text-white transition-transform duration-300 -rotate-45 group-hover:rotate-0">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] sm:text-[14px] text-gray-600 mt-4 leading-relaxed max-w-[95%]">
              Transforming a dated platform into a conversion-focused brand experience
            </p>

            {/* Title */}
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 mt-1">
              Luminar
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
