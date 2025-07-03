import React, { useState } from 'react';
import { Calendar, Link, MessageSquare, Send, Loader2 } from 'lucide-react';
import { useFormEntries } from '../hooks/useFormEntries';
import { FormEntry } from '../types/database';

interface FormTabProps {
  category: 'A' | 'B';
  title: string;
}

export const FormTab: React.FC<FormTabProps> = ({ category, title }) => {
  const { entries, loading, error, addEntry } = useFormEntries(category);
  const [formData, setFormData] = useState({
    date: '',
    referral_link: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.referral_link) {
      errors.referral_link = 'Referral link is required';
    } else {
      try {
        new URL(formData.referral_link);
      } catch {
        errors.referral_link = 'Please enter a valid URL';
      }
    }
    
    if (!formData.comment.trim()) {
      errors.comment = 'Comment is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      await addEntry({
        category,
        date: formData.date,
        referral_link: formData.referral_link,
        comment: formData.comment
      });
      
      setFormData({ date: '', referral_link: '', comment: '' });
      setValidationErrors({});
    } catch (err) {
      console.error('Failed to submit form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${category === 'vishnu' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
          {title} Form
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${
                validationErrors.date 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
              } bg-white/70`}
            />
            {validationErrors.date && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
            )}
          </div>

          {/* Referral Link Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="inline w-4 h-4 mr-2" />
              Referral Link (YouTube/GitHub)
            </label>
            <input
              type="url"
              value={formData.referral_link}
              onChange={(e) => handleInputChange('referral_link', e.target.value)}
              placeholder="https://youtube.com/... or https://github.com/..."
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${
                validationErrors.referral_link 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
              } bg-white/70`}
            />
            {validationErrors.referral_link && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.referral_link}</p>
            )}
          </div>

          {/* Comment Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Comment
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Enter your comment here..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 resize-none ${
                validationErrors.comment 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
              } bg-white/70`}
            />
            {validationErrors.comment && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.comment}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
              category === 'vishnu'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Submit Entry
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Entries Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Submitted Entries</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            Error: {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading entries...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Submit your first entry above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Referral Link</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Comment</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={entry.referral_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors text-sm"
                      >
                        <Link className="w-3 h-3" />
                        Visit Link
                      </a>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 max-w-xs truncate">
                      {entry.comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};