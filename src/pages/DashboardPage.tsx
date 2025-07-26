import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Filter,
  Search,
  Eye,
  Download,
  Trash2,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Camera
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../utils/storage';
import { DetectionResult } from '../types';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [filteredDetections, setFilteredDetections] = useState<DetectionResult[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'crop' | 'confidence'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  const cropTypes = ['all', 'tomato', 'potato', 'wheat', 'rice', 'corn', 'cotton', 'sugarcane', 'soybean'];

  useEffect(() => {
    const storedDetections = storage.getDetections();
    setDetections(storedDetections);
    setFilteredDetections(storedDetections);
  }, []);

  useEffect(() => {
    let filtered = detections;

    // Filter by crop type
    if (selectedCrop !== 'all') {
      filtered = filtered.filter(d => d.crop === selectedCrop);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.crop.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'crop':
          return a.crop.localeCompare(b.crop);
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });

    setFilteredDetections(filtered);
  }, [detections, selectedCrop, sortBy, searchTerm]);

  const handleDelete = (id: string) => {
    const updatedDetections = detections.filter(d => d.id !== id);
    setDetections(updatedDetections);
    storage.saveDetections(updatedDetections);
  };

  const getHealthyCount = () => detections.filter(d => d.disease === 'Healthy Crop').length;
  const getUnhealthyCount = () => detections.filter(d => d.disease !== 'Healthy Crop').length;
  const getAverageConfidence = () => {
    if (detections.length === 0) return 0;
    return Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            My Dashboard
          </h1>
          <p className="text-xl text-green-600">
            Track your crop health analysis history
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={{
            animate: {
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-green-100"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-green-600">{detections.length}</p>
              </div>
              <Camera className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-green-100"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Healthy Crops</p>
                <p className="text-3xl font-bold text-green-600">{getHealthyCount()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Issues Detected</p>
                <p className="text-3xl font-bold text-orange-600">{getUnhealthyCount()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-blue-100"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Confidence</p>
                <p className="text-3xl font-bold text-blue-600">{getAverageConfidence()}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by disease or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Crop Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                {cropTypes.map(crop => (
                  <option key={crop} value={crop}>
                    {crop === 'all' ? 'All Crops' : crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'crop' | 'confidence')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="date">Sort by Date</option>
                <option value="crop">Sort by Crop</option>
                <option value="confidence">Sort by Confidence</option>
              </select>
            </div>

            {/* New Scan Button */}
            <Link
              to="/upload"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Camera className="w-5 h-5" />
              <span>New Scan</span>
            </Link>
          </div>
        </motion.div>

        {/* History Cards */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {filteredDetections.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No scans found</h3>
              <p className="text-gray-500 mb-6">Start scanning your crops to see your history here</p>
              <Link
                to="/upload"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Start Scanning</span>
              </Link>
            </div>
          ) : (
            filteredDetections.map((detection, index) => (
              <motion.div
                key={detection.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Image */}
                  <div className="flex justify-center md:justify-start">
                    {detection.imageUrl ? (
                      <img
                        src={detection.imageUrl}
                        alt={`${detection.crop} scan`}
                        className="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize mb-1">
                      {detection.crop}
                    </h3>
                    <p className={`text-sm font-medium mb-2 ${
                      detection.disease === 'Healthy Crop' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {detection.disease}
                    </p>
                    <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-500">
                      <span>{new Date(detection.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`font-medium ${
                        detection.confidence >= 80 ? 'text-green-600' : 
                        detection.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {detection.confidence}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center md:justify-end space-x-2">
                    <Link
                      to="/result"
                      state={{ result: detection }}
                      className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => {
                        const reportContent = `
AgroIndia Detection Report
Generated: ${new Date(detection.timestamp).toLocaleDateString()}

Crop: ${detection.crop}
Detected Issue: ${detection.disease}
Confidence Level: ${detection.confidence}%

Treatment Recommendation:
${detection.remedy}
                        `;
                        const blob = new Blob([reportContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `agroindia-report-${detection.id}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                      title="Download Report"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(detection.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
