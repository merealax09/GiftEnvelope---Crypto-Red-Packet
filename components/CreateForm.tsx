
import React, { useState } from 'react';
import { EnvelopeEncryption } from '../lib/encryption';
import { EnvelopeData } from '../types';

interface CreateFormProps {
  onCreated: (data: EnvelopeData[]) => void;
  account: string;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreated, account }) => {
  const [formData, setFormData] = useState({
    amount: '0.01',
    count: '1',
    message: 'Happy Holidays! 🧧',
    token: 'ETH'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const count = parseInt(formData.count);
      const envelopes: EnvelopeData[] = [];

      for (let i = 0; i < count; i++) {
        const secret = EnvelopeEncryption.generateSecret();
        const hash = EnvelopeEncryption.generateHash(secret);
        
        envelopes.push({
          id: hash,
          secret: secret,
          creator: account,
          token: formData.token,
          amount: formData.amount,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
          claimed: false,
          message: formData.message,
          createdAt: Date.now()
        });
      }

      // Simulate on-chain transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onCreated(envelopes);
    } catch (err) {
      console.error(err);
      alert("Failed to create envelopes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <span>🧧</span> Create New Gifts
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Amount per Packet</label>
          <div className="relative">
            <input 
              type="number" 
              step="0.0001"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">ETH</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Packets</label>
          <input 
            type="number" 
            min="1"
            max="10"
            value={formData.count}
            onChange={(e) => setFormData({...formData, count: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Message</label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all h-24 resize-none"
            placeholder="Write a warm note..."
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            'Generate & Deposit'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
