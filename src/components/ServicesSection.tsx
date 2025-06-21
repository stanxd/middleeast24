
import React from 'react';
import { Heart, FileText, GraduationCap } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Donation',
      description: 'Support independent journalism and help us continue our mission to deliver unbiased news and investigations.',
      icon: Heart,
      buttonText: 'Donate Now',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 2,
      title: 'Investigative Report',
      description: 'Submit tips, documents, or leads for investigative stories. Help us uncover the truth that matters.',
      icon: FileText,
      buttonText: 'Submit Report',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 3,
      title: 'Journalism Mentorship',
      description: 'Join our mentorship program to learn from experienced journalists and develop your reporting skills.',
      icon: GraduationCap,
      buttonText: 'Apply Now',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to excellence in journalism and supporting the next generation of reporters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-900 text-white rounded-full mb-6">
                  <IconComponent className="h-8 w-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <button className={`${service.color} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}>
                  {service.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
