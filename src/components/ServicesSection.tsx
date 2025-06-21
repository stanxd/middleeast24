
import React from 'react';
import { Heart, FileText, GraduationCap, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Donation',
      description: 'Support independent journalism and help us continue our mission to deliver unbiased news and investigations.',
      icon: Heart,
      buttonText: 'Donate Now',
      color: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      shadowColor: 'shadow-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      id: 2,
      title: 'Investigative Report',
      description: 'Submit tips, documents, or leads for investigative stories. Help us uncover the truth that matters.',
      icon: FileText,
      buttonText: 'Submit Report',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      shadowColor: 'shadow-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Journalism Mentorship',
      description: 'Join our mentorship program to learn from experienced journalists and develop your reporting skills.',
      icon: GraduationCap,
      buttonText: 'Apply Now',
      color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      shadowColor: 'shadow-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            We're committed to excellence in journalism and supporting the next generation of reporters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.id} 
                className={`group bg-white rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl ${service.shadowColor} transition-all duration-300 transform hover:-translate-y-2 border border-gray-100`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${service.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-8 w-8 sm:h-10 sm:w-10 ${service.iconColor}`} />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {service.description}
                </p>
                
                <button className={`${service.color} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 inline-flex items-center space-x-2 text-sm sm:text-base shadow-lg`}>
                  <span>{service.buttonText}</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="bg-navy-900 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Join our community of truth-seekers and help shape the future of independent journalism.
            </p>
            <button className="bg-white text-navy-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 text-sm sm:text-base">
              <span>Contact Us Today</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
