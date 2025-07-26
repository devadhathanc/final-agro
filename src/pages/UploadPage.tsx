import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Loader2,
  Check,
  X,
  MessageCircle,
  Sparkles,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { storage } from '../utils/storage';
import { DetectionResult } from '../types';

const crops = [
  { id: 'tomato', name: 'crops.tomato', icon: '🍅' },
  { id: 'potato', name: 'crops.potato', icon: '🥔' },
  { id: 'wheat', name: 'crops.wheat', icon: '🌾' },
  { id: 'rice', name: 'crops.rice', icon: '🌾' },
  { id: 'corn', name: 'crops.corn', icon: '🌽' },
  { id: 'cotton', name: 'crops.cotton', icon: '🌱' },
  { id: 'sugarcane', name: 'crops.sugarcane', icon: '🎋' },
  { id: 'soybean', name: 'crops.soybean', icon: '🌿' }
];

const UploadPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDetection = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }
    setIsProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      const detectionResult: DetectionResult = {
        ...result,
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(selectedFile),
        language,
      };
      storage.saveDetection(detectionResult);
      navigate("/result", { state: { result: detectionResult } });
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            {t('upload.title')}
          </h1>
          <p className="text-lg text-green-600">
            {t('upload.subtitle')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Upload Form */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-green-800 mb-4">
              Upload Crop Image
            </label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-green-500 bg-green-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-25' 
                    : 'border-green-200 hover:border-green-400 hover:bg-green-25'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-16 h-16 text-green-400" />
                  </div>
                  <div className="text-lg text-green-600">
                    {t('upload.drop.text')}
                  </div>
                  <div className="text-sm text-green-500">
                    {t('upload.drop.formats')}
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {/* Detect Button */}
            <button
              onClick={handleDetection}
              disabled={!selectedFile || isProcessing}
              className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                !selectedFile || isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>{t('upload.processing')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Check className="w-6 h-6" />
                  <span>{t('upload.detect')}</span>
                </div>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;