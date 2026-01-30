
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, EnvelopeData } from './types.ts';
import { connectWallet, switchToBase } from './lib/web3.ts';
import { EnvelopeEncryption } from './lib/encryption.ts';
import RedEnvelope from './components/RedEnvelope.tsx';
import CreateForm from './components/CreateForm.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [account, setAccount] = useState<string>('');
  const [history, setHistory] = useState<EnvelopeData[]>([]);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'claimed'>('idle');
  const [claimedData, setClaimedData] = useState<Partial<EnvelopeData> | null>(null);

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/claim/')) {
      const encodedSecret = hash.replace('#/claim/', '');
      setActiveLink(encodedSecret);
      setView(AppView.CLAIM);
    } else if (hash === '#/history') {
      setView(AppView.HISTORY);
    } else if (hash === '#/create') {
      setView(AppView.CREATE);
    } else {
      setView(AppView.HOME);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    const saved = localStorage.getItem('gift_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAccount(addr);
      await switchToBase();
    } catch (err: any) {
      console.warn('Wallet connection skipped or failed:', err.message);
    }
  };

  const onCreated = (newEnvelopes: EnvelopeData[]) => {
    const updatedHistory = [...newEnvelopes, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('gift_history', JSON.stringify(updatedHistory));
    window.location.hash = '#/history';
  };

  const handleClaim = async () => {
    if (!activeLink) return;
    setClaimStatus('claiming');
    try {
      // Decode link to verify validity
      EnvelopeEncryption.decodeLink(activeLink);
      // Simulate chain processing
      await new Promise(resolve => setTimeout(resolve, 2200));
      setClaimedData({
        amount: '0.01',
        token: 'ETH',
        message: 'Wishing you wealth and good fortune!'
      });
      setClaimStatus('claimed');
    } catch (err) {
      alert("Invalid or expired gift link.");
      setClaimStatus('idle');
    }
  };

  const copyToClipboard = (encodedSecret: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/claim/${encodedSecret}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied! Share it with your friend.");
    });
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Premium Navigation */}
      <nav className="bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-[60]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => window.location.hash = '#/'}
          >
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl">🧧</span>
            </div>
            <h1 className="text-xl font-[900] tracking-tight text-gray-900">
              Gift<span className="text-red-600">Envelope</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {account ? (
              <div className="flex items-center gap-3 bg-red-50/50 p-1.5 pl-4 rounded-2xl border border-red-100/50">
                <span className="text-xs font-bold text-red-600 hidden sm:block">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button 
                  onClick={() => window.location.hash = '#/history'}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${view === AppView.HISTORY ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  🕒
                </button>
              </div>
            ) : (
              <button 
                onClick={handleConnect}
                className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl shadow-xl hover:shadow-gray-200 transition-all text-sm active:scale-95"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {view === AppView.HOME && (
          <div className="text-center space-y-12 py-12 animate-fade-in">
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                The Standard for Crypto Gifting
              </div>
              <h2 className="text-5xl md:text-7xl font-[900] text-gray-900 leading-[1.05] tracking-tight text-balance">
                Digital red packets <br/> made <span className="text-red-600">effortless.</span>
              </h2>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed text-balance max-w-xl mx-auto">
                Securely send ETH to friends with a simple link. Beautifully designed, end-to-end encrypted, and ready for Base.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.hash = '#/create'}
                className="premium-gradient hover:shadow-2xl hover:shadow-red-200 text-white font-black py-5 px-12 rounded-2xl shadow-xl transition-all text-lg flex items-center justify-center gap-3 active:scale-95"
              >
                Send a Gift
              </button>
              <button 
                onClick={() => window.location.hash = '#/history'}
                className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-5 px-12 rounded-2xl border border-gray-100 shadow-sm transition-all text-lg active:scale-95"
              >
                My History
              </button>
            </div>

            <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🛡️', title: 'On-Chain Security', desc: 'Non-custodial and secure. Only the holder of your unique link can claim the funds.' },
                { icon: '⚡', title: 'Instant Claim', desc: 'Recipients get their funds instantly without waiting for complex confirmations.' },
                { icon: '🌊', title: 'Seamless UI', desc: 'Crafted with a focus on experience, making crypto feel as simple as a web link.' }
              ].map((f, i) => (
                <div key={i} className="glass-card p-10 rounded-[2.5rem] text-left hover:-translate-y-2 transition-transform duration-500">
                  <div className="text-5xl mb-8">{f.icon}</div>
                  <h4 className="text-xl font-extrabold text-gray-900 mb-3">{f.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === AppView.CREATE && (
          <div className="animate-fade-in">
            <CreateForm account={account} onCreated={onCreated} />
          </div>
        )}

        {view === AppView.CLAIM && (
          <div className="max-w-md mx-auto space-y-12 animate-fade-in py-8">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-[900] text-gray-900">Surprise!</h2>
              <p className="text-gray-500 font-medium">Someone has sent you a digital red packet</p>
            </div>
            
            <RedEnvelope 
              isOpen={claimStatus === 'claimed'} 
              amount={claimedData?.amount}
              message={claimedData?.message}
              onOpen={handleClaim}
            />

            <div className="min-h-[100px] flex flex-col items-center justify-center">
              {claimStatus === 'idle' && (
                <p className="text-red-500 font-bold animate-bounce text-sm uppercase tracking-widest">Tap to reveal gift</p>
              )}
              {claimStatus === 'claiming' && (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-[3px] border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-red-600 font-[800] text-xs uppercase tracking-widest animate-pulse">Confirming on Base...</p>
                </div>
              )}
              {claimStatus === 'claimed' && (
                <div className="text-center space-y-6 animate-fade-in w-full">
                  <div className="bg-green-50 text-green-700 px-6 py-4 rounded-2xl font-[800] border border-green-100 shadow-sm flex items-center justify-center gap-3">
                    <span className="text-xl">✨</span> Successfully Claimed!
                  </div>
                  <button 
                    onClick={() => window.location.hash = '#/'}
                    className="w-full bg-gray-900 text-white font-[800] py-4 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-100"
                  >
                    Send One Yourself
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === AppView.HISTORY && (
          <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-[900] text-gray-900 tracking-tight">History</h2>
                <p className="text-gray-500 text-sm font-medium">Manage and share your gifting links</p>
              </div>
              <button 
                onClick={() => window.location.hash = '#/create'}
                className="bg-red-50 text-red-600 font-black px-5 py-2.5 rounded-xl hover:bg-red-100 transition-colors text-sm"
              >
                + New Gift
              </button>
            </div>
            
            {history.length === 0 ? (
              <div className="glass-card p-24 text-center rounded-[3rem] border-dashed border-2 border-gray-200">
                <div className="text-6xl mb-6 grayscale opacity-30">🧧</div>
                <p className="text-gray-400 font-[800] text-lg">No active gifts found.</p>
                <button 
                  onClick={() => window.location.hash = '#/create'} 
                  className="mt-4 text-red-600 font-bold hover:underline"
                >
                  Create your first link
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {history.map((item) => (
                  <div key={item.id} className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-2xl hover:shadow-red-50 transition-all group">
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-red-100 group-hover:scale-105 transition-transform">
                        🧧
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-black text-2xl text-gray-900">{item.amount} {item.token}</span>
                          <span className="px-2.5 py-1 rounded-lg bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-wider">Unclaimed</span>
                        </div>
                        <div className="text-sm text-gray-400 font-medium truncate italic max-w-[280px]">"{item.message}"</div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <button 
                        onClick={() => copyToClipboard(EnvelopeEncryption.encodeLink(item.secret))}
                        className="w-full bg-white border border-gray-100 hover:border-red-200 hover:bg-red-50 text-gray-900 hover:text-red-600 font-black py-3.5 px-8 rounded-2xl transition-all shadow-sm active:scale-95"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Mobile Dock */}
      <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-950/90 backdrop-blur-2xl rounded-[2rem] p-2.5 shadow-2xl z-[100] sm:hidden border border-white/10 w-[85%] max-w-[360px]">
        <div className="flex justify-around items-center">
          {[
            { id: AppView.HOME, icon: '🏠', label: 'Home', hash: '#/' },
            { id: AppView.CREATE, icon: '🧧', label: 'Create', hash: '#/create' },
            { id: AppView.HISTORY, icon: '🕒', label: 'History', hash: '#/history' }
          ].map((nav) => (
            <button 
              key={nav.id}
              onClick={() => window.location.hash = nav.hash}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-6 rounded-2xl transition-all ${view === nav.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <span className="text-xl">{nav.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{nav.label}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default App;
