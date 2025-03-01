
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { Election, ElectionStatus, Candidate, Voter } from '@/utils/types';

// Mock data for development
const MOCK_ELECTIONS: Election[] = [
  {
    id: 1,
    title: "Student Council Election",
    description: "Vote for your student council representative",
    startTime: Date.now() - 86400000, // yesterday
    endTime: Date.now() + 86400000, // tomorrow
    status: ElectionStatus.ACTIVE,
    candidates: [
      { id: 1, name: "Ravi Raj", party: "Nihant Party", votes: 0 },
      { id: 2, name: "Rahul kumar", party: "Future Alliance", votes: 0 },
      { id: 3, name: "Soumyadip Giri", party: "Student Voice", votes: 0 },
      { id: 4, name: "Aman Das", party: "Top Group", votes: 0 },
      { id: 5, name: "Sima Kumari", party: "Baba Team", votes: 0 },
    ],
    voters: [],
    createdBy: "0x1234567890123456789012345678901234567890"
  },
  {
    id: 2,
    title: "Departmental Head Election",
    description: "Vote for your department head",
    startTime: Date.now() - 172800000, // 2 days ago
    endTime: Date.now() - 86400000, // yesterday
    status: ElectionStatus.ENDED,
    candidates: [
      { id: 1, name: "Frank Miller", party: "Tech Forward", votes: 24 },
      { id: 2, name: "Grace Turner", party: "Innovate Now", votes: 18 },
      { id: 3, name: "Henry Clark", party: "Future Tech", votes: 32 },
    ],
    voters: [],
    createdBy: "0x1234567890123456789012345678901234567890"
  }
];

interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  elections: Election[];
  createElection: (election: Omit<Election, 'id' | 'status' | 'createdBy' | 'voters'>) => Promise<void>;
  startElection: (electionId: number) => Promise<void>;
  endElection: (electionId: number) => Promise<void>;
  castVote: (electionId: number, candidateId: number) => Promise<void>;
  addCandidate: (electionId: number, candidate: Omit<Candidate, 'id' | 'votes'>) => Promise<void>;
  addVoter: (electionId: number, voterAddress: string) => Promise<void>;
  loading: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [elections, setElections] = useState<Election[]>(MOCK_ELECTIONS);
  const [loading, setLoading] = useState(false);

  // Check if MetaMask is installed and get accounts
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (!(window as any).ethereum) {
          console.log("Make sure you have MetaMask installed!");
          return;
        }

        const accounts = await (window as any).ethereum.request({ method: "eth_accounts" });
        
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setAccount(account);
        } else {
          console.log("No authorized account found");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setIsAdmin(false);
        }
      });
    }
    
    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Update election statuses based on time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setElections(prev => prev.map(election => {
        if (election.status === ElectionStatus.PENDING && now >= election.startTime) {
          return { ...election, status: ElectionStatus.ACTIVE };
        }
        if (election.status === ElectionStatus.ACTIVE && now >= election.endTime) {
          return { ...election, status: ElectionStatus.ENDED };
        }
        return election;
      }));
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        toast.error("Please install MetaMask to use this app!");
        return;
      }

      setLoading(true);
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        toast.success("Wallet connected successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting wallet");
    } finally {
      setLoading(false);
    }
  };

  const createElection = async (electionData: Omit<Election, 'id' | 'status' | 'createdBy' | 'voters'>) => {
    try {
      if (!account) {
        toast.error("Please connect your wallet first!");
        return;
      }

      setLoading(true);
      // In a real app, this would be a contract call
      const newElection: Election = {
        ...electionData,
        id: elections.length + 1,
        status: ElectionStatus.PENDING,
        createdBy: account,
        voters: []
      };

      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setElections(prev => [...prev, newElection]);
      toast.success("Election created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create election");
    } finally {
      setLoading(false);
    }
  };

  const startElection = async (electionId: number) => {
    try {
      if (!account) {
        toast.error("Please connect your wallet first!");
        return;
      }

      setLoading(true);
      // In a real app, this would be a contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setElections(prev => prev.map(election => 
        election.id === electionId ? { ...election, status: ElectionStatus.ACTIVE } : election
      ));
      
      toast.success("Voting started successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to start voting");
    } finally {
      setLoading(false);
    }
  };

  const endElection = async (electionId: number) => {
    try {
      if (!account) {
        toast.error("Please connect your wallet first!");
        return;
      }

      setLoading(true);
      // In a real app, this would be a contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setElections(prev => prev.map(election => 
        election.id === electionId ? { ...election, status: ElectionStatus.ENDED } : election
      ));
      
      toast.success("Voting ended successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to end voting");
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (electionId: number, candidateId: number) => {
    try {
      if (!account) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const election = elections.find(e => e.id === electionId);
      if (!election) {
        toast.error("Election not found!");
        return;
      }

      if (election.status !== ElectionStatus.ACTIVE) {
        toast.error("This election is not currently active!");
        return;
      }

      const hasVoted = election.voters.some(voter => voter.address === account && voter.hasVoted);
      if (hasVoted) {
        toast.error("You have already voted in this election!");
        return;
      }

      setLoading(true);
      // In a real app, this would be a contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setElections(prev => prev.map(e => {
        if (e.id === electionId) {
          // Update candidate votes
          const updatedCandidates = e.candidates.map(c => 
            c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
          );
          
          // Mark voter as having voted
          const updatedVoters = [...e.voters];
          const voterIndex = updatedVoters.findIndex(v => v.address === account);
          
          if (voterIndex >= 0) {
            updatedVoters[voterIndex] = { ...updatedVoters[voterIndex], hasVoted: true };
          } else {
            updatedVoters.push({ address: account!, hasVoted: true });
          }
          
          return { ...e, candidates: updatedCandidates, voters: updatedVoters };
        }
        return e;
      }));
      
      toast.success("Vote cast successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to cast vote");
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (electionId: number, candidateData: Omit<Candidate, 'id' | 'votes'>) => {
    try {
      if (!account) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const election = elections.find(e => e.id === electionId);
      if (!election) {
        toast.error("Election not found!");
        return;
      }

      if (election.status !== ElectionStatus.PENDING) {
        toast.error("Cannot add candidates to an active or ended election!");
        return;
      }

      setLoading(true);
      // In a real app, this would be a contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCandidate: Candidate = {
        id: Math.max(0, ...election.candidates.map(c => c.id)) + 1,
        name: candidateData.name,
        party: candidateData.party,
        votes: 0
      };
      
      setElections(prev => prev.map(e => 
        e.id === electionId 
          ? { ...e, candidates: [...e.candidates, newCandidate] } 
          : e
      ));
      
      toast.success("Candidate added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  const addVoter = async (electionId: number, voterAddress: string) => {
    try {
      if (!account) {
        toast.error("Please connect your wallet first!");
        return;
      }

      const election = elections.find(e => e.id === electionId);
      if (!election) {
        toast.error("Election not found!");
        return;
      }

      if (election.voters.some(v => v.address === voterAddress)) {
        toast.error("This voter is already registered!");
        return;
      }

      setLoading(true);
      // In a real app, this would be a contract call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVoter: Voter = {
        address: voterAddress,
        hasVoted: false
      };
      
      setElections(prev => prev.map(e => 
        e.id === electionId 
          ? { ...e, voters: [...e.voters, newVoter] } 
          : e
      ));
      
      toast.success("Voter added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add voter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Web3Context.Provider value={{
      account,
      connectWallet,
      isAdmin,
      setIsAdmin,
      elections,
      createElection,
      startElection,
      endElection,
      castVote,
      addCandidate,
      addVoter,
      loading
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
