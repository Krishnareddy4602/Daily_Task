import React, { useState } from 'react';
import { FormTab } from './components/FormTab';

function App() {
  const [activeTab, setActiveTab] = useState<'vishnu' | 'krishna'>('vishnu');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Daily Tasks
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Update Your Daily Work Here
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('vishnu')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'vishnu'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                Vishnu
              </button>
              <button
                onClick={() => setActiveTab('krishna')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'krishna'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'
                }`}
              >
                Krishna
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          <div className="transform transition-all duration-500 ease-in-out">
            {activeTab === 'vishnu' && (
              <FormTab category="vishnu" title="Vishnu" />
            )}
            {activeTab === 'krishna' && (
              <FormTab category="krishna" title="Krishna" />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p></p>
        </footer>
      </div>
    </div>
  );
}

export default App;