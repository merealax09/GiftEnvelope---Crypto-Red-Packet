
import React, { useState, useEffect } from 'react';
import { AppView, EnvelopeData } from './types';
import { connectWallet, switchToBase } from './lib/web3';
import { EnvelopeEncryption } from './lib/encryption';
import RedEnvelope from './components/RedEnvelope';
import CreateForm from './components/CreateForm';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [account, setAccount] = useState<string>('');
  const [history, setHistory] = useState<EnvelopeData[]>([]);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'claimed'>('idle');
  const [claimedData, setClaimedData] = useState<Partial<EnvelopeData> | null>(null);

  useEffect(() => {
    // Check for claim link in URL hash
    const hash = window.location.hash;
    if (hash.startsWith('#/claim/')) {
      const encodedSecret = hash.replace('#/claim/', '');
      setActiveLink(encodedSecret);
      setView(AppView.CLAIM);
    }

    // Load history from localStorage (Mock persistence)
    const saved = localStorage.getItem('gift_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAccount(addr);
      await switchToBase();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const onCreated = (newEnvelopes: EnvelopeData[]) => {
    const updatedHistory = [...newEnvelopes, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('gift_history', JSON.stringify(updatedHistory));
    setView(AppView.HISTORY);
  };

  const handleClaim = async () => {
    if (!activeLink) return;
    setClaimStatus('claiming');
    
    try {
      const secret = EnvelopeEncryption.decodeLink(activeLink);
      // Simulate claim interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setClaimedData({
        amount: '0.01',
        token: 'ETH',
        message: 'Wishing you wealth and prosperity!'
      });
      setClaimStatus('claimed');
    } catch (err) {
      alert("Invalid gift link");
      setClaimStatus('idle');
    }
  };

  const copyToClipboard = (encodedSecret: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/claim/${encodedSecret}`;
    navigator.clipboard.writeText(url);
    alert("Link copied! Share it with the receiver.");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView(AppView.HOME)}
          >
            <span className="text-3xl">🧧</span>
            <h1 className="text-xl font-extrabold text-red-600 hidden sm:block">GiftEnvelope</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {account ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setView(AppView.HISTORY)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                >
                  🕒
                </button>
                <div className="bg-red-50 px-4 py-1.5 rounded-full border border-red-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-red-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-red-200 transition-all text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        {view === AppView.HOME && (
          <div className="text-center space-y-8 py-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-gray-900 leading-tight">
                Send Crypto Packets <br/> <span className="text-red-600">Instantly</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-lg mx-auto">
                Securely gift digital assets to anyone with just a link. End-to-end encrypted and powered by Base.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => account ? setView(AppView.CREATE) : handleConnect()}
                className="bg-red-600 hover:bg-red-700 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-red-200 transition-all text-lg flex items-center justify-center gap-3"
              >
                <span>🎁</span> Create Now
              </button>
              <button 
                onClick={() => setView(AppView.HISTORY)}
                className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-5 px-10 rounded-2xl border border-gray-200 shadow-sm transition-all text-lg"
              >
                View History
              </button>
            </div>

            <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-2xl text-left border-b-4 border-red-500">
                <div className="text-3xl mb-3">🔐</div>
                <h4 className="font-bold mb-2">Non-Custodial</h4>
                <p className="text-sm text-gray-500">Your funds stay in the smart contract until claimed. No middleman.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-left border-b-4 border-yellow-500">
                <div className="text-3xl mb-3">🔗</div>
                <h4 className="font-bold mb-2">Claim via Link</h4>
                <p className="text-sm text-gray-500">Recipients don't need a wallet beforehand. They can create one to claim.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-left border-b-4 border-blue-500">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-bold mb-2">Low Gas</h4>
                <p className="text-sm text-gray-500">Built on Base for sub-cent transaction fees. Fast and efficient.</p>
              </div>
            </div>
          </div>
        )}

        {view === AppView.CREATE && (
          <CreateForm account={account} onCreated={onCreated} />
        )}

        {view === AppView.CLAIM && (
          <div className="max-w-sm mx-auto space-y-8">
            <h2 className="text-3xl font-black text-center text-gray-900">Surprise! 🎁</h2>
            <RedEnvelope 
              isOpen={claimStatus === 'claimed'} 
              amount={claimedData?.amount}
              message={claimedData?.message}
              onOpen={handleClaim}
            />
            {claimStatus === 'idle' && (
              <p className="text-center text-gray-500 animate-bounce">Tap the envelope to open</p>
            )}
            {claimStatus === 'claiming' && (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-red-600 font-bold">Verifying on Blockchain...</p>
              </div>
            )}
            {claimStatus === 'claimed' && (
              <div className="text-center animate-fade-in space-y-4">
                <p className="text-green-600 font-bold text-xl flex items-center justify-center gap-2">
                  <span>✅</span> Successfully Claimed!
                </p>
                <button 
                  onClick={() => setView(AppView.HOME)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-xl transition-all"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>
        )}

        {view === AppView.HISTORY && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">Your Created Gifts</h2>
              <button 
                onClick={() => setView(AppView.CREATE)}
                className="text-red-600 font-bold hover:underline"
              >
                + New Gift
              </button>
            </div>
            
            {history.length === 0 ? (
              <div className="glass-card p-12 text-center rounded-2xl border-dashed border-2 border-gray-200">
                <p className="text-gray-400">No gifts created yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {history.map((item) => (
                  <div key={item.id} className="glass-card p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                        🧧
                      </div>
                      <div>
                        <div className="font-black text-gray-900">{item.amount} {item.token}</div>
                        <div className="text-xs text-gray-400">Created {new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => copyToClipboard(EnvelopeEncryption.encodeLink(item.secret))}
                        className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-4 rounded-xl transition-all text-sm"
                      >
                        Copy Link
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 py-3 sm:py-4 px-4 sm:hidden">
        <div className="flex justify-around items-center">
          <button onClick={() => setView(AppView.HOME)} className={`flex flex-col items-center gap-1 ${view === AppView.HOME ? 'text-red-600' : 'text-gray-400'}`}>
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => setView(AppView.CREATE)} className={`flex flex-col items-center gap-1 ${view === AppView.CREATE ? 'text-red-600' : 'text-gray-400'}`}>
            <span className="text-xl">➕</span>
            <span className="text-[10px] font-bold">Create</span>
          </button>
          <button onClick={() => setView(AppView.HISTORY)} className={`flex flex-col items-center gap-1 ${view === AppView.HISTORY ? 'text-red-600' : 'text-gray-400'}`}>
            <span className="text-xl">🕒</span>
            <span className="text-[10px] font-bold">History</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
