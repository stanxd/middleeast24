import React, { useState } from 'react';
import { Heart, FileText, GraduationCap, ArrowRight, Clock, UserX, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DonationModal from './DonationModal';
import InvestigativeReportModal from './InvestigativeReportModal';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import ExclusiveSourceForm from './ExclusiveSourceForm';

const ServicesSection = () => {
  const navigate = useNavigate();
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [exclusiveSourceModalOpen, setExclusiveSourceModalOpen] = useState(false);

  const services = [
    {
      id: 4,
      title: 'Exclusive Sources',
      description: 'Submit anonymous news tips securely. We prioritize your privacy - no tracking, no cookies, complete anonymity for whistleblowers and sources.',
      icon: EyeOff,
      buttonText: 'Submit Anonymously',
      color: 'bg-gradient-to-br from-gray-800 via-gray-900 to-black hover:from-black hover:via-gray-900 hover:to-gray-800',
      shadowColor: 'shadow-gray-200 hover:shadow-gray-300',
      iconBg: 'bg-gray-900',
      iconColor: 'text-gray-100',
      borderColor: 'border-gray-800',
      action: () => setExclusiveSourceModalOpen(true)
    },
    {
      id: 2,
      title: 'Investigative Journalism Hub',
      description: 'Submit confidential tips, documents, or leads for investigative stories. Help us uncover the truth that needs to be told.',
      icon: FileText,
      buttonText: 'Submit Report',
      color: 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:via-blue-600 hover:to-blue-800',
      shadowColor: 'shadow-blue-200 hover:shadow-blue-300',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100',
      action: () => setReportModalOpen(true),
      hasSecondaryButton: true,
      secondaryButtonText: 'Request Report',
      secondaryButtonIcon: Clock,
      secondaryButtonLabel: 'Soon'
    },
    {
      id: 3,
      title: 'Journalism Mentorship Program',
      description: "Join our comprehensive mentorship program to learn from experienced journalists and develop your reporting skills in today's media landscape.",
      icon: GraduationCap,
      buttonText: 'Apply Now',
      color: 'bg-gradient-to-br from-green-600 via-green-500 to-green-700 hover:from-green-700 hover:via-green-600 hover:to-green-800',
      shadowColor: 'shadow-green-200 hover:shadow-green-300',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100',
      action: () => window.location.href = '/mentorship-application'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-20">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Our <span className="bg-clip-text bg-gradient-to-br from-slate-700 via-[#0003ff] to-slate-900 text-gray-950">Services</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering truth through technology, community, and education. Join us in shaping the future of independent journalism.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => {
          const IconComponent = service.icon;
          const SecondaryIconComponent = service.secondaryButtonIcon;
          return <div key={service.id} className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 text-center hover:shadow-2xl ${service.shadowColor} transition-all duration-500 transform hover:-translate-y-3 border-2 ${service.borderColor} hover:border-opacity-50 overflow-hidden`} style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className={`relative inline-flex items-center justify-center w-20 h-20 ${service.iconBg} rounded-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <IconComponent className={`h-10 w-10 ${service.iconColor}`} />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-tight">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                  {service.description}
                </p>
                
                <div className="space-y-4">
                  <button onClick={service.action} className={`w-full ${service.color} text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform group-hover:scale-105 inline-flex items-center justify-center space-x-3 text-base shadow-xl hover:shadow-2xl`}>
                    <div className={`flex items-center justify-center h-6 w-6 ${
                      service.id === 1 ? 'bg-red-500/50' : 
                      service.id === 2 ? 'bg-blue-500/50' : 
                      service.id === 3 ? 'bg-green-500/50' : 
                      'bg-gray-700/80'
                    } rounded-full mr-2 backdrop-blur-sm`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <span>{service.buttonText}</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                  {service.hasSecondaryButton && <button disabled className="w-full bg-gray-100 text-gray-400 px-8 py-4 rounded-2xl font-semibold cursor-not-allowed inline-flex items-center justify-center space-x-3 text-base relative">
                      <div className="flex items-center justify-center h-6 w-6 bg-gray-300/50 rounded-full mr-2 backdrop-blur-sm">
                        <SecondaryIconComponent className="h-4 w-4 text-gray-500" />
                      </div>
                      <span>{service.secondaryButtonText}</span>
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        {service.secondaryButtonLabel}
                      </span>
                    </button>}
                </div>
              </div>;
        })}
        </div>

        <div className="text-center mt-16 lg:mt-24">
          <div className="relative bg-gradient-to-br from-slate-700 via-[#0003ff] to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden">            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Ready to Make a <span className="text-yellow-400">Difference?</span>
              </h3>
              <p className="text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Join our community of truth-seekers, whistleblowers, and changemakers. Together, we're shaping the future of independent journalism.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('/contact')} className="bg-white/90 backdrop-blur-sm text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold hover:bg-white transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-3 text-base sm:text-lg shadow-2xl">
                  <div className="flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 bg-yellow-400/50 rounded-full mr-2 backdrop-blur-sm">
                    <span className="text-sm sm:text-base">✨</span>
                  </div>
                  <span>Contact Us Today</span>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button onClick={() => setDonationModalOpen(true)} className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:via-red-600 hover:to-red-800 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-3 text-base sm:text-lg shadow-2xl">
                  <div className="flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 bg-red-500/50 rounded-full mr-2 backdrop-blur-sm">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <span>Support us with Crypto</span>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonationModal isOpen={donationModalOpen} onClose={() => setDonationModalOpen(false)} type="donation" />
      <InvestigativeReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      
<Dialog open={exclusiveSourceModalOpen} onOpenChange={setExclusiveSourceModalOpen}>
        <DialogContent 
          className="max-w-2xl p-0 border-0 bg-transparent shadow-2xl max-h-[90vh] overflow-y-auto"
          aria-describedby="anonymous-tip-description"
        >
          <DialogTitle className="sr-only">Submit Anonymous Tip</DialogTitle>
          <div id="anonymous-tip-description" className="sr-only">
            Submit anonymous tip form for sharing confidential information securely and anonymously.
          </div>
          <ExclusiveSourceForm />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesSection;
