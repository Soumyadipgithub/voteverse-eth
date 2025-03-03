
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/context/Web3Context';
import { Loader2, Wallet } from 'lucide-react';

const WalletConnection: React.FC = () => {
   const {
    account,
    connectWallet,
    loading
  } = useWeb3();
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return <div className="flex items-center space-x-2">
      {account ? <Button variant="outline" className="h-10 px-4 py-2 rounded-md glass-card border border-gray-200">
          <Wallet className="w-4 h-4 mr-2" />
          <span className="font-medium">{formatAddress(account)}</span>
         </Button> : <Button onClick={connectWallet} disabled={loading} className="h-10 py-2 bg-votex-primary hover:bg-votex-primary/90 text-white rounded-md shadow-button hover:shadow-button-hover button-transition px-[22px] text-right mx-[114px]">
          {loading ? <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
          </>}
        </Button>}
    </div>;
};
export default WalletConnection;
