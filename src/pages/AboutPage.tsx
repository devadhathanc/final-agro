import React, { useState } from 'react';
import {
  Users,
  Target,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Award,
  Globe
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SubhodhrajImg from '../images/subhodhraj.png';
import RakshithImg from '../images/rakshith.png';
import DevadhathanImg from '../images/devadhathan.jpg';
import DineshImg from '../images/dineshm.png';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const teamMembers = [
    {
      name: 'Subhodhraj',
      role: 'AI Research Lead',
      image: SubhodhrajImg,
      github: "https://github.com/SUBHODHRAJ"
    },
    {
      name: 'Rakshith Raghaventhra',
      role: 'Agricultural Expert',
      image: RakshithImg,
      github: "https://github.com/rakshithraghaventhra77"
    },
    {
      name: 'Devadhathan Chandran',
      role: 'Software Engineer',
      image: DevadhathanImg,
      github: "https://github.com/devadhathanc"
    },
    {
      name: 'Dinesh Murugesan',
      role: 'Software Engineer',
      image: DineshImg,
      github: "https://github.com/Dinesh-M-0610"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            about AgroIndia.
          </h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto leading-relaxed">
            Our mission is to empower farmers with cutting-edge AI technology for crop health and sustainability.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-green-800">
                  {t('about.mission')}
                </h2>
              </div>
              <p className="text-lg text-green-700 leading-relaxed mb-6">
                We are committed to revolutionizing agriculture using artificial intelligence. Our platform helps farmers detect crop diseases early, reduce losses, and improve yields.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800">Farmer-First Approach</h3>
                    <p className="text-green-600">We prioritize the needs of farmers by creating easy-to-use, practical tools.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="w-6 h-6 text-yellow-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800">Proven Accuracy</h3>
                    <p className="text-green-600">Our AI models are trained on diverse datasets to deliver reliable results.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-800">Local Language Support</h3>
                    <p className="text-green-600">We support multiple Indian languages for better reach and usability.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-first">
              <img
                src="https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Farmers working in field"
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <h2 className="text-3xl font-bold text-green-800">
                {t('about.team')}
              </h2>
            </div>
            <p className="text-lg text-green-600">
              Meet the passionate individuals driving innovation in agro-technology.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <a
                key={index}
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition-shadow block"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-green-800 mb-1">
                  {member.name}
                </h3>
                {/* Removed member.role display */}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Mail className="w-8 h-8 text-green-600" />
                <h2 className="text-3xl font-bold text-green-800">
                  {t('about.contact')}
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Email</p>
                    <p className="text-green-600">support@agroindia.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Phone</p>
                    <p className="text-green-600">+91 1800-AGRO-HELP</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Office</p>
                    <p className="text-green-600">Bengaluru, Karnataka, India</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Support Hours</h3>
                <p className="text-green-600 text-sm">Monday to Friday: 9 AM to 6 PM IST</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
              <h3 className="text-2xl font-semibold text-green-800 mb-6">
                {t('about.contact.form')}
              </h3>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-700 font-medium">Thank you! Your message has been received. We'll get back to you shortly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-green-800 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-green-800 font-medium mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-green-800 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full p-3 border border-green-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
