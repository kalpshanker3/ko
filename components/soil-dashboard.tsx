'use client'

import { useState, useRef } from 'react'
import { Upload, Zap, Leaf, Droplets, Bug, TrendingUp, X } from 'lucide-react'
import Image from 'next/image'

interface CropRecommendation {
  name: string
  suitability: number
  waterNeeds: string
  fertilizerType: string
  riskFactors: string[]
  growthDays: number
}

interface AnalysisResult {
  soilType: string
  pH: number
  textureClass: string
  organicMatter: string
  moisture: string
  recommendations: CropRecommendation[]
  timestamp: string
}

const COMMON_RECOMMENDATIONS: CropRecommendation[] = [
  { name: 'Rice', suitability: 92, waterNeeds: 'High (1200-1500mm)', fertilizerType: 'Nitrogen + Phosphate', riskFactors: ['Drainage required', 'Monitor for fungal diseases'], growthDays: 120 },
  { name: 'Wheat', suitability: 88, waterNeeds: 'Medium (400-500mm)', fertilizerType: 'Balanced NPK', riskFactors: ['Moderate salt tolerance needed'], growthDays: 150 },
  { name: 'Maize', suitability: 85, waterNeeds: 'Medium-High (500-700mm)', fertilizerType: 'Nitrogen-rich', riskFactors: ['Requires good drainage', 'Susceptible to borers'], growthDays: 120 },
  { name: 'Legumes (Chickpea)', suitability: 82, waterNeeds: 'Low-Medium (350-450mm)', fertilizerType: 'Phosphate + Potassium', riskFactors: ['Prefers well-drained soil'], growthDays: 110 },
]

const SOIL_DATA: Omit<AnalysisResult, 'timestamp'>[] = [
  { soilType: 'Loamy Clay', pH: 6.8, textureClass: 'Silty Loam', organicMatter: '4.2% (Good)', moisture: 'Moderate (15-18%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Sandy Loam', pH: 6.2, textureClass: 'Coarse Loam', organicMatter: '2.1% (Fair)', moisture: 'Low (8-11%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Black Cotton Soil', pH: 7.4, textureClass: 'Heavy Clay', organicMatter: '3.8% (Good)', moisture: 'High (22-26%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Red Laterite', pH: 5.6, textureClass: 'Sandy Clay Loam', organicMatter: '1.8% (Fair)', moisture: 'Low (9-12%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Alluvial Soil', pH: 7.0, textureClass: 'Fine Loam', organicMatter: '3.4% (Good)', moisture: 'Moderate (16-20%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Silty Soil', pH: 6.6, textureClass: 'Fine Silt', organicMatter: '4.8% (Excellent)', moisture: 'High (20-24%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Peaty Soil', pH: 5.2, textureClass: 'Organic Loam', organicMatter: '8.6% (Excellent)', moisture: 'Very High (28-34%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Chalky Soil', pH: 8.1, textureClass: 'Calcareous Loam', organicMatter: '1.5% (Low)', moisture: 'Moderate (13-16%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Sandy Soil', pH: 6.0, textureClass: 'Very Coarse Sand', organicMatter: '1.2% (Low)', moisture: 'Very Low (5-8%)', recommendations: COMMON_RECOMMENDATIONS },
  { soilType: 'Mountain Forest Soil', pH: 6.4, textureClass: 'Humus-rich Loam', organicMatter: '6.1% (Excellent)', moisture: 'Moderate (17-21%)', recommendations: COMMON_RECOMMENDATIONS },
]

