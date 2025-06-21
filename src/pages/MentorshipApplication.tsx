
import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Send, Clock, CheckCircle, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MentorshipApplication = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    education_background: '',
    journalism_experience: '',
    areas_of_interest: '',
    motivation: '',
    portfolio_links: '',
    availability: '',
    program_type: 'ME24 Media',
    expert_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        hourly_rate: formData.program_type === 'ME24 Media' ? 45 : 250,
        max_hours_monthly: formData.program_type === 'Expert 1:1' ? 16 : null,
        expert_name: formData.program_type === 'Expert 1:1' ? formData.expert_name : null
      };

      const { error } = await supabase
        .from('mentorship_applications')
        .insert([submissionData]);

      if (error) throw error;

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset expert_name and availability when program type changes
    if (name === 'program_type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        expert_name: '',
        availability: ''
      }));
    }
  };

  const getAvailabilityOptions = () => {
    if (formData.program_type === 'ME24 Media') {
      return [
        { value: 'part-time', label: 'Part-time (10-15 hours/week)' },
        { value: 'flexible', label: 'Flexible schedule' },
        { value: 'weekends', label: 'Weekends only' },
        { value: 'evenings', label: 'Evenings only' },
        { value: 'full-time', label: 'Full-time commitment' }
      ];
    } else {
      return [
        { value: 'Abdul Aziz Alkhamis - Flexible schedule', label: 'Abdul Aziz Alkhamis - Flexible schedule' },
        { value: 'Abdul Aziz Alkhamis - Weekends only', label: 'Abdul Aziz Alkhamis - Weekends only' },
        { value: 'Abdul Aziz Alkhamis - Evenings only', label: 'Abdul Aziz Alkhamis - Evenings only' }
      ];
    }
  };

  const getPricingInfo = () => {
    if (formData.program_type === 'ME24 Media') {
      return {
        rate: '$45/hour',
        description: 'Comprehensive group mentorship program'
      };
    } else {
      return {
        rate: '$250/hour',
        description: '16 hours maximum per month - Premium 1:1 expert mentorship'
      };
    }
  };

  if (submitted) {
    const pricingInfo = getPricingInfo();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Application Submitted!</h1>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Program Details</h3>
              <p className="text-blue-800 mb-2">
                <strong>Selected Program:</strong> {formData.program_type}
              </p>
              <p className="text-blue-800 mb-2">
                <strong>Hourly Rate:</strong> {pricingInfo.rate}
              </p>
              <p className="text-blue-700 text-sm">{pricingInfo.description}</p>
              {formData.program_type === 'Expert 1:1' && (
                <p className="text-blue-800 mt-2">
                  <strong>Expert:</strong> Abdul Aziz Alkhamis
                </p>
              )}
            </div>
            <p className="text-xl text-gray-600 mb-4">
              Thank you for your interest in our Journalism Mentorship Program.
            </p>
            <p className="text-gray-600 mb-8">
              We'll review your application and get back to you within 2-3 business days at <strong>s707tan@gmail.com</strong>
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pricingInfo = getPricingInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
              <GraduationCap className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Journalism Mentorship Program
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our comprehensive mentorship program and learn from experienced journalists. 
              We'll help you develop essential skills and navigate today's media landscape.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Application Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Program Type Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Program Selection</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      formData.program_type === 'ME24 Media' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({...formData, program_type: 'ME24 Media', expert_name: '', availability: ''})}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="h-6 w-6 text-green-600" />
                      <h4 className="font-semibold text-gray-900">ME24 Media</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive group mentorship program</p>
                    <div className="flex items-center space-x-2 text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">$45/hour</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      formData.program_type === 'Expert 1:1' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({...formData, program_type: 'Expert 1:1', availability: ''})}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Expert 1:1</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Premium 1:1 expert mentorship</p>
                    <p className="text-xs text-gray-500 mb-3">16 hours max/month</p>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">$250/hour</span>
                    </div>
                  </div>
                </div>
                
                {/* Pricing Display */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Selected Program: {formData.program_type}</span>
                  </div>
                  <p className="text-blue-800 text-sm">
                    <strong>Rate:</strong> {pricingInfo.rate} - {pricingInfo.description}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="16"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>
                </div>
              </div>

              {/* Educational Background */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Educational Background</span>
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Education Background *
                  </label>
                  <textarea
                    name="education_background"
                    value={formData.education_background}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Describe your educational background, including degrees, certifications, relevant courses..."
                  />
                </div>
              </div>

              {/* Professional Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <span>Professional Experience</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Journalism Experience
                    </label>
                    <textarea
                      name="journalism_experience"
                      value={formData.journalism_experience}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Describe any journalism or media experience you have (internships, freelance work, school publications, etc.). If you're a beginner, that's perfectly fine - just let us know!"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Areas of Interest *
                    </label>
                    <textarea
                      name="areas_of_interest"
                      value={formData.areas_of_interest}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="What areas of journalism interest you most? (e.g., investigative reporting, political journalism, sports, technology, etc.)"
                    />
                  </div>
                </div>
              </div>

              {/* Motivation and Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  <span>Motivation & Goals</span>
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Why do you want to join our mentorship program? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Tell us about your motivation for becoming a journalist and what you hope to achieve through this mentorship program..."
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                  <span>Additional Information</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Portfolio Links
                    </label>
                    <textarea
                      name="portfolio_links"
                      value={formData.portfolio_links}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Share links to your portfolio, published articles, blog posts, social media accounts, or any other relevant work..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Availability *
                    </label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">
                        {formData.program_type === 'Expert 1:1' 
                          ? 'Select expert and availability' 
                          : 'Select your availability'
                        }
                      </option>
                      {getAvailabilityOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formData.program_type === 'Expert 1:1' && (
                      <p className="text-sm text-blue-600 mt-2">
                        <strong>Expert:</strong> Abdul Aziz Alkhamis - Experienced investigative journalist with 15+ years in the field
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <Link
                  to="/"
                  className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-5 w-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MentorshipApplication;
