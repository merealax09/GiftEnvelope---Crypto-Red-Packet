
import React, { useState } from 'react';
import { EnvelopeEncryption } from '../lib/encryption.ts';
import { EnvelopeData } from '../types.ts';

interface CreateFormProps {
  onCreated: (data: EnvelopeData[]) => void;
  account: string;
}

const CreateForm: React.FC<CreateFormProps> = ({ onCreated, account }) => {
  const [formData, setFormData] = useState({
    amount: '0.01',
    count: '1',
    message: 'Wishing you prosperity and joy! 🧧',
    token: 'ETH'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }
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
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
          claimed: false,
          message: formData.message,
          createdAt: Date.now()
        });
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      onCreated(envelopes);
    } catch (err) {
      console.error(err);
      alert("Failed to create envelopes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 md:p-10 rounded-[2.5rem] max-w-xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-[900] text-gray-900 mb-2">Create Packets</h2>
        <p className="text-gray-500 text-sm">Fill in the details to generate your unique gift links.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-[800] text-gray-400 uppercase tracking-widest ml-1">Value Per Gift</label>
            <div className="relative group">
              <input 
                type="number" 
                step="0.0001"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-900 group-hover:border-gray-300"
                required
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-red-600 bg-red-50 px-2 py-1 rounded-lg text-xs">ETH</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-[800] text-gray-400 uppercase tracking-widest ml-1">Total Packets</label>
            <input 
              type="number" 
              min="1"
              max="20"
              value={formData.count}
              onChange={(e) => setFormData({...formData, count: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-[800] text-gray-400 uppercase tracking-widest ml-1">Message</label>
          <textarea 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all h-32 resize-none font-medium text-gray-700 leading-relaxed"
            placeholder="Write a heartfelt message..."
          />
        </div>

        <div className="bg-red-50 rounded-2xl p-4 flex items-start gap-3 border border-red-100">
          <span className="text-xl">💡</span>
          <p className="text-[11px] text-red-700 leading-normal font-medium">
            Your funds will be securely locked in the smart contract. You can reclaim them if they aren't opened within 7 days.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading || !account}
          className="w-full premium-gradient hover:shadow-2xl hover:shadow-red-200 disabled:bg-gray-200 disabled:shadow-none text-white font-[800] py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Transaction...
            </>
          ) : !account ? (
            'Connect Wallet to Create'
          ) : (
            'Generate Gifting Links'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
