import { DetectionResult } from '../types';

// Mock disease database
const diseaseDatabase = {
  tomato: [
    {
      disease: 'Tomato Leaf Curl Virus',
      remedy: 'Remove infected plants immediately. Apply neem oil spray. Use yellow sticky traps for whiteflies.',
      preventive: ['Use virus-free seeds', 'Control whitefly population', 'Maintain proper plant spacing']
    },
    {
      disease: 'Early Blight',
      remedy: 'Apply copper-based fungicide. Remove affected leaves. Ensure good air circulation.',
      preventive: ['Avoid overhead watering', 'Crop rotation', 'Proper spacing between plants']
    },
    {
      disease: 'Bacterial Wilt',
      remedy: 'No cure available. Remove and destroy infected plants. Soil sterilization recommended.',
      preventive: ['Use resistant varieties', 'Avoid waterlogged conditions', 'Clean tools between plants']
    }
  ],
  potato: [
    {
      disease: 'Late Blight',
      remedy: 'Apply fungicide containing metalaxyl. Remove infected tubers. Improve drainage.',
      preventive: ['Plant certified seed potatoes', 'Avoid overhead irrigation', 'Destroy crop debris']
    },
    {
      disease: 'Potato Scab',
      remedy: 'Maintain soil pH 5.0-5.2. Apply sulfur to acidify soil. Avoid fresh manure.',
      preventive: ['Use scab-resistant varieties', 'Maintain proper soil moisture', 'Crop rotation']
    }
  ],
  wheat: [
    {
      disease: 'Rust',
      remedy: 'Apply fungicide at first signs. Remove alternate hosts nearby.',
      preventive: ['Use resistant varieties', 'Proper spacing', 'Balanced fertilization']
    }
  ],
  rice: [
    {
      disease: 'Blast',
      remedy: 'Apply tricyclazole fungicide. Drain and dry field. Remove infected stubble.',
      preventive: ['Use resistant varieties', 'Balanced nitrogen application', 'Proper water management']
    }
  ],
  corn: [
    {
      disease: 'Corn Smut',
      remedy: 'Remove and destroy infected ears. Apply fungicide preventively.',
      preventive: ['Avoid mechanical damage', 'Balanced nutrition', 'Crop rotation']
    }
  ],
  cotton: [
    {
      disease: 'Bollworm',
      remedy: 'Apply neem-based pesticide. Use pheromone traps. Hand-pick larvae.',
      preventive: ['Intercropping with marigold', 'Regular monitoring', 'Bt cotton varieties']
    }
  ],
  sugarcane: [
    {
      disease: 'Red Rot',
      remedy: 'Remove infected canes. Apply copper oxychloride. Improve drainage.',
      preventive: ['Use healthy seeds', 'Avoid waterlogging', 'Proper spacing']
    }
  ],
  soybean: [
    {
      disease: 'Soybean Rust',
      remedy: 'Apply triazole fungicide. Remove crop residue. Improve air circulation.',
      preventive: ['Use resistant varieties', 'Monitor regularly', 'Proper plant density']
    }
  ]
};

export const mockDetectDisease = async (
  imageFile: File, 
  cropType: string, 
  language: string
): Promise<DetectionResult> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

  const diseases = diseaseDatabase[cropType as keyof typeof diseaseDatabase] || diseaseDatabase.tomato;
  const selectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
  
  const confidence = 75 + Math.random() * 20; // 75-95% confidence

  const result: DetectionResult = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    crop: cropType,
    disease: selectedDisease.disease,
    confidence: Math.round(confidence),
    remedy: selectedDisease.remedy,
    preventiveMeasures: selectedDisease.preventive,
    timestamp: new Date().toISOString(),
    imageUrl: URL.createObjectURL(imageFile),
    language: language
  };

  return result;
};

// Simulate healthy crop detection
export const detectHealthyCrop = (cropType: string, language: string): DetectionResult => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    crop: cropType,
    disease: 'Healthy Crop',
    confidence: 95,
    remedy: 'Your crop appears healthy! Continue with regular care and monitoring.',
    preventiveMeasures: [
      'Maintain regular watering schedule',
      'Monitor for early signs of disease',
      'Apply balanced fertilizer as needed',
      'Keep the area clean and weed-free'
    ],
    timestamp: new Date().toISOString(),
    language: language
  };
};