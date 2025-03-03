import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import WalletConnection from '@/components/WalletConnection';
import { useWeb3 } from '@/context/Web3Context';
import { useNavigate } from 'react-router-dom';
import { Settings, Vote } from 'lucide-react';
import AdminAuth from '@/components/AdminAuth';

const Index = () => {
  const { account } = useWeb3();
  const navigate = useNavigate();
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  const handleVoterClick = () => {
    navigate('/voter');
  };

  const handleAdminClick = () => {
    setShowAdminAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="w-full px-4 py-6 flex justify-between items-center animate-fade-in">
        <div className="flex items-center">
          <img src="/icon.png" alt="VoteX Logo" className="w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-votex-primary to-votex-secondary">
            VoteX
          </h1>
        </div>
        <WalletConnection />
      </header>

      <main className="flex flex-col items-center justify-center px-4 pb-20 pt-10">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
          <div className="inline-block px-3 py-1 mb-4 bg-blue-50 text-votex-primary rounded-full text-sm">
            Secure. Transparent. Decentralized.
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Blockchain Voting for the Modern World
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Experience the future of voting with our secure, transparent, and immutable blockchain-based voting platform.
          </p>
        </div>

        {!account ? (
          <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md animate-fade-in">
            <div className="glassmorphism w-full py-8 px-6 text-center">
              <p className="mb-4 text-lg">Connect your wallet to get started</p>
              <WalletConnection />
            </div>
          </div>
        ) : showAdminAuth ? (
          <div className="w-full max-w-md animate-scale-in">
            <AdminAuth />
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => setShowAdminAuth(false)}>
                Back to options
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl animate-scale-in">
            <Button
              onClick={handleVoterClick}
              className="h-40 glass-card flex flex-col items-center justify-center space-y-4 p-6 text-center card-hover bg-white hover:bg-gray-50 border border-gray-200"
            >
              <Vote className="h-12 w-12 text-votex-primary" />
              <div>
                <h3 className="text-xl font-medium text-gray-900">Voter Portal</h3>
                <p className="text-sm text-gray-500 mt-1">Cast your vote in active elections</p>
              </div>
            </Button>

            <Button
              onClick={handleAdminClick}
              className="h-40 glass-card flex flex-col items-center justify-center space-y-4 p-6 text-center card-hover bg-white hover:bg-gray-50 border border-gray-200"
            >
              <Settings className="h-12 w-12 text-votex-accent" />
              <div>
                <h3 className="text-xl font-medium text-gray-900">Admin Portal</h3>
                <p className="text-sm text-gray-500 mt-1">Manage elections and candidates</p>
              </div>
            </Button>
          </div>
        )}

        <div className="mt-20 w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphism p-6 text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-votex-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">Built on Ethereum blockchain to ensure tamper-proof voting records</p>
            </div>

            <div className="glassmorphism p-6 text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-votex-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Transparent</h3>
              <p className="text-gray-600 text-sm">Full visibility into the voting process and results verification</p>
            </div>

            <div className="glassmorphism p-6 text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-votex-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Efficient</h3>
              <p className="text-gray-600 text-sm">Fast and reliable voting with instant results when voting ends</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} VoteX. All rights reserved.</p>
          <p className="mt-2">Powered by Ethereum blockchain technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
