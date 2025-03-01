
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Candidate } from '@/utils/types';
import { Check, User } from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';

interface CandidateCardProps {
  candidate: Candidate;
  electionId: number;
  hasVoted: boolean;
  showResults?: boolean;
  totalVotes?: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  electionId, 
  hasVoted,
  showResults = false,
  totalVotes = 0
}) => {
  const { castVote, loading } = useWeb3();

  const handleVote = () => {
    castVote(electionId, candidate.id);
  };

  const votePercentage = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;

  return (
    <Card className="h-full overflow-hidden glass-card border border-gray-200 shadow-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
        </div>
        <CardTitle className="text-center font-medium">{candidate.name}</CardTitle>
        {candidate.party && (
          <CardDescription className="text-center">{candidate.party}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-0 text-center">
        {showResults && (
          <div className="mt-2 space-y-1">
            <div className="text-lg font-semibold">{candidate.votes} votes</div>
            <div className="text-sm text-gray-500">{votePercentage}% of total</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-votex-primary rounded-full h-2 transition-all duration-500 ease-out" 
                style={{ width: `${votePercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-center">
        {!showResults && (
          <Button 
            onClick={handleVote} 
            disabled={hasVoted || loading}
            className={`w-full ${hasVoted 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-votex-primary hover:bg-votex-primary/90 text-white'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : hasVoted ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Voted
              </>
            ) : (
              'Vote'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