export default function SoilDashboard() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisNumber, setAnalysisNumber] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        simulateAnalysis()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateAnalysis = () => {
    setAnalyzing(true)
    setUploadProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + Math.random() * 25
      })
    }, 400)

    // Simulate API response delay
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)

      const soilData = SOIL_DATA[analysisNumber % SOIL_DATA.length]
      setAnalysis({
        ...soilData,
        recommendations: soilData.recommendations.map((crop) => ({ ...crop })),
        timestamp: new Date().toLocaleString(),
      })
      setAnalysisNumber((current) => current + 1)
      setAnalyzing(false)
    }, 3000)
  }

  const clearAnalysis = () => {
    setImage(null)
    setAnalysis(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-slate-950/80 border-b border-green-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">SmartSoil</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">AI Crop Advisor</p>
            </div>
          </div>
          <div className="text-right text-sm text-slate-600 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-white">Soil Intelligence</p>
            <p className="text-xs">For Better Harvests</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-green-100 dark:border-slate-800">
              {!image ? (
                <div className="p-8">
                  <div className="text-center">
                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full">
                      <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Upload Soil Photo
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                      Take a clear photo of your soil in natural light. Frame the soil surface with consistent lighting for accurate AI analysis.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95"
                    >
                      <Upload className="w-5 h-5" />
                      Choose Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload soil image"
                    />
                    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        <strong>Tip:</strong> For best results, shoot the photo in daylight with the soil forming 70% of the frame. Avoid shadows and extreme angles.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="relative mb-6 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                      src={image}
                      alt="Uploaded soil photo"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    {!analyzing && analysis && (
                      <button
                        onClick={clearAnalysis}
                        className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        aria-label="Clear and upload new photo"
                      >
                        <X className="w-4 h-4 text-slate-600 dark:text-slate-400 hover:text-red-600" />
                      </button>
                    )}
                  </div>

                  {analyzing ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="font-medium text-slate-900 dark:text-white">
                            Analyzing soil properties...
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 pt-2">
                        <Zap className="w-4 h-4 animate-spin text-green-500" />
                        <span>Extracting soil features with computer vision...</span>
                      </div>
                    </div>
                  ) : (
                    analysis && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Soil Type</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{analysis.soilType}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">pH Level</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{analysis.pH.toFixed(1)}</p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Texture</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {analysis.textureClass}
                          </p>
                        </div>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Organic Matter</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {analysis.organicMatter}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-green-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                How It Works
              </h3>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">Upload</strong> a clear soil photo
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">Analyze</strong> soil properties with AI
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">Receive</strong> ranked crop recommendations
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>
                    <strong className="text-slate-900 dark:text-white">Plan</strong> your farm with guidance
                  </span>
                </li>
              </ol>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                  <strong>Powered by:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded font-medium">
                    TensorFlow
                  </span>
                  <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded font-medium">
                    OpenCV
                  </span>
                  <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded font-medium">
                    scikit-learn
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {analysis && !analyzing && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Crop Recommendations
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.recommendations.map((crop, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 border border-green-100 dark:border-slate-800 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {crop.name}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-green-600">
                        {crop.suitability}%
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Suitability</span>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                      style={{ width: `${crop.suitability}%` }}
                    />
                  </div>

                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          Water Needs
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">{crop.waterNeeds}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          Fertilizer Type
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          {crop.fertilizerType}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          Growth Duration
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          ~{crop.growthDays} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {crop.riskFactors.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                        <Bug className="w-3 h-3" />
                        Risk Factors
                      </p>
                      <ul className="space-y-1">
                        {crop.riskFactors.map((risk, i) => (
                          <li
                            key={i}
                            className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2"
                          >
                            <span className="flex-shrink-0 text-slate-400">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                General Farming Guidance
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">→</span>
                  <span>
                    Prepare seedbeds 2–3 weeks before planting. Consider crop rotation with legumes to
                    improve nitrogen fixation.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">→</span>
                  <span>
                    Monitor soil moisture regularly. Irrigate based on growth stage and local rainfall
                    patterns.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">→</span>
                  <span>
                    Apply fertilizer in split doses during key growth windows to minimize leaching
                    and nutrient loss.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold">→</span>
                  <span>
                    Scout fields weekly for pests and diseases. Use integrated pest management (IPM)
                    practices.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-green-100 dark:border-slate-800 mt-12 py-6 bg-white/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            SmartSoil — AI Soil & Crop Recommendation System | Mini Project Session 2026–27
          </p>
          <p className="mt-1 text-xs">
            Developed with TensorFlow, OpenCV, and scikit-learn for agricultural decision support
          </p>
        </div>
      </footer>
    </div>
  )
}
