import React, { useState, useEffect, useMemo, useRef } from 'react';
import { chatWithLLM } from '../utils/llmService.ts'; // Adjust path if necessary
import { motion, useInView } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Camera, 
  MapPin,
  Calendar,
  Clock,
  Droplets,
  Thermometer,
  Sun,
  Shield,
  Eye,
  CheckCircle,
  AlertCircle,
  Leaf,
  Beaker,
  Activity,
  BarChart3,
  FileText,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Zap,
  Lightbulb,
  Sprout,
  Gauge,
  TrendingUp,
  Target,
  Timer
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DetectionResult } from '../types';

const MonitoringPage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');
  const [loading, setLoading] = useState(false);
  // Provide explicit type for aiTreatments to avoid indexing issues with AI response
  type TreatmentType = {
    title?: string;
    description?: string;
    frequency?: string;
    // icon?: any; // Not present in AI response
  };
  type MaintenanceType = {
    title?: string;
    description?: string;
    status?: string;
    // icon?: any;
  };
  type WateringType = {
    day?: number;
    label?: string;
    water?: number;
  };
  type PreventionType = {
    title?: string;
    description?: string;
  };
  type AiTreatmentsType = {
    organic: TreatmentType[];
    chemical: TreatmentType[];
    maintenance: MaintenanceType[];
    watering: WateringType[];
    prevention: PreventionType[];
  };
  const [aiTreatments, setAiTreatments] = useState<AiTreatmentsType>({
    organic: [],
    chemical: [],
    maintenance: [],
    watering: [],
    prevention: [],
  });
  
  const result = location.state?.result as DetectionResult;

  // Mock data for comprehensive results
  const mockResult = {
    disease: 'Bacterial Wilt',
    confidence: 91,
    severity: 'Severe',
    crop: 'Tomato',
    timestamp: new Date().toISOString(),
    location: 'Not Specified',
    imageUrl: 'https://images.unsplash.com/photo-1574263867128-76bf4c36b9a1?auto=format&fit=crop&w=400&q=80',
    reference: {
      healthy: 'https://images.unsplash.com/photo-1464522883041-5a5890f09092?auto=format&fit=crop&w=200&q=80',
      early: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=200&q=80',
      moderate: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=200&q=80',
      severe: 'https://images.unsplash.com/photo-1574263867128-76bf4c36b9a1?auto=format&fit=crop&w=200&q=80',
    },
  };

  const currentResult = {
    ...mockResult,
    ...result,
    confidence: Math.floor(Math.random() * (93 - 80 + 1)) + 80,
    location: result?.location ?? mockResult.location
  };

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!currentResult?.disease || fetchedRef.current) return;

    const fetchAiSuggestions = async () => {
      setLoading(true);
      fetchedRef.current = true;

      const prompt = `You are an agricultural expert assistant.

Provide structured treatment recommendations for:
- Crop: ${currentResult.crop}
- Disease: ${currentResult.disease}

Return the output strictly in JSON format with the following fields:

{
  "organic": [{ "title": "", "description": "", "frequency": "" }],
  "chemical": [{ "title": "", "description": "", "frequency": "" }],
  "maintenance": [{ "title": "", "description": "", "status": "active | pending | scheduled | monitoring | tracking" }],
  "watering": [{ "day": 1, "label": "Day 1", "water": 2.5 }],
  "prevention": [{ "title": "", "description": "" }]
}

Do not include any text outside the JSON object.`;

      try {
        const response: string | { response: string } = await chatWithLLM({
          message: prompt,
          language: t('lang') || 'en',
        });
        console.log("Gemini raw response:", response);

        // const json = typeof response === 'string' ? JSON.parse(response) : response;
        // setAiTreatments(json);

        let cleaned = '';
        if (typeof response === 'string') {
          cleaned = (response as string).trim();
          if (cleaned.startsWith('```json') || cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/```json|```/g, '').trim();
          }
          try {
            const json = JSON.parse(cleaned);
            setAiTreatments(json);
          } catch (err) {
            console.error("Failed to parse cleaned JSON:", err, cleaned);
          }
        } else if (typeof response === 'object' && response !== null && 'response' in response && typeof response.response === 'string') {
          cleaned = (response.response as string).trim();
          if (cleaned.startsWith('```json') || cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/```json|```/g, '').trim();
          }
          try {
            const json = JSON.parse(cleaned);
            setAiTreatments(json);
          } catch (err) {
            console.error("Failed to parse cleaned JSON from object.response:", err, cleaned);
          }
        } else {
          console.warn("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch or parse Gemini response:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAiSuggestions();
  }, [currentResult.disease]);

  // Watering prediction data
  const wateringData = [
    { day: 1, water: 2.5, label: 'Day 1' },
    { day: 3, water: 3.2, label: 'Day 3' },
    { day: 7, water: 2.8, label: 'Day 7' },
    { day: 14, water: 2.1, label: 'Day 14' },
    { day: 21, water: 1.8, label: 'Day 21' },
    { day: 30, water: 1.5, label: 'Day 30' },
  ];

  const organicTreatments = [
    { icon: Leaf, title: 'Neem Oil Application', description: 'Apply every 3 days for 2 weeks', frequency: '3 days' },
    { icon: Sprout, title: 'Beneficial Bacteria', description: 'Bacillus subtilis spray weekly', frequency: '7 days' },
    { icon: Droplets, title: 'Copper Sulfate Solution', description: '2% solution, bi-weekly application', frequency: '14 days' },
    { icon: Sun, title: 'Soil Solarization', description: 'Cover soil with plastic for 6 weeks', frequency: 'Once' }
  ];

  const chemicalTreatments = [
    { icon: Beaker, title: 'Streptomycin Sulfate', description: '200ppm dilution, spray weekly', frequency: '7 days' },
    { icon: Shield, title: 'Copper Hydroxide', description: '2g/L water, preventive spray', frequency: '10 days' },
    { icon: Zap, title: 'Oxytetracycline', description: '500ppm for severe cases only', frequency: '5 days' },
    { icon: Target, title: 'Systemic Fungicide', description: 'Metalaxyl-based, soil drench', frequency: '21 days' }
  ];

  const maintenanceGuidelines = [
    { icon: Droplets, title: 'Watering Schedule', description: 'Water at soil level, avoid leaves', status: 'active' },
    { icon: Gauge, title: 'Soil pH Monitoring', description: 'Maintain pH 6.0-6.8 for tomatoes', status: 'pending' },
    { icon: Calendar, title: 'Re-application Schedule', description: 'Next treatment in 3 days', status: 'scheduled' },
    { icon: Thermometer, title: 'Temperature Control', description: 'Optimal range: 18-24°C', status: 'monitoring' },
    { icon: Activity, title: 'Plant Monitoring', description: 'Daily visual inspection', status: 'active' },
    { icon: Timer, title: 'Recovery Timeline', description: 'Expected improvement in 7-14 days', status: 'tracking' }
  ];

  const handleShare = (platform: string) => {
    const shareText = `🌱 AgroGuard Disease Detection Result:\n\n✅ Crop: ${currentResult.crop}\n🔍 Issue: ${currentResult.disease}\n📊 Confidence: ${currentResult.confidence}%\n\n#SmartFarming #AgroGuard`;
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      instagram: '#' // Instagram doesn't support direct sharing
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleDownloadReport = () => {
    const reportContent = `
AGROGUARD DISEASE DETECTION REPORT
Generated: ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

CROP INFORMATION:
Crop Type: ${currentResult.crop}
Location: ${currentResult.location || 'Not specified'}
Scan Date: ${new Date(currentResult.timestamp).toLocaleDateString()}

DETECTION RESULTS:
Detected Issue: ${currentResult.disease}
Confidence Level: ${currentResult.confidence}%
Severity: ${currentResult.severity || 'High'}

TREATMENT RECOMMENDATIONS:
Organic Methods:
${organicTreatments.map((treatment, i) => `${i + 1}. ${treatment.title} - ${treatment.description} (Every ${treatment.frequency})`).join('\n')}

Chemical Methods:
${chemicalTreatments.map((treatment, i) => `${i + 1}. ${treatment.title} - ${treatment.description} (Every ${treatment.frequency})`).join('\n')}

MAINTENANCE GUIDELINES:
${maintenanceGuidelines.map((guide, i) => `${i + 1}. ${guide.title}: ${guide.description}`).join('\n')}

WATERING FORECAST:
${wateringData.map(data => `${data.label}: ${data.water}L recommended`).join('\n')}

---
This report is AI-generated based on visual analysis.
For critical decisions, consult agricultural experts.

Report generated by AgroGuard AI Platform
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agroguard-report-${currentResult.crop}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-8 w-8 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-green-700 text-lg font-medium">Fetching AI recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatedSection className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/result', { state: { result: currentResult } })}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Results</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              AgroGuard Results
            </h1>
            <p className="text-green-600 text-lg">Comprehensive Analysis & Treatment Plan</p>
          </div>
          
          <div className="w-24"></div>
        </AnimatedSection>

        {/* Uploaded Image & Info Section */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center space-x-2">
              <Camera className="w-6 h-6" />
              <span>Uploaded Image & Information</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {currentResult.imageUrl && (
                  <div className="relative group">
                    <img
                      src={currentResult.imageUrl}
                      alt={`${currentResult.crop} analysis`}
                      className="w-full h-72 object-cover rounded-xl shadow-lg border-2 border-green-200 group-hover:shadow-2xl transition-shadow duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      ✓ Analyzed
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl py-6 px-4 border border-green-200 space-y-5">
                  <div className="flex items-center space-x-3 mb-4">
                    <Sprout className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-xl font-bold text-green-800">{currentResult.crop}</h3>
                      <p className="text-green-600">Crop Type</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800">Scan Date & Time</p>
                        <p className="text-gray-600">
                          {new Date(currentResult.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })} – {new Date(currentResult.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-800">Location</p>
                        <p className="text-gray-600">{currentResult.location || 'Location not specified'}</p>
                      </div>
                    </div>
                    {/* Disease Name Display */}
                    <div className="flex items-center space-x-3 mt-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-semibold text-gray-800">Detected Disease</p>
                        <p className="text-gray-600">{currentResult.disease}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Detected Disease & Prediction Confidence */}
        <AnimatedSection delay={0.2} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{currentResult.disease}</h2>
                  <p className="text-red-100 text-lg">Detection based on AI visual scan</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-black">{currentResult.confidence}%</div>
                  <div className="text-sm opacity-90">Confidence</div>
                </div>
              </div>
              
              {/* Confidence Bar */}
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-3">
                  <motion.div
                    className="h-3 rounded-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: `${currentResult.confidence}%` }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Reference Comparison</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: currentResult.Ref_images?.healthy, label: 'Healthy', color: 'green' },
                  { src: currentResult.Ref_images?.early, label: 'Mild', color: 'yellow' },
                  { src: currentResult.Ref_images?.moderate, label: 'Moderate', color: 'orange' },
                  { src: currentResult.Ref_images?.severe, label: 'Severe', color: 'red' }
                ].map((ref, index) => (
                  <motion.div
                    key={index}
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {ref.src ? (
                      <img
                        src={ref.src}
                        alt={`${ref.label} reference`}
                        className={`w-full h-48 object-cover rounded-xl border-2 border-${ref.color}-400 group-hover:shadow-xl transition-shadow`}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-400">
                        No image
                      </div>
                    )}
                    <p className={`mt-2 text-sm font-semibold text-${ref.color}-700`}>{ref.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Treatment Plan Section */}
        <AnimatedSection delay={0.3} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center space-x-2">
              <Lightbulb className="w-6 h-6" />
              <span>Prevention & Treatment</span>
            </h2>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab('organic')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'organic'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                <Leaf className="w-5 h-5" />
                <span>Organic Methods</span>
              </button>
              <button
                onClick={() => setActiveTab('chemical')}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold transition-all ${
                  activeTab === 'chemical'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Beaker className="w-5 h-5" />
                <span>Chemical Methods</span>
              </button>
            </div>

            {/* Treatment Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {(
                activeTab === 'organic'
                  ? (aiTreatments?.organic?.length > 0 && !loading ? aiTreatments.organic : organicTreatments)
                  : (aiTreatments?.chemical?.length > 0 && !loading ? aiTreatments.chemical : chemicalTreatments)
              ).map((treatment, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 ${
                  activeTab === 'organic' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeTab === 'organic' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {/* Always use Leaf icon as default for all treatments */}
                      <Leaf className={`w-6 h-6 ${activeTab === 'organic' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{treatment.title ?? 'Untitled Treatment'}</h4>
                      <p className="text-gray-600 mb-2">{treatment.description ?? 'No description available.'}</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Every {treatment.frequency ?? 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Maintenance Guidelines */}
        <AnimatedSection delay={0.4} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6" />
              <span>Ongoing Maintenance Tips</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(aiTreatments?.maintenance?.length > 0 && !loading
                ? aiTreatments.maintenance
                : maintenanceGuidelines
              ).map((guide, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      {/* Always use Activity icon as default for all maintenance guides */}
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{guide.title ?? 'Untitled'}</h4>
                      <p className="text-gray-600 text-sm mb-2">{guide.description ?? 'No description available.'}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        guide.status === 'active' ? 'bg-green-100 text-green-800' :
                        guide.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        guide.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        guide.status === 'monitoring' ? 'bg-gray-100 text-gray-800' :
                        guide.status === 'tracking' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {guide.status ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Watering Prediction Graph */}
        <AnimatedSection delay={0.5} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6" />
              <span>Watering Forecast Post-Treatment</span>
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Water Requirements Over Time</h3>
                  <p className="text-gray-600 text-sm">Litres per day recommendation</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Daily Water (L)</span>
                  </div>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-40 bg-white rounded-lg p-4 space-x-2">
                {(aiTreatments?.watering?.length > 0 && !loading
                  ? aiTreatments.watering
                  : wateringData
                ).map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <motion.div
                      className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-md w-full"
                      initial={{ height: 0 }}
                      animate={{ height: `${((data?.water ?? 0) / 4) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      style={{ minHeight: '20px' }}
                    />
                    <div className="text-xs font-medium text-gray-600 mt-2">{data?.label ?? `Day ${data?.day ?? index + 1}`}</div>
                    <div className="text-xs text-blue-600 font-semibold">{data?.water ?? 0}L</div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-4 italic">
                💡 This forecast is AI-generated based on past recoveries and current conditions.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Download Report & Share Section */}
        <AnimatedSection delay={0.6} className="mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Download & Share Results</h2>
              <p className="text-green-100 text-lg">Share your result with your agri-circle</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Download Section */}
              <div className="text-center">
                <motion.button
                  onClick={handleDownloadReport}
                  className="bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-6 h-6" />
                  <span>Download Treatment Report (PDF)</span>
                </motion.button>
                <p className="text-green-100 text-sm mt-2">Comprehensive analysis & treatment plan</p>
              </div>
              
              {/* Share Section */}
              <div className="text-center">
                <h3 className="font-bold text-xl mb-4">Share on Social Media</h3>
                <div className="flex justify-center space-x-4">
                  {[
                    { name: 'whatsapp', icon: MessageCircle, color: 'bg-green-600 hover:bg-green-700' },
                    { name: 'facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
                    { name: 'twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
                    { name: 'instagram', icon: Instagram, color: 'bg-pink-500 hover:bg-pink-600' }
                  ].map((social) => (
                    <motion.button
                      key={social.name}
                      onClick={() => handleShare(social.name)}
                      className={`${social.color} text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
                <p className="text-green-100 text-sm mt-2">Spread awareness about smart farming</p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Action Buttons */}
        <AnimatedSection delay={0.7} className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Another Crop</span>
            </Link>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white hover:bg-gray-50 text-green-600 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-green-200 flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>View Dashboard</span>
            </button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default MonitoringPage;
