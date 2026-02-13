import { useState, useEffect } from 'react';
import './App.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, Wallet, Gift, Shield, BarChart3, Heart, TrendingUp, 
  CheckCircle, Star, ArrowRight, Menu, X, ChevronRight, 
  Plus, Link2, UserPlus, DollarSign, Calendar, 
  Lock, Eye, EyeOff, Award, Copy, Check, QrCode,
  MessageCircle, Phone, Mail, Settings, LogOut,
  CreditCard, PiggyBank, Target, Sparkles, Verified,
  Fingerprint, ScanFace, BadgeCheck, Crown, Trophy,
  Landmark, UserCheck, MapPin, Clock,
  Globe, Bell, ChevronLeft, Gavel, Timer, Vote, Flame,
  HandCoins, AlertTriangle, ThumbsUp, ThumbsDown, Flag,
  Sprout, Download, FileText
} from 'lucide-react';

// Types
type TrustTier = 'newcomer' | 'contributor' | 'reliable' | 'trusted' | 'pillar';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  trustTier: TrustTier;
  trustProgress: number;
  totalSaved: number;
  circlesJoined: number;
  circlesCompleted: number;
  verificationLevel: 'basic' | 'verified' | 'premium';
  demographics?: Demographics;
};

type Demographics = {
  age?: number;
  gender?: string;
  incomeBracket?: string;
  location?: string;
  employmentStatus?: string;
  educationLevel?: string;
};

type CircleType = 'rosca' | 'chit_fund' | 'savings_challenge' | 'emergency_fund' | 'goal_based';

type SavingsCircle = {
  id: string;
  name: string;
  type: CircleType;
  description: string;
  members: CircleMember[];
  contributionAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  totalCycles: number;
  currentCycle: number;
  totalPot: number;
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
  nextPayoutDate?: Date;
  matchingFundEligible: boolean;
  matchingFundAmount?: number;
  potValue?: number;
  minBidDiscount?: number;
  organizerCommission?: number;
  currentBid?: { userId: string; userName: string; discount: number };
  bidHistory?: { cycle: number; winnerId: string; winnerName: string; discount: number; netPayout: number; date: Date }[];
  savingsGoalPerMember?: number;
  challengeEndDate?: Date;
  memberProgress?: { userId: string; name: string; amountSaved: number; streak: number }[];
  targetFundSize?: number;
  currentFundBalance?: number;
  maxWithdrawal?: number;
  approvalMethod?: 'majority_vote' | 'admin_approval' | 'automatic';
  withdrawalRequests?: { id: string; userId: string; userName: string; amount: number; reason: string; status: 'pending' | 'approved' | 'denied'; votesFor: number; votesAgainst: number; date: Date }[];
  goalDescription?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: Date;
};

type CircleMember = {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  position: number;
  hasReceivedPayout: boolean;
  payoutAmount?: number;
  joinedAt: Date;
};

type ActivityRecord = {
  id: string;
  circleName: string;
  circleType: CircleType;
  contributionAmount: number;
  totalContributions: number;
  completedAt: Date;
  onTimePercentage: number;
  trustPoints: number;
};

type YieldOpportunity = {
  id: string;
  name: string;
  description: string;
  apy: number;
  minDeposit: number;
  riskLevel: 'low' | 'medium' | 'high';
  lockupPeriod: string;
  provider: string;
};

type MatchingFundProgram = {
  id: string;
  name: string;
  organization: string;
  description: string;
  matchRatio: string;
  maxMatch: number;
  eligibilityCriteria: string[];
  deadline: Date;
  logo?: string;
};

type Wallet = {
  id: string;
  userId: string;
  fiatBalance: number;
  cryptoBalance: number;
  cryptoSymbol: string;
  cryptoName: string;
  cryptoValueUsd: number;
  address: string;
  transactions: Transaction[];
};

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'contribution' | 'payout' | 'yield';
  amount: number;
  currency: 'USD' | 'CRYPTO';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
};

type PublicUser = {
  id: string;
  name: string;
  avatar?: string;
  trustTier: TrustTier;
  circlesJoined: number;
  circlesCompleted: number;
  verificationLevel: 'basic' | 'verified' | 'premium';
  memberSince: Date;
  totalSaved: number;
  bio?: string;
  location?: string;
  isPublic: boolean;
};

// Mock Data
const MOCK_USER: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  trustTier: 'trusted',
  trustProgress: 72,
  totalSaved: 12500,
  circlesJoined: 5,
  circlesCompleted: 2,
  verificationLevel: 'verified',
};

const MOCK_CIRCLES: SavingsCircle[] = [
  {
    id: '1',
    name: 'Family Savings Circle',
    type: 'rosca',
    description: 'Monthly savings with family members',
    members: [
      { id: '1', userId: '1', name: 'Alex Johnson', position: 1, hasReceivedPayout: true, payoutAmount: 2000, joinedAt: new Date('2024-01-01') },
      { id: '2', userId: '2', name: 'Sarah Smith', position: 2, hasReceivedPayout: false, joinedAt: new Date('2024-01-01') },
      { id: '3', userId: '3', name: 'Mike Brown', position: 3, hasReceivedPayout: false, joinedAt: new Date('2024-01-01') },
      { id: '4', userId: '4', name: 'Emma Wilson', position: 4, hasReceivedPayout: false, joinedAt: new Date('2024-01-01') },
    ],
    contributionAmount: 500,
    frequency: 'monthly',
    totalCycles: 4,
    currentCycle: 2,
    totalPot: 2000,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    nextPayoutDate: new Date('2024-03-01'),
    matchingFundEligible: true,
    matchingFundAmount: 500,
  },
  {
    id: '2',
    name: 'Community Chit Fund',
    type: 'chit_fund',
    description: 'Monthly auction-based savings pool',
    members: [
      { id: '5', userId: '1', name: 'Alex Johnson', position: 1, hasReceivedPayout: false, joinedAt: new Date('2024-01-15') },
      { id: '6', userId: '2', name: 'Sarah Smith', position: 2, hasReceivedPayout: true, payoutAmount: 4250, joinedAt: new Date('2024-01-15') },
      { id: '7', userId: '7', name: 'Raj Patel', position: 3, hasReceivedPayout: false, joinedAt: new Date('2024-01-15') },
      { id: '8', userId: '8', name: 'Priya Sharma', position: 4, hasReceivedPayout: false, joinedAt: new Date('2024-01-15') },
      { id: '9', userId: '9', name: 'Arun Kumar', position: 5, hasReceivedPayout: false, joinedAt: new Date('2024-01-15') },
    ],
    contributionAmount: 1000,
    frequency: 'monthly',
    totalCycles: 5,
    currentCycle: 3,
    totalPot: 5000,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    nextPayoutDate: new Date('2024-04-15'),
    matchingFundEligible: false,
    potValue: 5000,
    minBidDiscount: 5,
    organizerCommission: 3,
    currentBid: { userId: '7', userName: 'Raj Patel', discount: 12 },
    bidHistory: [
      { cycle: 1, winnerId: '9', winnerName: 'Arun Kumar', discount: 18, netPayout: 4100, date: new Date('2024-02-15') },
      { cycle: 2, winnerId: '6', winnerName: 'Sarah Smith', discount: 15, netPayout: 4250, date: new Date('2024-03-15') },
    ],
  },
  {
    id: '3',
    name: 'Summer Savings Sprint',
    type: 'savings_challenge',
    description: 'Race to save $2,000 by summer',
    members: [
      { id: '10', userId: '1', name: 'Alex Johnson', position: 1, hasReceivedPayout: false, joinedAt: new Date('2024-03-01') },
      { id: '11', userId: '2', name: 'Sarah Smith', position: 2, hasReceivedPayout: false, joinedAt: new Date('2024-03-01') },
      { id: '12', userId: '3', name: 'Mike Brown', position: 3, hasReceivedPayout: false, joinedAt: new Date('2024-03-01') },
      { id: '13', userId: '10', name: 'Olivia Davis', position: 4, hasReceivedPayout: false, joinedAt: new Date('2024-03-01') },
    ],
    contributionAmount: 100,
    frequency: 'weekly',
    totalCycles: 20,
    currentCycle: 8,
    totalPot: 3200,
    status: 'active',
    createdAt: new Date('2024-03-01'),
    matchingFundEligible: true,
    matchingFundAmount: 200,
    savingsGoalPerMember: 2000,
    challengeEndDate: new Date('2024-07-20'),
    memberProgress: [
      { userId: '2', name: 'Sarah Smith', amountSaved: 950, streak: 8 },
      { userId: '1', name: 'Alex Johnson', amountSaved: 800, streak: 6 },
      { userId: '10', name: 'Olivia Davis', amountSaved: 750, streak: 5 },
      { userId: '3', name: 'Mike Brown', amountSaved: 700, streak: 4 },
    ],
  },
  {
    id: '4',
    name: 'Emergency Fund Builders',
    type: 'emergency_fund',
    description: 'Building emergency savings together',
    members: [
      { id: '14', userId: '1', name: 'Alex Johnson', position: 1, hasReceivedPayout: false, joinedAt: new Date('2024-02-01') },
      { id: '15', userId: '5', name: 'Lisa Chen', position: 2, hasReceivedPayout: false, joinedAt: new Date('2024-02-01') },
      { id: '16', userId: '6', name: 'David Park', position: 3, hasReceivedPayout: false, joinedAt: new Date('2024-02-01') },
    ],
    contributionAmount: 300,
    frequency: 'biweekly',
    totalCycles: 12,
    currentCycle: 4,
    totalPot: 3600,
    status: 'active',
    createdAt: new Date('2024-02-01'),
    matchingFundEligible: true,
    matchingFundAmount: 300,
    targetFundSize: 10000,
    currentFundBalance: 3600,
    maxWithdrawal: 2000,
    approvalMethod: 'majority_vote',
    withdrawalRequests: [
      { id: 'wr1', userId: '5', userName: 'Lisa Chen', amount: 1500, reason: 'Unexpected car repair', status: 'approved', votesFor: 2, votesAgainst: 0, date: new Date('2024-03-10') },
      { id: 'wr2', userId: '6', userName: 'David Park', amount: 800, reason: 'Medical co-pay', status: 'pending', votesFor: 1, votesAgainst: 0, date: new Date('2024-04-01') },
    ],
  },
  {
    id: '5',
    name: 'Group Vacation Fund',
    type: 'goal_based',
    description: 'Saving for a group trip to Costa Rica',
    members: [
      { id: '17', userId: '1', name: 'Alex Johnson', position: 1, hasReceivedPayout: false, joinedAt: new Date('2024-02-15') },
      { id: '18', userId: '2', name: 'Sarah Smith', position: 2, hasReceivedPayout: false, joinedAt: new Date('2024-02-15') },
      { id: '19', userId: '11', name: 'Jordan Lee', position: 3, hasReceivedPayout: false, joinedAt: new Date('2024-02-15') },
    ],
    contributionAmount: 200,
    frequency: 'monthly',
    totalCycles: 10,
    currentCycle: 3,
    totalPot: 1800,
    status: 'active',
    createdAt: new Date('2024-02-15'),
    matchingFundEligible: false,
    goalDescription: 'All-inclusive group trip to Costa Rica for 7 days',
    targetAmount: 6000,
    currentAmount: 1800,
    targetDate: new Date('2024-12-01'),
  },
];

const MOCK_ACTIVITY_HISTORY: ActivityRecord[] = [
  { id: '1', circleName: 'Holiday Savings 2023', circleType: 'rosca', contributionAmount: 250, totalContributions: 1500, completedAt: new Date('2023-12-15'), onTimePercentage: 100, trustPoints: 25 },
  { id: '2', circleName: 'Summer Vacation Fund', circleType: 'goal_based', contributionAmount: 400, totalContributions: 2400, completedAt: new Date('2023-08-20'), onTimePercentage: 95, trustPoints: 20 },
  { id: '3', circleName: 'Community Emergency Pool', circleType: 'emergency_fund', contributionAmount: 300, totalContributions: 1800, completedAt: new Date('2023-05-10'), onTimePercentage: 92, trustPoints: 18 },
];

const MOCK_YIELD_OPPORTUNITIES: YieldOpportunity[] = [
  { id: '1', name: 'CircleWealth Savings', description: 'Earn yield on your idle savings', apy: 4.5, minDeposit: 100, riskLevel: 'low', lockupPeriod: 'None', provider: 'CircleWealth' },
  { id: '2', name: 'Community Pool', description: 'Higher yields through pooled lending', apy: 7.2, minDeposit: 500, riskLevel: 'medium', lockupPeriod: '30 days', provider: 'CommunityFi' },
  { id: '3', name: 'Growth Fund', description: 'Long-term growth opportunity', apy: 12.5, minDeposit: 1000, riskLevel: 'high', lockupPeriod: '90 days', provider: 'GrowthDAO' },
];

const MOCK_MATCHING_PROGRAMS: MatchingFundProgram[] = [
  {
    id: '1',
    name: 'First-Time Saver Match',
    organization: 'Community Foundation',
    description: 'Double your first $500 in savings',
    matchRatio: '1:1',
    maxMatch: 500,
    eligibilityCriteria: ['First-time CircleWealth user', 'Income below $50,000', 'Complete 3 cycles'],
    deadline: new Date('2024-06-30'),
  },
  {
    id: '2',
    name: 'Family Emergency Fund',
    organization: 'Family Support Network',
    description: 'Match for emergency savings circles',
    matchRatio: '2:1',
    maxMatch: 1000,
    eligibilityCriteria: ['Household with children', 'Emergency fund purpose', 'Verified identity'],
    deadline: new Date('2024-12-31'),
  },
  {
    id: '3',
    name: 'Youth Savings Initiative',
    organization: 'Future Builders Fund',
    description: 'Support for savers under 30',
    matchRatio: '1:1',
    maxMatch: 750,
    eligibilityCriteria: ['Age 18-30', 'Student or recent graduate', 'Complete verification'],
    deadline: new Date('2024-09-30'),
  },
];

const MOCK_WALLET: Wallet = {
  id: 'w1',
  userId: '1',
  fiatBalance: 2500.00,
  cryptoBalance: 1423.50,
  cryptoSymbol: 'USDC',
  cryptoName: 'USD Coin',
  cryptoValueUsd: 1.00,
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  transactions: [
    { id: 'tx1', type: 'deposit', amount: 1000, currency: 'USD', status: 'completed', timestamp: new Date('2024-01-15'), description: 'Bank transfer from Chase ****1234', txHash: '0xabc...def' },
    { id: 'tx2', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', timestamp: new Date('2024-02-01'), description: 'Debit card deposit', txHash: '0x123...456' },
    { id: 'tx3', type: 'contribution', amount: 500, currency: 'CRYPTO', status: 'completed', timestamp: new Date('2024-02-01'), description: 'Family Savings Circle contribution', txHash: '0x789...abc' },
    { id: 'tx4', type: 'payout', amount: 2000, currency: 'CRYPTO', status: 'completed', timestamp: new Date('2024-01-15'), description: 'Family Savings Circle payout', txHash: '0xdef...123' },
    { id: 'tx5', type: 'yield', amount: 12.50, currency: 'CRYPTO', status: 'completed', timestamp: new Date('2024-02-10'), description: 'Yield from CircleWealth Savings', txHash: '0x456...789' },
    { id: 'tx6', type: 'deposit', amount: 1000, currency: 'USD', status: 'pending', timestamp: new Date(), description: 'Bank transfer processing', txHash: undefined },
  ],
};

const MOCK_PUBLIC_USERS: PublicUser[] = [
  {
    id: '2',
    name: 'Sarah Smith',
    trustTier: 'pillar' as TrustTier,
    circlesJoined: 6,
    circlesCompleted: 4,
    verificationLevel: 'premium',
    memberSince: new Date('2023-06-01'),
    totalSaved: 28500,
    bio: 'Personal finance enthusiast helping others build wealth through community savings.',
    location: 'San Francisco, CA',
    isPublic: true,
  },
  {
    id: '3',
    name: 'Mike Brown',
    trustTier: 'reliable' as TrustTier,
    circlesJoined: 3,
    circlesCompleted: 2,
    verificationLevel: 'verified',
    memberSince: new Date('2023-09-15'),
    totalSaved: 8900,
    bio: 'Small business owner building emergency funds with the community.',
    location: 'Austin, TX',
    isPublic: true,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    trustTier: 'pillar' as TrustTier,
    circlesJoined: 8,
    circlesCompleted: 6,
    verificationLevel: 'premium',
    memberSince: new Date('2023-03-10'),
    totalSaved: 42000,
    bio: 'Financial coach and long-time ROSCA participant.',
    location: 'New York, NY',
    isPublic: true,
  },
  {
    id: '5',
    name: 'Lisa Chen',
    trustTier: 'contributor' as TrustTier,
    circlesJoined: 4,
    circlesCompleted: 1,
    verificationLevel: 'verified',
    memberSince: new Date('2024-01-20'),
    totalSaved: 5600,
    bio: '',
    location: 'Seattle, WA',
    isPublic: false,
  },
];

// Components
function Navigation({ currentPage, setCurrentPage, user }: { currentPage: string; setCurrentPage: (page: string) => void; user?: User }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = user ? [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Wallet', page: 'wallet' },
    { label: 'My Circles', page: 'circles' },
    { label: 'Trust Score', page: 'credit' },
    { label: 'Yield', page: 'yield' },
    { label: 'Matching Funds', page: 'matching' },
  ] : [
    { label: 'How it Works', page: 'how-it-works' },
    { label: 'Features', page: 'features' },
    { label: 'About', page: 'about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button onClick={() => setCurrentPage(user ? 'dashboard' : 'landing')} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2467ec] to-[#1abc9c] flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#12284b] font-['Poppins']">CircleWealth</span>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => setCurrentPage(link.page)}
                className={`text-sm font-medium transition-colors relative group ${currentPage === link.page ? 'text-[#2467ec]' : 'text-[#6b7280] hover:text-[#12284b]'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#2467ec] transition-all ${currentPage === link.page ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentPage('notifications')} className="relative p-2 text-[#6b7280] hover:text-[#12284b] transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#e74c3c] rounded-full" />
                </button>
                <button onClick={() => setCurrentPage('profile')} className="flex items-center gap-3 hover:bg-gray-50 rounded-full pr-4 pl-1 py-1 transition-colors">
                  <Avatar className="w-8 h-8 border-2 border-[#2467ec]">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[#2467ec] to-[#1abc9c] text-white text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-[#12284b]">{user.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setCurrentPage('login')} className="text-[#6b7280] hover:text-[#12284b]">
                  Log In
                </Button>
                <Button onClick={() => setCurrentPage('signup')} className="bg-[#2467ec] hover:bg-[#1a5fd4] text-white rounded-full px-6">
                  Start Saving
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => { setCurrentPage(link.page); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${currentPage === link.page ? 'bg-[#2467ec]/10 text-[#2467ec]' : 'text-[#6b7280] hover:bg-gray-50'}`}
              >
                {link.label}
              </button>
            ))}
            {!user && (
              <div className="pt-4 space-y-2">
                <Button variant="outline" onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }} className="w-full">
                  Log In
                </Button>
                <Button onClick={() => { setCurrentPage('signup'); setMobileMenuOpen(false); }} className="w-full bg-[#2467ec]">
                  Start Saving
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function LandingPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#2467ec]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#1abc9c]/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2467ec]/10 rounded-full">
                <Sparkles className="w-4 h-4 text-[#2467ec]" />
                <span className="text-sm font-medium text-[#2467ec]">Trusted by 10,000+ savers worldwide</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#12284b] leading-tight font-['Poppins']">
                Save Together,{' '}
                <span className="text-gradient">Grow Together</span>
              </h1>
              
              <p className="text-lg text-[#6b7280] max-w-xl leading-relaxed">
                Join or create rotating savings circles with friends, family, and community members. 
                Build financial habits together and access matched savings opportunities.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setCurrentPage('signup')} size="lg" className="bg-[#2467ec] hover:bg-[#1a5fd4] text-white rounded-full px-8 h-14 text-base group">
                  Start Your Circle
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button onClick={() => setCurrentPage('how-it-works')} variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-[#e5e7eb] hover:bg-gray-50">
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-[#2467ec] to-[#1abc9c] flex items-center justify-center text-white text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#f39c12] text-[#f39c12]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#6b7280]">4.9/5 from 2,000+ reviews</p>
                </div>
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="/hero-image.jpg" alt="People saving together" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#2467ec] rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1abc9c]/20 rounded-xl flex items-center justify-center">
                    <PiggyBank className="w-6 h-6 text-[#1abc9c]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6b7280]">Total Saved</p>
                    <p className="text-xl font-bold text-[#12284b]">$50M+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#12284b] mb-4 font-['Poppins']">How It Works</h2>
            <p className="text-[#6b7280]">Start your savings journey in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: Users, title: 'Create or Join a Circle', desc: 'Start your own savings circle with people you trust, or join an existing one with a simple invitation.', color: 'bg-[#2467ec]' },
              { icon: Wallet, title: 'Contribute Regularly', desc: 'Set up automatic contributions on a schedule that works for your group - weekly, bi-weekly, or monthly.', color: 'bg-[#1abc9c]' },
              { icon: Gift, title: 'Receive Your Payout', desc: 'Each cycle, one member receives the collective pot. Everyone gets their turn based on the rotation schedule.', color: 'bg-[#f39c12]' },
            ].map((step, i) => (
              <Card key={i} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow group">
                <div className={`absolute -top-6 left-6 w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <CardContent className="pt-12 pb-6">
                  <div className="text-5xl font-bold text-gray-100 mb-4 font-['Poppins']">0{i + 1}</div>
                  <h3 className="text-xl font-semibold text-[#12284b] mb-3">{step.title}</h3>
                  <p className="text-[#6b7280] leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-32 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            <div className="order-2 lg:order-1">
              <img src="/feature-scheduling.jpg" alt="Smart Scheduling" className="rounded-3xl shadow-xl w-full" />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <Badge className="bg-[#2467ec]/10 text-[#2467ec] hover:bg-[#2467ec]/20">Smart Features</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#12284b] font-['Poppins']">Smart Rotation Scheduling</h2>
              <p className="text-[#6b7280] leading-relaxed">
                Our intelligent algorithm ensures fair rotation based on your group's preferences. 
                Need the funds early? Bid for earlier positions transparently.
              </p>
              <ul className="space-y-3">
                {['Flexible rotation rules', 'Bidding system for priority access', 'Automatic reminders and notifications'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#1abc9c] flex-shrink-0" />
                    <span className="text-[#12284b]">{item}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setCurrentPage('signup')} className="bg-[#2467ec] hover:bg-[#1a5fd4] text-white rounded-full px-6">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Bank-Grade Security', desc: '256-bit encryption and multi-factor authentication protect your funds.', color: 'from-[#2467ec] to-[#1a5fd4]' },
              { icon: BarChart3, title: 'Transparent Tracking', desc: 'Real-time visibility into contributions, payouts, and circle progress.', color: 'from-[#1abc9c] to-[#16a085]' },
              { icon: Heart, title: 'Community Support', desc: 'Access financial coaching and resources to help you reach your goals.', color: 'from-[#f39c12] to-[#e67e22]' },
              { icon: TrendingUp, title: 'Matched Savings', desc: 'Qualify for matching funds from partner organizations.', color: 'from-[#9b59b6] to-[#8e44ad]' },
            ].map((feature, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#12284b] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#6b7280]">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#12284b] font-['Poppins']">Building Financial Communities</h2>
              <p className="text-[#6b7280] leading-relaxed text-lg">
                CircleWealth was founded on a simple belief: when people come together to support each other's 
                financial goals, everyone wins. We've taken the time-honored tradition of community savings 
                circles and brought it into the digital age.
              </p>
              <Button onClick={() => setCurrentPage('about')} variant="outline" className="rounded-full px-6">
                Our Story
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '$50M+', label: 'Total Savings Managed' },
                { value: '10,000+', label: 'Active Savers' },
                { value: '98%', label: 'Completion Rate' },
                { value: '4.9/5', label: 'User Rating' },
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-lg text-center p-6 hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <p className="text-3xl lg:text-4xl font-bold text-gradient mb-2 font-['Poppins']">{stat.value}</p>
                    <p className="text-sm text-[#6b7280]">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#12284b] mb-4 font-['Poppins']">What Our Community Says</h2>
            <p className="text-[#6b7280]">Real stories from real savers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', role: 'Teacher, Saved $12,000', avatar: '/avatar-sarah.jpg', quote: 'CircleWealth helped me save for my daughter\'s college fund in a way that kept me accountable. The community aspect made all the difference.', rating: 5 },
              { name: 'Marcus T.', role: 'Small Business Owner', avatar: '/avatar-marcus.jpg', quote: 'I\'ve been part of savings circles before, but the transparency and ease of CircleWealth is unmatched. Highly recommend!', rating: 5 },
              { name: 'Elena R.', role: 'Healthcare Worker', avatar: '/avatar-elena.jpg', quote: 'The matched savings program helped me reach my emergency fund goal twice as fast. This platform truly cares about its users.', rating: 5 },
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#f39c12] text-[#f39c12]" />
                    ))}
                  </div>
                  <p className="text-[#12284b] mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-[#2467ec] to-[#1abc9c] text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-[#12284b]">{testimonial.name}</p>
                      <p className="text-sm text-[#6b7280]">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2467ec] to-[#1abc9c]" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-['Poppins']">
            Ready to Start Your Savings Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of people who are achieving their financial goals together. 
            Create your first circle in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => setCurrentPage('signup')} size="lg" className="bg-white text-[#2467ec] hover:bg-gray-100 rounded-full px-8 h-14 text-base font-semibold">
              Get Started Free
            </Button>
            <Button onClick={() => setCurrentPage('contact')} size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 h-14 text-base">
              Talk to an Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12284b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2467ec] to-[#1abc9c] flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-['Poppins']">CircleWealth</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                Empowering communities to save together and build stronger financial futures.
              </p>
              <div className="flex gap-4">
                {[Globe, MessageCircle, Mail].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            {[
              { title: 'Product', links: ['How it Works', 'Features', 'Pricing', 'Security'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { title: 'Resources', links: ['Help Center', 'Community', 'Financial Tips', 'Calculator'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <button onClick={() => setCurrentPage(link.toLowerCase().replace(/\s+/g, '-'))} className="text-gray-400 hover:text-white transition-colors text-sm">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <Separator className="bg-white/10 mb-8" />
          
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 CircleWealth. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, i) => (
                <button key={i} onClick={() => setCurrentPage(link.toLowerCase().replace(/\s+/g, '-'))} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthPage({ type, setCurrentPage, onLogin }: { type: 'login' | 'signup'; setCurrentPage: (page: string) => void; onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'signup' && step < 3) {
      setStep(step + 1);
    } else {
      onLogin();
      setCurrentPage('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-20">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2467ec] to-[#1abc9c] flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#12284b] font-['Poppins']">
              {type === 'login' ? 'Welcome Back' : step === 1 ? 'Create Account' : step === 2 ? 'Verify Identity' : 'Secure Your Account'}
            </CardTitle>
            <CardDescription>
              {type === 'login' ? 'Sign in to continue your savings journey' : step === 1 ? 'Start building your financial future' : step === 2 ? 'Help us prevent fraud and protect the community' : 'Set up security for your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {type === 'signup' && step === 2 ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#f9fafb] rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Fingerprint className="w-5 h-5 text-[#2467ec]" />
                      <span className="font-medium text-[#12284b]">Human Verification</span>
                    </div>
                    <p className="text-sm text-[#6b7280] mb-4">
                      We use privacy-preserving verification to prevent fake accounts and ensure fair access to matching funds.
                    </p>
                    <Button type="button" variant="outline" className="w-full">
                      <ScanFace className="w-4 h-4 mr-2" />
                      Verify with Biometrics
                    </Button>
                  </div>
                  <div className="p-4 bg-[#f9fafb] rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-5 h-5 text-[#1abc9c]" />
                      <span className="font-medium text-[#12284b]">Phone Verification</span>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="+1 (555) 000-0000" className="flex-1" />
                      <Button type="button" variant="outline">Send Code</Button>
                    </div>
                  </div>
                </div>
              ) : type === 'signup' && step === 3 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Set PIN Code</Label>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4].map((i) => (
                        <Input key={i} type="password" maxLength={1} className="w-12 h-12 text-center text-2xl" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="text-sm text-[#6b7280]">
                      I agree to the <button type="button" className="text-[#2467ec] hover:underline">Terms of Service</button> and <button type="button" className="text-[#2467ec] hover:underline">Privacy Policy</button>
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  {type === 'signup' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {type === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <label htmlFor="remember" className="text-sm text-[#6b7280]">Remember me</label>
                      </div>
                      <button type="button" className="text-sm text-[#2467ec] hover:underline">Forgot password?</button>
                    </div>
                  )}
                </>
              )}
              <Button type="submit" className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] text-white rounded-full h-12">
                {type === 'login' ? 'Sign In' : step < 3 ? 'Continue' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-[#6b7280]">
                {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setCurrentPage(type === 'login' ? 'signup' : 'login')} className="text-[#2467ec] hover:underline font-medium">
                  {type === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper to get circle type display info
function getCircleTypeInfo(type: CircleType) {
  switch (type) {
    case 'rosca': return { icon: Users, label: 'ROSCA', bg: 'bg-[#2467ec]/10', text: 'text-[#2467ec]', gradient: 'from-[#2467ec] to-[#1a5fd4]' };
    case 'chit_fund': return { icon: Gavel, label: 'Chit Fund', bg: 'bg-[#6366f1]/10', text: 'text-[#6366f1]', gradient: 'from-[#6366f1] to-[#4f46e5]' };
    case 'savings_challenge': return { icon: Trophy, label: 'Challenge', bg: 'bg-[#f39c12]/10', text: 'text-[#f39c12]', gradient: 'from-[#f39c12] to-[#e67e22]' };
    case 'emergency_fund': return { icon: Shield, label: 'Emergency', bg: 'bg-[#1abc9c]/10', text: 'text-[#1abc9c]', gradient: 'from-[#1abc9c] to-[#16a085]' };
    case 'goal_based': return { icon: Target, label: 'Goal-Based', bg: 'bg-[#9b59b6]/10', text: 'text-[#9b59b6]', gradient: 'from-[#9b59b6] to-[#8e44ad]' };
  }
}

function getCircleTypeDetail(circle: SavingsCircle): string {
  switch (circle.type) {
    case 'rosca': {
      const yourPos = circle.members.findIndex(m => m.userId === '1') + 1;
      const turnsLeft = ((yourPos) - (circle.currentCycle % circle.members.length) + circle.members.length) % circle.members.length || circle.members.length;
      return `Your turn in ${turnsLeft} cycle${turnsLeft !== 1 ? 's' : ''}`;
    }
    case 'chit_fund':
      return `Pot: $${(circle.potValue ?? 0).toLocaleString()} · ${circle.currentBid ? `Lowest bid: ${circle.currentBid.discount}%` : 'Auction open'}`;
    case 'savings_challenge': {
      const myProgress = circle.memberProgress?.find(m => m.userId === '1');
      const rank = circle.memberProgress ? circle.memberProgress.findIndex(m => m.userId === '1') + 1 : 0;
      return `${rank > 0 ? `#${rank} place` : 'Not ranked'} · $${myProgress?.amountSaved ?? 0} of $${circle.savingsGoalPerMember?.toLocaleString() ?? '0'}`;
    }
    case 'emergency_fund':
      return `Fund: $${(circle.currentFundBalance ?? 0).toLocaleString()} of $${(circle.targetFundSize ?? 0).toLocaleString()}`;
    case 'goal_based':
      return `$${(circle.currentAmount ?? 0).toLocaleString()} of $${(circle.targetAmount ?? 0).toLocaleString()} goal`;
  }
}

function Dashboard({ user, setCurrentPage, navigateToCircle }: { user: User; setCurrentPage: (page: string) => void; navigateToCircle: (id: string) => void }) {
  const stats = [
    { label: 'Total Saved', value: `$${user.totalSaved.toLocaleString()}`, icon: PiggyBank, change: '+12%', color: 'from-[#2467ec] to-[#1a5fd4]' },
    { label: 'Active Circles', value: user.circlesJoined.toString(), icon: Users, change: '+2', color: 'from-[#1abc9c] to-[#16a085]' },
    { label: 'Trust Level', value: user.trustTier.charAt(0).toUpperCase() + user.trustTier.slice(1), icon: Award, change: `${user.trustProgress}% to next`, color: 'from-[#f39c12] to-[#e67e22]' },
    { label: 'Next Payout', value: '$2,000', icon: Calendar, change: 'In 5 days', color: 'from-[#9b59b6] to-[#8e44ad]' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-[#6b7280]">Here's your financial overview</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#6b7280] mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#12284b] font-['Poppins']">{stat.value}</p>
                    <p className="text-xs text-[#1abc9c] mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-['Poppins']">Your Savings Circles</CardTitle>
                  <CardDescription>Active circles you're participating in</CardDescription>
                </div>
                <Button onClick={() => setCurrentPage('create-circle')} className="bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Circle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_CIRCLES.map((circle) => {
                    const typeInfo = getCircleTypeInfo(circle.type);
                    const TypeIcon = typeInfo.icon;
                    return (
                      <div key={circle.id} className="p-4 bg-[#f9fafb] rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigateToCircle(circle.id)}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${typeInfo.bg} flex items-center justify-center flex-shrink-0`}>
                              <TypeIcon className={`w-5 h-5 ${typeInfo.text}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#12284b]">{circle.name}</h4>
                              <p className="text-sm text-[#6b7280]">{circle.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={`${typeInfo.bg} ${typeInfo.text} text-xs`}>{typeInfo.label}</Badge>
                            {circle.matchingFundEligible && (
                              <Badge className="bg-[#1abc9c]/10 text-[#1abc9c] text-xs">Matched</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#6b7280]" />
                            <span className="text-[#12284b]">{circle.members.length} members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#6b7280]" />
                            <span className="text-[#12284b]">${circle.contributionAmount}/{circle.frequency}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#6b7280]" />
                            <span className="text-[#12284b]">Cycle {circle.currentCycle}/{circle.totalCycles}</span>
                          </div>
                        </div>
                        <p className={`text-sm font-medium mt-2 ${typeInfo.text}`}>{getCircleTypeDetail(circle)}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#6b7280]">Progress</span>
                            <span className="text-[#12284b] font-medium">{Math.round((circle.currentCycle / circle.totalCycles) * 100)}%</span>
                          </div>
                          <Progress value={(circle.currentCycle / circle.totalCycles) * 100} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-['Poppins']">Yield Opportunities</CardTitle>
                <CardDescription>Grow your idle savings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_YIELD_OPPORTUNITIES.slice(0, 2).map((opportunity) => (
                    <div key={opportunity.id} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl">
                      <div>
                        <h4 className="font-semibold text-[#12284b]">{opportunity.name}</h4>
                        <p className="text-sm text-[#6b7280]">{opportunity.provider} • {opportunity.lockupPeriod} lockup</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#1abc9c]">{opportunity.apy}% APY</p>
                        <p className="text-xs text-[#6b7280]">Min: ${opportunity.minDeposit}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setCurrentPage('yield')} variant="outline" className="w-full mt-4 rounded-full">
                  View All Opportunities
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-['Poppins']">Matching Funds</CardTitle>
                <CardDescription>Programs you may qualify for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_MATCHING_PROGRAMS.slice(0, 2).map((program) => (
                    <div key={program.id} className="p-4 bg-gradient-to-br from-[#2467ec]/5 to-[#1abc9c]/5 rounded-xl border border-[#2467ec]/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Gift className="w-4 h-4 text-[#2467ec]" />
                        <span className="font-medium text-[#12284b]">{program.name}</span>
                      </div>
                      <p className="text-sm text-[#6b7280] mb-2">{program.organization}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[#1abc9c] border-[#1abc9c]">{program.matchRatio} match</Badge>
                        <span className="text-sm text-[#12284b] font-medium">Up to ${program.maxMatch}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setCurrentPage('matching')} variant="outline" className="w-full mt-4 rounded-full">
                  Browse All Programs
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-['Poppins']">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Plus, label: 'Add Money', action: () => setCurrentPage('add-money') },
                    { icon: UserPlus, label: 'Invite Friend', action: () => setCurrentPage('invite') },
                    { icon: Award, label: 'Trust Score', action: () => setCurrentPage('credit') },
                    { icon: Settings, label: 'Settings', action: () => setCurrentPage('settings') },
                  ].map((action, i) => (
                    <button key={i} onClick={action.action} className="p-4 bg-[#f9fafb] rounded-xl hover:bg-gray-100 transition-colors text-center">
                      <action.icon className="w-6 h-6 mx-auto mb-2 text-[#2467ec]" />
                      <span className="text-sm text-[#12284b]">{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#2467ec] to-[#1abc9c]">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Upgrade to Premium</span>
                </div>
                <p className="text-white/80 text-sm mb-4">Get higher matching funds priority and exclusive yield opportunities.</p>
                <Button variant="secondary" className="w-full rounded-full bg-white text-[#2467ec] hover:bg-gray-100">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CirclesPage({ setCurrentPage, navigateToCircle }: { setCurrentPage: (page: string) => void; navigateToCircle: (id: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');

  const filteredCircles = MOCK_CIRCLES.filter(c => filter === 'all' || c.status === filter);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">My Savings Circles</h1>
            <p className="text-[#6b7280]">Manage and track your circles</p>
          </div>
          <Button onClick={() => setCurrentPage('create-circle')} className="bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Circle
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-[#2467ec] text-white' : 'bg-white text-[#6b7280] hover:bg-gray-100'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles.map((circle) => {
            const typeInfo = getCircleTypeInfo(circle.type);
            const TypeIcon = typeInfo.icon;
            return (
              <Card key={circle.id} className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => navigateToCircle(circle.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeInfo.bg}`}>
                      <TypeIcon className={`w-6 h-6 ${typeInfo.text}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${typeInfo.bg} ${typeInfo.text} text-xs`}>{typeInfo.label}</Badge>
                      <Badge className={circle.status === 'active' ? 'bg-[#1abc9c]/10 text-[#1abc9c]' : circle.status === 'pending' ? 'bg-[#f39c12]/10 text-[#f39c12]' : 'bg-gray-100 text-gray-600'}>
                        {circle.status}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#12284b] mb-1">{circle.name}</h3>
                  <p className="text-sm text-[#6b7280] mb-2">{circle.description}</p>
                  <p className={`text-sm font-medium mb-3 ${typeInfo.text}`}>{getCircleTypeDetail(circle)}</p>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#6b7280]" />
                      <span className="text-[#12284b]">{circle.members.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-[#6b7280]" />
                      <span className="text-[#12284b]">${circle.contributionAmount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#6b7280]" />
                      <span className="text-[#12284b]">{circle.currentCycle}/{circle.totalCycles}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {circle.members.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-gradient-to-br from-[#2467ec] to-[#1abc9c] text-white text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {circle.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-[#6b7280]">
                          +{circle.members.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#1abc9c]">${circle.totalPot.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CreateCirclePage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [step, setStep] = useState(1);
  const [circleType, setCircleType] = useState<CircleType>('rosca');

  const circleTypes = [
    { id: 'rosca' as CircleType, name: 'ROSCA (Rotating)', description: 'Classic rotating savings - each member gets the pot in turn', icon: Users, color: 'from-[#2467ec] to-[#1a5fd4]' },
    { id: 'chit_fund' as CircleType, name: 'Chit Fund', description: 'Auction-based pool - members bid for the pot each cycle, lowest discount wins', icon: Gavel, color: 'from-[#6366f1] to-[#4f46e5]' },
    { id: 'savings_challenge' as CircleType, name: 'Savings Challenge', description: 'Compete with friends to reach savings goals first', icon: Trophy, color: 'from-[#f39c12] to-[#e67e22]' },
    { id: 'emergency_fund' as CircleType, name: 'Emergency Fund', description: 'Build a shared emergency pool with mutual aid withdrawals', icon: Shield, color: 'from-[#1abc9c] to-[#16a085]' },
    { id: 'goal_based' as CircleType, name: 'Goal-Based', description: 'Save together toward a shared goal or purchase', icon: Target, color: 'from-[#9b59b6] to-[#8e44ad]' },
  ];

  const stepLabels: Record<CircleType, string[]> = {
    rosca: ['Choose Type', 'ROSCA Details', 'Invite Members'],
    chit_fund: ['Choose Type', 'Chit Fund Details', 'Invite Members'],
    savings_challenge: ['Choose Type', 'Challenge Details', 'Invite Members'],
    emergency_fund: ['Choose Type', 'Fund Details', 'Invite Members'],
    goal_based: ['Choose Type', 'Goal Details', 'Invite Members'],
  };

  const inviteNotes: Record<CircleType, string> = {
    rosca: 'Rotation order will be determined after all members join.',
    chit_fund: 'Members will bid each cycle for the pot. The lowest bidder wins.',
    savings_challenge: 'Members will compete to reach the savings goal first.',
    emergency_fund: 'Members can request withdrawals in emergencies, subject to group approval.',
    goal_based: 'Everyone contributes toward the shared goal together.',
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentPage('circles')} className="flex items-center gap-2 text-[#6b7280] hover:text-[#12284b] mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Circles
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">Create Savings Circle</h1>
          <p className="text-[#6b7280]">Set up your circle in a few simple steps</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s ? 'bg-[#2467ec] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-[#2467ec]' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <span className="ml-3 text-sm text-[#6b7280]">{stepLabels[circleType][step - 1]}</span>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">Choose Circle Type</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {circleTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCircleType(type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${circleType === type.id ? 'border-[#2467ec] bg-[#2467ec]/5' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                        <type.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-[#12284b] mb-1">{type.name}</h4>
                      <p className="text-sm text-[#6b7280]">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && circleType === 'rosca' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">ROSCA Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Circle Name</Label><Input placeholder="e.g., Family Savings Circle" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe your savings circle" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Contribution Amount</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="500" /></div></div>
                    <div className="space-y-2"><Label>Frequency</Label><Select><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Number of Members</Label><Input type="number" placeholder="e.g., 5" /><p className="text-xs text-[#6b7280]">Each member gets one turn (determines total cycles)</p></div>
                    <div className="space-y-2"><Label>Rotation Order</Label><Select><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent><SelectItem value="random">Random</SelectItem><SelectItem value="join_order">Join Order</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select></div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && circleType === 'chit_fund' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">Chit Fund Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Fund Name</Label><Input placeholder="e.g., Community Chit Fund" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe your chit fund" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Pot Value (per cycle)</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="5000" /></div><p className="text-xs text-[#6b7280]">Total amount collected each cycle</p></div>
                    <div className="space-y-2"><Label>Number of Members</Label><Input type="number" placeholder="e.g., 10" /><p className="text-xs text-[#6b7280]">Contribution = Pot / Members</p></div>
                  </div>
                  <div className="space-y-2"><Label>Frequency</Label><Select><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly (traditional)</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent></Select></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Minimum Bid Discount (%)</Label><Input type="number" placeholder="5" /><p className="text-xs text-[#6b7280]">Floor to prevent extreme underbidding</p></div>
                    <div className="space-y-2"><Label>Organizer Commission (%)</Label><Input type="number" placeholder="3" /><p className="text-xs text-[#6b7280]">Optional fee for the fund organizer</p></div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && circleType === 'savings_challenge' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">Challenge Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Challenge Name</Label><Input placeholder="e.g., Summer Savings Sprint" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="What's the challenge about?" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Savings Goal per Member</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="2000" /></div></div>
                    <div className="space-y-2"><Label>Challenge Duration (weeks)</Label><Input type="number" placeholder="12" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Contribution Frequency</Label><Select><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Contribution Amount</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="100" /></div></div>
                  </div>
                  <div className="space-y-2"><Label>Prize / Reward (optional)</Label><Input placeholder="e.g., Winner gets bragging rights + $50 bonus" /><p className="text-xs text-[#6b7280]">Describe what the first-to-goal winner receives</p></div>
                </div>
              </div>
            )}

            {step === 2 && circleType === 'emergency_fund' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">Emergency Fund Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Fund Name</Label><Input placeholder="e.g., Emergency Fund Builders" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the purpose of this fund" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Monthly Contribution</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="300" /></div></div>
                    <div className="space-y-2"><Label>Target Fund Size</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="10000" /></div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Max Withdrawal per Request</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="2000" /></div></div>
                    <div className="space-y-2"><Label>Approval Method</Label><Select><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent><SelectItem value="majority_vote">Majority Vote</SelectItem><SelectItem value="admin_approval">Admin Approval</SelectItem><SelectItem value="automatic">Automatic</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="space-y-2"><Label>Contribution Frequency</Label><Select><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select></div>
                </div>
              </div>
            )}

            {step === 2 && circleType === 'goal_based' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">Goal Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Circle Name</Label><Input placeholder="e.g., Group Vacation Fund" /></div>
                  <div className="space-y-2"><Label>What are you saving for?</Label><Textarea placeholder="e.g., All-inclusive group trip to Costa Rica" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Target Amount</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="6000" /></div></div>
                    <div className="space-y-2"><Label>Target Date</Label><Input type="date" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Contribution Amount</Label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" /><Input type="number" className="pl-10" placeholder="200" /></div></div>
                    <div className="space-y-2"><Label>Frequency</Label><Select><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select></div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#12284b]">Invite Members</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#f9fafb] rounded-xl border-2 border-dashed border-gray-300 text-center">
                    <UserPlus className="w-12 h-12 mx-auto mb-3 text-[#6b7280]" />
                    <p className="text-[#12284b] font-medium mb-1">Add members to your circle</p>
                    <p className="text-sm text-[#6b7280] mb-4">Invite via email, phone, or share a link</p>
                    <div className="flex gap-2 max-w-md mx-auto">
                      <Input placeholder="Enter email address" />
                      <Button className="bg-[#2467ec]">Invite</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" className="flex items-center gap-2"><Link2 className="w-4 h-4" />Copy Link</Button>
                    <Button variant="outline" className="flex items-center gap-2"><MessageCircle className="w-4 h-4" />Share</Button>
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${getCircleTypeInfo(circleType).bg} ${getCircleTypeInfo(circleType).text}`}>
                    <p className="font-medium">{inviteNotes[circleType]}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : setCurrentPage('circles')}>
                {step > 1 ? 'Back' : 'Cancel'}
              </Button>
              <Button onClick={() => step < 3 ? setStep(step + 1) : setCurrentPage('circles')} className="bg-[#2467ec]">
                {step < 3 ? 'Continue' : 'Create Circle'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddMoneyPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentPage('dashboard')} className="flex items-center gap-2 text-[#6b7280] hover:text-[#12284b] mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-['Poppins']">Add Money</CardTitle>
            <CardDescription>Fund your savings circle or wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6b7280]" />
                <Input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 h-16 text-3xl font-bold"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-2">
                {['50', '100', '250', '500'].map((amt) => (
                  <button key={amt} onClick={() => setAmount(amt)} className="px-4 py-2 bg-[#f9fafb] rounded-lg text-sm text-[#12284b] hover:bg-gray-200 transition-colors">
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="space-y-2">
                {[
                  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, last4: '•••• 4242' },
                  { id: 'bank', name: 'Bank Account', icon: Landmark, last4: '•••• 1234' },
                  { id: 'apple', name: 'Apple Pay', icon: Wallet, last4: '' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${method === m.id ? 'border-[#2467ec] bg-[#2467ec]/5' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <m.icon className="w-5 h-5 text-[#6b7280]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-[#12284b]">{m.name}</p>
                      {m.last4 && <p className="text-sm text-[#6b7280]">{m.last4}</p>}
                    </div>
                    {method === m.id && <CheckCircle className="w-5 h-5 text-[#2467ec]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Add to</Label>
              <Select defaultValue="wallet">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet">General Wallet</SelectItem>
                  <SelectItem value="circle1">Family Savings Circle</SelectItem>
                  <SelectItem value="circle2">Emergency Fund Builders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] h-14 text-lg rounded-full">
              Add ${amount || '0.00'}
            </Button>

            <p className="text-center text-sm text-[#6b7280]">
              <Lock className="w-3 h-3 inline mr-1" />
              Secure 256-bit encryption
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Trust tier display info helper
function getTrustTierInfo(tier: TrustTier) {
  switch (tier) {
    case 'newcomer': return { icon: Sprout, label: 'Newcomer', color: 'text-[#6b7280]', bg: 'bg-[#6b7280]/10', gradient: 'from-[#6b7280] to-[#4b5563]', description: 'Just getting started', rank: 1 };
    case 'contributor': return { icon: HandCoins, label: 'Contributor', color: 'text-[#2467ec]', bg: 'bg-[#2467ec]/10', gradient: 'from-[#2467ec] to-[#1a5fd4]', description: 'Active participant', rank: 2 };
    case 'reliable': return { icon: Shield, label: 'Reliable', color: 'text-[#1abc9c]', bg: 'bg-[#1abc9c]/10', gradient: 'from-[#1abc9c] to-[#16a085]', description: 'Proven track record', rank: 3 };
    case 'trusted': return { icon: Award, label: 'Trusted', color: 'text-[#f39c12]', bg: 'bg-[#f39c12]/10', gradient: 'from-[#f39c12] to-[#e67e22]', description: 'Established member', rank: 4 };
    case 'pillar': return { icon: Crown, label: 'Pillar', color: 'text-[#9b59b6]', bg: 'bg-[#9b59b6]/10', gradient: 'from-[#9b59b6] to-[#8e44ad]', description: 'Community leader', rank: 5 };
  }
}

const TRUST_TIERS: TrustTier[] = ['newcomer', 'contributor', 'reliable', 'trusted', 'pillar'];

const TIER_UNLOCKS: Record<TrustTier, string[]> = {
  newcomer: ['Join savings circles', 'Basic contributions'],
  contributor: ['Join more circles', 'View community profiles'],
  reliable: ['Matching fund eligibility', 'Priority circle invites'],
  trusted: ['Loan access', 'Higher circle limits', 'Create unlimited circles'],
  pillar: ['Maximum matching funds', 'Priority access to new features', 'Community leader badge', 'Mentorship program'],
};

const TIER_REQUIREMENTS: Record<TrustTier, string[]> = {
  newcomer: ['Create an account'],
  contributor: ['Join 1+ circle', 'Make your first contribution'],
  reliable: ['Complete 1-2 circles', '80%+ on-time payments', 'Verified identity'],
  trusted: ['Complete 3+ circles', '90%+ on-time payments', 'Verified identity'],
  pillar: ['Complete 5+ circles', '95%+ on-time payments', 'Premium verified identity'],
};

function TrustScorePage({ user }: { user: User }) {
  const currentTierInfo = getTrustTierInfo(user.trustTier);
  const CurrentTierIcon = currentTierInfo.icon;
  const currentRank = currentTierInfo.rank;
  const nextTier = currentRank < 5 ? TRUST_TIERS[currentRank] : null;
  const nextTierInfo = nextTier ? getTrustTierInfo(nextTier) : null;

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">Trust Score</h1>
          <p className="text-[#6b7280]">Build trust through consistent participation and cooperation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Trust Tier */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#6b7280] mb-1">Your Trust Level</p>
                    <p className={`text-4xl font-bold font-['Poppins'] ${currentTierInfo.color}`}>{currentTierInfo.label}</p>
                    <p className="text-sm text-[#6b7280] mt-1">{currentTierInfo.description}</p>
                  </div>
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentTierInfo.gradient} flex items-center justify-center`}>
                    <CurrentTierIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                {nextTierInfo && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-[#6b7280]">Progress to <span className={`font-medium ${nextTierInfo.color}`}>{nextTierInfo.label}</span></span>
                      <span className="font-medium text-[#12284b]">{user.trustProgress}%</span>
                    </div>
                    <Progress value={user.trustProgress} className="h-3" />
                    <p className="text-xs text-[#6b7280] mt-2">Complete {5 - user.circlesCompleted} more circles and upgrade to premium verification to advance</p>
                  </div>
                )}
                {!nextTierInfo && (
                  <div className="p-3 bg-[#9b59b6]/10 rounded-lg">
                    <p className="text-sm font-medium text-[#9b59b6]">You've reached the highest trust tier. You're a community pillar!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tier Progression Ladder */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins']">Trust Tier Progression</CardTitle>
                <CardDescription>Your journey through the trust tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TRUST_TIERS.map((tier) => {
                    const info = getTrustTierInfo(tier);
                    const TierIcon = info.icon;
                    const isCompleted = info.rank < currentRank;
                    const isCurrent = tier === user.trustTier;
                    const isLocked = info.rank > currentRank;
                    return (
                      <div key={tier} className={`p-4 rounded-xl border-2 ${isCurrent ? `border-2 ${info.bg} ring-2 ring-offset-2` : isCompleted ? 'border-[#1abc9c]/30 bg-[#1abc9c]/5' : 'border-gray-200 bg-gray-50'}`} style={isCurrent ? { borderColor: 'currentColor' } : {}}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isLocked ? 'bg-gray-200' : `bg-gradient-to-br ${info.gradient}`}`}>
                            {isLocked ? <Lock className="w-5 h-5 text-[#6b7280]" /> : <TierIcon className="w-6 h-6 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-semibold ${isLocked ? 'text-[#6b7280]' : 'text-[#12284b]'}`}>{info.label}</h4>
                              {isCompleted && <CheckCircle className="w-4 h-4 text-[#1abc9c]" />}
                              {isCurrent && <Badge className={`${info.bg} ${info.color} text-xs`}>Current</Badge>}
                            </div>
                            <p className={`text-sm ${isLocked ? 'text-[#6b7280]' : 'text-[#6b7280]'}`}>{info.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {!isLocked && (
                              <div className="flex flex-wrap gap-1 justify-end">
                                {TIER_UNLOCKS[tier].slice(0, 2).map((unlock, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{unlock}</Badge>
                                ))}
                                {TIER_UNLOCKS[tier].length > 2 && <Badge variant="outline" className="text-xs">+{TIER_UNLOCKS[tier].length - 2}</Badge>}
                              </div>
                            )}
                            {isLocked && (
                              <div className="text-xs text-[#6b7280]">
                                {TIER_REQUIREMENTS[tier].slice(0, 1).map((req, i) => (
                                  <p key={i}>{req}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins']">Trust Activity History</CardTitle>
                <CardDescription>Completed circles that built your trust</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_ACTIVITY_HISTORY.map((record) => {
                    const circleTypeInfo = getCircleTypeInfo(record.circleType);
                    const CircleIcon = circleTypeInfo.icon;
                    return (
                      <div key={record.id} className="p-4 bg-[#f9fafb] rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${circleTypeInfo.bg} flex items-center justify-center flex-shrink-0`}>
                              <CircleIcon className={`w-4 h-4 ${circleTypeInfo.text}`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#12284b]">{record.circleName}</h4>
                              <p className="text-sm text-[#6b7280]">Completed {record.completedAt.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge className="bg-[#1abc9c]/10 text-[#1abc9c]">+{record.trustPoints} pts</Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-[#6b7280]" />
                            <span className="text-[#12284b]">${record.totalContributions.toLocaleString()} contributed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#1abc9c]" />
                            <span className="text-[#12284b]">{record.onTimePercentage}% on-time</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Trust Factors */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins']">Trust Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'On-Time Contributions', score: 92, status: 'Excellent' },
                    { label: 'Circles Completed', score: 40, status: '2 of 5 for next tier' },
                    { label: 'Savings Consistency', score: 88, status: 'Very Good' },
                    { label: 'Member Reputation', score: 95, status: 'Excellent' },
                    { label: 'Identity Verification', score: 66, status: 'Verified' },
                  ].map((factor, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#12284b]">{factor.label}</span>
                        <span className="text-[#1abc9c]">{factor.status}</span>
                      </div>
                      <Progress value={factor.score} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-[#f39c12]/5 rounded-lg">
                  <p className="text-xs text-[#f39c12] font-medium">Upgrade to Premium verification to unlock the Pillar tier</p>
                </div>
              </CardContent>
            </Card>

            {/* Export Credit History */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins'] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#2467ec]" />
                  Export Credit History
                </CardTitle>
                <CardDescription>Share your savings record with credit reporting agencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Total Contributions</span>
                    <span className="font-medium text-[#12284b]">${MOCK_ACTIVITY_HISTORY.reduce((sum, r) => sum + r.totalContributions, 0).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Circles Completed</span>
                    <span className="font-medium text-[#12284b]">{user.circlesCompleted}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">On-Time Payment Rate</span>
                    <span className="font-medium text-[#1abc9c]">{Math.round(MOCK_ACTIVITY_HISTORY.reduce((sum, r) => sum + r.onTimePercentage, 0) / MOCK_ACTIVITY_HISTORY.length)}%</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Member Since</span>
                    <span className="font-medium text-[#12284b]">Jan 2023</span>
                  </div>
                </div>
                <Button className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <p className="text-xs text-[#6b7280] mt-2 text-center">PDF report suitable for submission to credit bureaus</p>
              </CardContent>
            </Card>

            {/* Unlock Benefits */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#f39c12] to-[#e67e22]">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Unlock More Benefits</span>
                </div>
                <p className="text-white/80 text-sm mb-4">Reach higher trust tiers to unlock matching funds, loan access, and priority features.</p>
                <Button variant="secondary" className="w-full rounded-full bg-white text-[#f39c12] hover:bg-gray-100">
                  View All Benefits
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function YieldPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">Yield Opportunities</h1>
          <p className="text-[#6b7280]">Grow your savings with competitive returns</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_YIELD_OPPORTUNITIES.map((opportunity) => (
            <Card key={opportunity.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opportunity.riskLevel === 'low' ? 'bg-[#1abc9c]/10' : opportunity.riskLevel === 'medium' ? 'bg-[#f39c12]/10' : 'bg-[#e74c3c]/10'}`}>
                    <TrendingUp className={`w-6 h-6 ${opportunity.riskLevel === 'low' ? 'text-[#1abc9c]' : opportunity.riskLevel === 'medium' ? 'text-[#f39c12]' : 'text-[#e74c3c]'}`} />
                  </div>
                  <Badge variant="outline" className={opportunity.riskLevel === 'low' ? 'text-[#1abc9c] border-[#1abc9c]' : opportunity.riskLevel === 'medium' ? 'text-[#f39c12] border-[#f39c12]' : 'text-[#e74c3c] border-[#e74c3c]'}>
                    {opportunity.riskLevel} risk
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-[#12284b] mb-1">{opportunity.name}</h3>
                <p className="text-sm text-[#6b7280] mb-4">{opportunity.description}</p>
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-[#1abc9c] font-['Poppins']">{opportunity.apy}%</p>
                    <p className="text-sm text-[#6b7280]">APY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#12284b]">${opportunity.minDeposit} min</p>
                    <p className="text-sm text-[#6b7280]">{opportunity.lockupPeriod} lockup</p>
                  </div>
                </div>
                <Button className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full">
                  Start Earning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="font-['Poppins']">How Yield Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: PiggyBank, title: 'Deposit Funds', desc: 'Add money to your CircleWealth wallet or directly to yield products' },
                { icon: TrendingUp, title: 'Earn Daily', desc: 'Interest accrues daily and compounds automatically' },
                { icon: Wallet, title: 'Withdraw Anytime', desc: 'Access your funds when you need them (terms vary by product)' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2467ec] to-[#1abc9c] flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#12284b] mb-2">{step.title}</h4>
                  <p className="text-sm text-[#6b7280]">{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MatchingFundsPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">Matching Funds</h1>
          <p className="text-[#6b7280]">Get rewarded for saving with partner programs</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {MOCK_MATCHING_PROGRAMS.map((program) => (
              <Card key={program.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#12284b] mb-1">{program.name}</h3>
                      <p className="text-[#6b7280]">{program.organization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1abc9c] font-['Poppins']">{program.matchRatio}</p>
                      <p className="text-sm text-[#6b7280]">up to ${program.maxMatch}</p>
                    </div>
                  </div>
                  <p className="text-[#6b7280] mb-4">{program.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#12284b] mb-2">Eligibility:</p>
                    <div className="flex flex-wrap gap-2">
                      {program.eligibilityCriteria.map((criteria, i) => (
                        <Badge key={i} variant="outline" className="text-[#6b7280]">{criteria}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#6b7280]">Deadline: {program.deadline.toLocaleDateString()}</p>
                    <Button onClick={() => setCurrentPage('apply-matching')} className="bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins']">Your Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-[#1abc9c]/10 flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-[#1abc9c]" />
                  </div>
                  <p className="text-3xl font-bold text-[#12284b] font-['Poppins']">$1,250</p>
                  <p className="text-[#6b7280]">Total matched so far</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Active applications</span>
                    <span className="text-[#12284b] font-medium">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Pending approval</span>
                    <span className="text-[#12284b] font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6b7280]">Available to claim</span>
                    <span className="text-[#1abc9c] font-medium">$500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#2467ec] to-[#1abc9c]">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Pro Tip</span>
                </div>
                <p className="text-white/80 text-sm mb-4">Complete your demographic profile to unlock more matching opportunities.</p>
                <Button onClick={() => setCurrentPage('demographics')} variant="secondary" className="w-full rounded-full bg-white text-[#2467ec] hover:bg-gray-100">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemographicsPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentPage('matching')} className="flex items-center gap-2 text-[#6b7280] hover:text-[#12284b] mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Matching Funds
        </button>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#2467ec]/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#2467ec]" />
              </div>
              <div>
                <CardTitle className="font-['Poppins']">Demographic Information</CardTitle>
                <CardDescription>Securely stored and encrypted</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-[#f9fafb] rounded-lg">
              <p className="text-sm text-[#6b7280]">
                <Lock className="w-4 h-4 inline mr-1" />
                This information helps us match you with eligible funding programs. 
                Your data is encrypted and never shared with third parties without your consent.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Annual Income Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25k">Under $25,000</SelectItem>
                  <SelectItem value="25-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50-75k">$50,000 - $75,000</SelectItem>
                  <SelectItem value="75-100k">$75,000 - $100,000</SelectItem>
                  <SelectItem value="100k+">$100,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Employment Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed full-time</SelectItem>
                  <SelectItem value="part-time">Employed part-time</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="some-college">Some College</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location (State/Region)</Label>
              <Input placeholder="e.g., California" />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox id="consent" />
              <label htmlFor="consent" className="text-sm text-[#6b7280]">
                I consent to sharing this information for the purpose of matching with funding programs. 
                I understand my data will be handled securely and in accordance with the privacy policy.
              </label>
            </div>

            <Button onClick={() => setCurrentPage('matching')} className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full h-12">
              Save and Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VerificationPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2467ec] to-[#1abc9c] flex items-center justify-center mx-auto mb-4">
              <Verified className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-['Poppins']">Prove Your Humanity</CardTitle>
            <CardDescription>Complete verification to unlock higher rewards and matching funds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { level: 'Basic', icon: UserCheck, status: 'completed', desc: 'Email and phone verified', reward: 'Standard access' },
                { level: 'Verified', icon: BadgeCheck, status: 'in-progress', desc: 'Government ID verification', reward: '2x matching eligibility' },
                { level: 'Premium', icon: Crown, status: 'locked', desc: 'Biometric + proof of humanity', reward: '5x matching + exclusive yields' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 ${item.status === 'completed' ? 'border-[#1abc9c] bg-[#1abc9c]/5' : item.status === 'in-progress' ? 'border-[#2467ec] bg-[#2467ec]/5' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'completed' ? 'bg-[#1abc9c]' : item.status === 'in-progress' ? 'bg-[#2467ec]' : 'bg-gray-200'}`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#12284b]">{item.level}</h4>
                        {item.status === 'completed' && <CheckCircle className="w-4 h-4 text-[#1abc9c]" />}
                      </div>
                      <p className="text-sm text-[#6b7280]">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={item.status === 'completed' ? 'bg-[#1abc9c]/10 text-[#1abc9c]' : item.status === 'in-progress' ? 'bg-[#2467ec]/10 text-[#2467ec]' : 'bg-gray-100 text-gray-500'}>
                        {item.reward}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#f9fafb] rounded-lg">
              <h4 className="font-semibold text-[#12284b] mb-2">Why verify?</h4>
              <ul className="space-y-2 text-sm text-[#6b7280]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1abc9c]" />
                  Prevent fraud and protect the community
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1abc9c]" />
                  Unlock higher matching fund limits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1abc9c]" />
                  Access exclusive yield opportunities
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1abc9c]" />
                  Reach higher trust tiers
                </li>
              </ul>
            </div>

            <Button onClick={() => setCurrentPage('dashboard')} className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full h-12">
              Continue Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfilePage({ user, setCurrentPage }: { user: User; setCurrentPage: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-[#2467ec]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-[#2467ec] to-[#1abc9c] text-white text-3xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#12284b] font-['Poppins']">{user.name}</h1>
                <p className="text-[#6b7280]">{user.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-[#2467ec]/10 text-[#2467ec]">
                    {user.verificationLevel.charAt(0).toUpperCase() + user.verificationLevel.slice(1)}
                  </Badge>
                  <span className="text-sm text-[#6b7280]">Member since 2024</span>
                </div>
              </div>
              <Button variant="outline" className="rounded-full">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-['Poppins']">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Personal Information', action: () => {} },
                  { label: 'Security Settings', action: () => {} },
                  { label: 'Notification Preferences', action: () => {} },
                  { label: 'Payment Methods', action: () => {} },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="w-full flex items-center justify-between p-3 hover:bg-[#f9fafb] rounded-lg transition-colors">
                    <span className="text-[#12284b]">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#6b7280]" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-['Poppins']">Verification & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Identity Verification', action: () => setCurrentPage('verification') },
                  { label: 'Demographic Profile', action: () => setCurrentPage('demographics') },
                  { label: 'Privacy Settings', action: () => {} },
                  { label: 'Data Export', action: () => {} },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} className="w-full flex items-center justify-between p-3 hover:bg-[#f9fafb] rounded-lg transition-colors">
                    <span className="text-[#12284b]">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#6b7280]" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={() => setCurrentPage('landing')} variant="outline" className="w-full mt-6 rounded-full text-[#e74c3c] border-[#e74c3c] hover:bg-[#e74c3c]/10">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function CircleDetailPage({ circleId, setCurrentPage, setViewingUserId }: { circleId: string; setCurrentPage: (page: string) => void; setViewingUserId: (id: string) => void }) {
  const circle = MOCK_CIRCLES.find(c => c.id === circleId) || MOCK_CIRCLES[0];
  const typeInfo = getCircleTypeInfo(circle.type);
  const TypeIcon = typeInfo.icon;

  const rotationHistory = circle.type === 'rosca' ? Array.from({ length: circle.currentCycle - 1 }, (_, i) => ({
    cycle: i + 1,
    recipient: circle.members[i % circle.members.length],
    amount: circle.totalPot,
    date: new Date(circle.createdAt.getTime() + (i * 30 * 24 * 60 * 60 * 1000)),
    status: 'completed' as const,
  })) : [];

  const currentRotation = circle.type === 'rosca' ? {
    cycle: circle.currentCycle,
    totalCycles: circle.totalCycles,
    nextRecipient: circle.members[(circle.currentCycle - 1) % circle.members.length],
    yourPosition: circle.members.findIndex(m => m.userId === '1') + 1,
    totalMembers: circle.members.length,
    yourTurnIn: ((circle.members.findIndex(m => m.userId === '1') + 1) - (circle.currentCycle % circle.members.length) + circle.members.length) % circle.members.length || circle.members.length,
  } : null;

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentPage('circles')} className="flex items-center gap-2 text-[#6b7280] hover:text-[#12284b] mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to My Circles
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-xl ${typeInfo.bg} flex items-center justify-center`}>
              <TypeIcon className={`w-6 h-6 ${typeInfo.text}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#12284b] font-['Poppins']">{circle.name}</h1>
              <p className="text-[#6b7280]">{circle.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Badge className={`${typeInfo.bg} ${typeInfo.text}`}>{typeInfo.label}</Badge>
            <Badge className="bg-[#1abc9c]/10 text-[#1abc9c]">{circle.status}</Badge>
            <Badge className="bg-[#2467ec]/10 text-[#2467ec]">{circle.frequency}</Badge>
            {circle.matchingFundEligible && (
              <Badge className="bg-[#f39c12]/10 text-[#f39c12]"><Gift className="w-3 h-3 mr-1" />Matched</Badge>
            )}
          </div>
        </div>

        {/* ROSCA */}
        {circle.type === 'rosca' && currentRotation && (
          <>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#2467ec]" />Current Rotation Status</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#2467ec] font-['Poppins']">{currentRotation.cycle}</p><p className="text-sm text-[#6b7280]">Current Cycle</p><p className="text-xs text-[#6b7280]">of {currentRotation.totalCycles}</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#1abc9c] font-['Poppins']">{currentRotation.yourPosition}</p><p className="text-sm text-[#6b7280]">Your Position</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#f39c12] font-['Poppins']">{currentRotation.yourTurnIn}</p><p className="text-sm text-[#6b7280]">Your Turn In</p><p className="text-xs text-[#6b7280]">cycles</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#9b59b6] font-['Poppins']">${circle.totalPot.toLocaleString()}</p><p className="text-sm text-[#6b7280]">Total Pot</p></div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[#12284b] mb-4">Rotation Order</h4>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {circle.members.map((member, index) => {
                      const position = index + 1;
                      const isCurrent = position === currentRotation.cycle;
                      const isPast = position < currentRotation.cycle;
                      const isUser = member.userId === '1';
                      return (
                        <div key={member.id} className="flex items-center flex-shrink-0">
                          <button onClick={() => { setViewingUserId(member.userId); setCurrentPage('public-profile'); }}
                            className={`relative w-16 h-20 rounded-xl flex flex-col items-center justify-center hover:opacity-80 transition-opacity ${isCurrent ? 'bg-[#2467ec] text-white' : isPast ? 'bg-[#1abc9c]/20 text-[#1abc9c]' : 'bg-gray-100 text-[#6b7280]'} ${isUser ? 'ring-2 ring-[#f39c12] ring-offset-2' : ''}`}>
                            <span className="text-xs font-medium mb-1">#{position}</span>
                            <Avatar className="w-8 h-8 mb-1"><AvatarFallback className={`text-xs ${isCurrent ? 'bg-white text-[#2467ec]' : isPast ? 'bg-[#1abc9c] text-white' : 'bg-gray-300 text-gray-600'}`}>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                            <span className="text-xs truncate max-w-[60px]">{member.name.split(' ')[0]}</span>
                            {isCurrent && <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#f39c12] rounded-full flex items-center justify-center"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /></span>}
                            {isPast && <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-[#1abc9c] bg-white rounded-full" />}
                          </button>
                          {index < circle.members.length - 1 && <ArrowRight className="w-4 h-4 text-[#6b7280] mx-1 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-[#2467ec]/10 to-[#1abc9c]/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2467ec] flex items-center justify-center"><Gift className="w-5 h-5 text-white" /></div>
                      <div><p className="font-medium text-[#12284b]">Next Payout</p><p className="text-sm text-[#6b7280]">{currentRotation.nextRecipient.name} receives ${circle.totalPot.toLocaleString()}</p></div>
                    </div>
                    <div className="text-right"><p className="text-sm text-[#6b7280]">Expected</p><p className="font-medium text-[#12284b]">{circle.nextPayoutDate?.toLocaleDateString()}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Calendar className="w-5 h-5 text-[#1abc9c]" />Rotation History</CardTitle><CardDescription>Completed cycles and payouts</CardDescription></CardHeader>
              <CardContent>
                {rotationHistory.length > 0 ? (<div className="space-y-3">{rotationHistory.map((rotation) => (<div key={rotation.cycle} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-[#1abc9c]/20 flex items-center justify-center"><span className="text-sm font-bold text-[#1abc9c]">#{rotation.cycle}</span></div><div><p className="font-medium text-[#12284b]">Cycle {rotation.cycle} Completed</p><p className="text-sm text-[#6b7280]">{rotation.date.toLocaleDateString()}</p></div></div><div className="flex items-center gap-4"><div className="text-right"><p className="font-medium text-[#12284b]">{rotation.recipient.name}</p><p className="text-sm text-[#6b7280]">Received payout</p></div><CheckCircle className="w-6 h-6 text-[#1abc9c]" /></div></div>))}</div>) : (<div className="text-center py-8"><Calendar className="w-8 h-8 text-[#6b7280] mx-auto mb-3" /><p className="text-[#6b7280]">No completed rotations yet</p></div>)}
              </CardContent>
            </Card>
          </>
        )}

        {/* Chit Fund */}
        {circle.type === 'chit_fund' && (
          <>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Gavel className="w-5 h-5 text-[#6366f1]" />Current Auction — Cycle {circle.currentCycle}</CardTitle><CardDescription>Members bid a discount on the pot. Lowest bidder wins.</CardDescription></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#6366f1] font-['Poppins']">${(circle.potValue ?? 0).toLocaleString()}</p><p className="text-sm text-[#6b7280]">Pot Value</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#1abc9c] font-['Poppins']">{circle.currentBid?.discount ?? 0}%</p><p className="text-sm text-[#6b7280]">Lowest Bid</p><p className="text-xs text-[#6b7280]">by {circle.currentBid?.userName ?? 'N/A'}</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#f39c12] font-['Poppins']">${Math.round((circle.potValue ?? 0) * (1 - (circle.currentBid?.discount ?? 0) / 100)).toLocaleString()}</p><p className="text-sm text-[#6b7280]">Net Payout</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#9b59b6] font-['Poppins']">{circle.organizerCommission ?? 0}%</p><p className="text-sm text-[#6b7280]">Commission</p></div>
                </div>
                <div className="p-4 bg-gradient-to-r from-[#6366f1]/10 to-[#4f46e5]/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[#6366f1] flex items-center justify-center"><Timer className="w-5 h-5 text-white" /></div><div><p className="font-medium text-[#12284b]">Auction ends {circle.nextPayoutDate?.toLocaleDateString() ?? 'TBD'}</p><p className="text-sm text-[#6b7280]">Min bid discount: {circle.minBidDiscount ?? 5}%</p></div></div>
                  <Button className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-full"><Gavel className="w-4 h-4 mr-2" />Place Bid</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Calendar className="w-5 h-5 text-[#6366f1]" />Bid History</CardTitle></CardHeader>
              <CardContent>
                {circle.bidHistory && circle.bidHistory.length > 0 ? (<div className="space-y-3">{circle.bidHistory.map((bid) => (<div key={bid.cycle} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-[#6366f1]/20 flex items-center justify-center"><span className="text-sm font-bold text-[#6366f1]">#{bid.cycle}</span></div><div><p className="font-medium text-[#12284b]">{bid.winnerName} won</p><p className="text-sm text-[#6b7280]">{bid.date.toLocaleDateString()}</p></div></div><div className="flex items-center gap-6"><div className="text-right"><p className="font-medium text-[#6366f1]">{bid.discount}% discount</p></div><div className="text-right"><p className="font-medium text-[#1abc9c]">${bid.netPayout.toLocaleString()}</p></div></div></div>))}</div>) : (<div className="text-center py-8"><Gavel className="w-8 h-8 text-[#6b7280] mx-auto mb-3" /><p className="text-[#6b7280]">No completed auctions yet</p></div>)}
              </CardContent>
            </Card>
          </>
        )}

        {/* Savings Challenge */}
        {circle.type === 'savings_challenge' && (
          <>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Trophy className="w-5 h-5 text-[#f39c12]" />Leaderboard</CardTitle><CardDescription>Race to ${(circle.savingsGoalPerMember ?? 0).toLocaleString()}</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(circle.memberProgress ?? []).map((member, index) => {
                    const pct = Math.round((member.amountSaved / (circle.savingsGoalPerMember ?? 1)) * 100);
                    const isUser = member.userId === '1';
                    const medals = ['text-[#f39c12]', 'text-[#9ca3af]', 'text-[#cd7f32]'];
                    return (
                      <div key={member.userId} className={`p-4 rounded-xl ${isUser ? 'bg-[#f39c12]/5 ring-2 ring-[#f39c12]/30' : 'bg-[#f9fafb]'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold font-['Poppins'] ${index < 3 ? medals[index] : 'text-[#6b7280]'}`}>#{index + 1}</span>
                            <div><p className="font-medium text-[#12284b]">{member.name} {isUser && '(You)'}</p><div className="flex items-center gap-2 text-xs text-[#6b7280]"><Flame className="w-3 h-3 text-[#f39c12]" />{member.streak} week streak</div></div>
                          </div>
                          <div className="text-right"><p className="font-bold text-[#12284b]">${member.amountSaved.toLocaleString()}</p><p className="text-xs text-[#6b7280]">{pct}% of goal</p></div>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Timer className="w-5 h-5 text-[#f39c12]" />Challenge Timer</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#f39c12] font-['Poppins']">{circle.challengeEndDate ? Math.max(0, Math.ceil((circle.challengeEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0}</p><p className="text-sm text-[#6b7280]">Days Remaining</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#2467ec] font-['Poppins']">{circle.currentCycle}/{circle.totalCycles}</p><p className="text-sm text-[#6b7280]">Weeks Completed</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#1abc9c] font-['Poppins']">${circle.totalPot.toLocaleString()}</p><p className="text-sm text-[#6b7280]">Total Saved (all)</p></div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[#12284b] mb-3">Your Milestones</h4>
                  <div className="flex items-center gap-3">
                    {[25, 50, 75, 100].map((milestone) => {
                      const myProgress = circle.memberProgress?.find(m => m.userId === '1');
                      const myPct = myProgress ? Math.round((myProgress.amountSaved / (circle.savingsGoalPerMember ?? 1)) * 100) : 0;
                      const achieved = myPct >= milestone;
                      return (<div key={milestone} className={`flex-1 p-3 rounded-xl text-center ${achieved ? 'bg-[#f39c12]/10' : 'bg-gray-100'}`}><Flag className={`w-5 h-5 mx-auto mb-1 ${achieved ? 'text-[#f39c12]' : 'text-[#6b7280]'}`} /><p className={`text-sm font-bold ${achieved ? 'text-[#f39c12]' : 'text-[#6b7280]'}`}>{milestone}%</p><p className="text-xs text-[#6b7280]">{achieved ? 'Achieved!' : 'Locked'}</p></div>);
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Emergency Fund */}
        {circle.type === 'emergency_fund' && (
          <>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Shield className="w-5 h-5 text-[#1abc9c]" />Fund Status</CardTitle></CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#1abc9c] font-['Poppins']">${(circle.currentFundBalance ?? 0).toLocaleString()}</p><p className="text-sm text-[#6b7280]">Current Balance</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#2467ec] font-['Poppins']">${(circle.targetFundSize ?? 0).toLocaleString()}</p><p className="text-sm text-[#6b7280]">Target Size</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-3xl font-bold text-[#f39c12] font-['Poppins']">${(circle.maxWithdrawal ?? 0).toLocaleString()}</p><p className="text-sm text-[#6b7280]">Max Withdrawal</p></div>
                </div>
                <div><div className="flex justify-between text-sm mb-2"><span className="text-[#6b7280]">Fund Progress</span><span className="font-medium text-[#12284b]">{Math.round(((circle.currentFundBalance ?? 0) / (circle.targetFundSize ?? 1)) * 100)}%</span></div><Progress value={((circle.currentFundBalance ?? 0) / (circle.targetFundSize ?? 1)) * 100} className="h-3" /></div>
                <div className="mt-4 p-3 bg-[#1abc9c]/5 rounded-lg text-sm text-[#1abc9c]"><p className="font-medium">Approval method: {circle.approvalMethod === 'majority_vote' ? 'Majority Vote' : circle.approvalMethod === 'admin_approval' ? 'Admin Approval' : 'Automatic'}</p></div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#f39c12]" />Withdrawal Requests</CardTitle></CardHeader>
              <CardContent>
                {circle.withdrawalRequests && circle.withdrawalRequests.length > 0 ? (<div className="space-y-4">{circle.withdrawalRequests.map((req) => (<div key={req.id} className={`p-4 rounded-xl border ${req.status === 'pending' ? 'border-[#f39c12]/30 bg-[#f39c12]/5' : req.status === 'approved' ? 'border-[#1abc9c]/30 bg-[#1abc9c]/5' : 'border-red-200 bg-red-50'}`}><div className="flex items-start justify-between mb-3"><div><p className="font-medium text-[#12284b]">{req.userName}</p><p className="text-sm text-[#6b7280]">{req.reason}</p><p className="text-xs text-[#6b7280]">{req.date.toLocaleDateString()}</p></div><div className="text-right"><p className="font-bold text-[#12284b]">${req.amount.toLocaleString()}</p><Badge className={req.status === 'pending' ? 'bg-[#f39c12]/10 text-[#f39c12]' : req.status === 'approved' ? 'bg-[#1abc9c]/10 text-[#1abc9c]' : 'bg-red-100 text-red-600'}>{req.status}</Badge></div></div>{req.status === 'pending' && (<div className="flex items-center justify-between"><div className="flex items-center gap-4 text-sm text-[#6b7280]"><span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4 text-[#1abc9c]" /> {req.votesFor} for</span><span className="flex items-center gap-1"><ThumbsDown className="w-4 h-4 text-red-400" /> {req.votesAgainst} against</span></div><div className="flex gap-2"><Button size="sm" className="bg-[#1abc9c] hover:bg-[#16a085] rounded-full"><ThumbsUp className="w-3 h-3 mr-1" /> Approve</Button><Button size="sm" variant="outline" className="rounded-full text-red-500 border-red-200"><ThumbsDown className="w-3 h-3 mr-1" /> Deny</Button></div></div>)}</div>))}</div>) : (<div className="text-center py-8"><Shield className="w-8 h-8 text-[#6b7280] mx-auto mb-3" /><p className="text-[#6b7280]">No withdrawal requests</p></div>)}
              </CardContent>
            </Card>
          </>
        )}

        {/* Goal-Based */}
        {circle.type === 'goal_based' && (
          <>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Target className="w-5 h-5 text-[#9b59b6]" />Goal Progress</CardTitle><CardDescription>{circle.goalDescription}</CardDescription></CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160"><circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12" /><circle cx="80" cy="80" r="70" fill="none" stroke="#9b59b6" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - (circle.currentAmount ?? 0) / (circle.targetAmount ?? 1))}`} strokeLinecap="round" /></svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center"><p className="text-3xl font-bold text-[#9b59b6] font-['Poppins']">{Math.round(((circle.currentAmount ?? 0) / (circle.targetAmount ?? 1)) * 100)}%</p><p className="text-xs text-[#6b7280]">of goal</p></div>
                  </div>
                  <p className="text-2xl font-bold text-[#12284b]">${(circle.currentAmount ?? 0).toLocaleString()} <span className="text-[#6b7280] font-normal text-lg">of ${(circle.targetAmount ?? 0).toLocaleString()}</span></p>
                </div>
                <div className="mb-6"><Progress value={((circle.currentAmount ?? 0) / (circle.targetAmount ?? 1)) * 100} className="h-4" /><div className="flex justify-between mt-2">{[25, 50, 75, 100].map((pct) => { const reached = ((circle.currentAmount ?? 0) / (circle.targetAmount ?? 1)) * 100 >= pct; return (<div key={pct} className="text-center"><div className={`w-3 h-3 rounded-full mx-auto mb-1 ${reached ? 'bg-[#9b59b6]' : 'bg-gray-300'}`} /><span className={`text-xs ${reached ? 'text-[#9b59b6] font-medium' : 'text-[#6b7280]'}`}>{pct}%</span></div>); })}</div></div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-2xl font-bold text-[#9b59b6] font-['Poppins']">${((circle.targetAmount ?? 0) - (circle.currentAmount ?? 0)).toLocaleString()}</p><p className="text-sm text-[#6b7280]">Remaining</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-2xl font-bold text-[#2467ec] font-['Poppins']">{circle.targetDate ? Math.max(0, Math.ceil((circle.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0}</p><p className="text-sm text-[#6b7280]">Days to Deadline</p></div>
                  <div className="text-center p-4 bg-[#f9fafb] rounded-xl"><p className="text-2xl font-bold text-[#1abc9c] font-['Poppins']">{circle.members.length}</p><p className="text-sm text-[#6b7280]">Contributors</p></div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-[#9b59b6]/10 to-[#8e44ad]/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-[#9b59b6] flex items-center justify-center"><Calendar className="w-5 h-5 text-white" /></div><div><p className="font-medium text-[#12284b]">Target Date</p><p className="text-sm text-[#6b7280]">{circle.targetDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div></div>
                    <div className="text-right"><p className="text-sm text-[#6b7280]">Pace</p><p className={`font-medium ${((circle.currentAmount ?? 0) / (circle.targetAmount ?? 1)) >= (circle.currentCycle / circle.totalCycles) ? 'text-[#1abc9c]' : 'text-[#f39c12]'}`}>{((circle.currentAmount ?? 0) / (circle.targetAmount ?? 1)) >= (circle.currentCycle / circle.totalCycles) ? 'On Track' : 'Behind'}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Shared: Members */}
        <Card className="border-0 shadow-lg mb-6">
          <CardHeader><CardTitle className="font-['Poppins'] flex items-center gap-2"><Users className="w-5 h-5 text-[#9b59b6]" />Members</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {circle.members.map((member, index) => {
                const contributed = member.hasReceivedPayout ? circle.contributionAmount * circle.totalCycles : circle.contributionAmount * (circle.currentCycle - 1);
                const received = member.hasReceivedPayout ? circle.totalPot : 0;
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl">
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setViewingUserId(member.userId); setCurrentPage('public-profile'); }} className="relative hover:opacity-80 transition-opacity">
                        <Avatar className="w-10 h-10 cursor-pointer"><AvatarFallback className={`bg-gradient-to-br ${typeInfo.gradient} text-white text-sm`}>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                        <span className={`absolute -bottom-1 -right-1 w-5 h-5 ${typeInfo.text} bg-white text-xs rounded-full flex items-center justify-center border`}>{index + 1}</span>
                      </button>
                      <div><button onClick={() => { setViewingUserId(member.userId); setCurrentPage('public-profile'); }} className="font-medium text-[#12284b] hover:text-[#2467ec] transition-colors">{member.name}</button><p className="text-sm text-[#6b7280]">Position #{index + 1}</p></div>
                    </div>
                    <div className="text-right"><p className="font-medium text-[#12284b]">${contributed.toLocaleString()}</p><p className="text-sm text-[#6b7280]">contributed</p></div>
                    {member.hasReceivedPayout && (<div className="text-right"><p className="font-medium text-[#1abc9c]">+${received.toLocaleString()}</p><p className="text-sm text-[#6b7280]">received</p></div>)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          {circle.type === 'emergency_fund' ? (
            <>
              <Button onClick={() => setCurrentPage('add-money')} className="bg-[#1abc9c] hover:bg-[#16a085] rounded-full flex-1"><DollarSign className="w-4 h-4 mr-2" />Make Contribution</Button>
              <Button variant="outline" className="rounded-full flex-1 text-[#f39c12] border-[#f39c12]/30"><AlertTriangle className="w-4 h-4 mr-2" />Request Withdrawal</Button>
            </>
          ) : (
            <Button onClick={() => setCurrentPage('add-money')} className="bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full flex-1"><DollarSign className="w-4 h-4 mr-2" />Make Contribution</Button>
          )}
          <Button onClick={() => setCurrentPage('invite')} variant="outline" className="rounded-full flex-1"><UserPlus className="w-4 h-4 mr-2" />Invite Member</Button>
          <Button variant="outline" className="rounded-full"><Settings className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function WalletPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [showCrypto, setShowCrypto] = useState(false);
  const wallet = MOCK_WALLET;

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalBalanceUsd = wallet.fiatBalance + (wallet.cryptoBalance * wallet.cryptoValueUsd);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12284b] font-['Poppins']">My Wallet</h1>
          <p className="text-[#6b7280]">Manage your funds and view transactions</p>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg md:col-span-2 bg-gradient-to-br from-[#2467ec] to-[#1abc9c]">
            <CardContent className="p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/80">Total Balance</span>
                <button onClick={() => setShowCrypto(!showCrypto)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  {showCrypto ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-4xl font-bold font-['Poppins'] mb-2">
                {showCrypto ? `${wallet.cryptoBalance.toLocaleString()} ${wallet.cryptoSymbol}` : `$${totalBalanceUsd.toLocaleString()}`}
              </p>
              <p className="text-white/70 text-sm">
                {showCrypto ? `≈ $${(wallet.cryptoBalance * wallet.cryptoValueUsd).toLocaleString()} USD` : `≈ ${wallet.cryptoBalance.toLocaleString()} ${wallet.cryptoSymbol}`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#2467ec]/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-[#2467ec]" />
                </div>
                <span className="text-[#6b7280]">Fiat Balance</span>
              </div>
              <p className="text-2xl font-bold text-[#12284b] font-['Poppins']">${wallet.fiatBalance.toLocaleString()}</p>
              <p className="text-sm text-[#6b7280]">Available for deposit</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Address & Actions */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#f9fafb] flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-[#2467ec]" />
                </div>
                <div>
                  <p className="text-sm text-[#6b7280] mb-1">Wallet Address</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-[#f9fafb] px-3 py-1 rounded-lg text-[#12284b]">
                      {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                    </code>
                    <button onClick={handleCopy} className="p-2 hover:bg-[#f9fafb] rounded-lg transition-colors">
                      {copied ? <Check className="w-4 h-4 text-[#1abc9c]" /> : <Copy className="w-4 h-4 text-[#6b7280]" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setCurrentPage('deposit')} className="bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
                <Button variant="outline" className="rounded-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins']">Transaction History</CardTitle>
                <CardDescription>Your recent deposits, withdrawals, and circle transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wallet.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.type === 'deposit' ? 'bg-[#1abc9c]/20' : 
                          tx.type === 'payout' ? 'bg-[#2467ec]/20' : 
                          tx.type === 'yield' ? 'bg-[#f39c12]/20' : 
                          'bg-[#e74c3c]/20'
                        }`}>
                          {tx.type === 'deposit' ? <Plus className="w-5 h-5 text-[#1abc9c]" /> :
                           tx.type === 'payout' ? <Gift className="w-5 h-5 text-[#2467ec]" /> :
                           tx.type === 'yield' ? <TrendingUp className="w-5 h-5 text-[#f39c12]" /> :
                           <DollarSign className="w-5 h-5 text-[#e74c3c]" />}
                        </div>
                        <div>
                          <p className="font-medium text-[#12284b] capitalize">{tx.type}</p>
                          <p className="text-sm text-[#6b7280]">{tx.description}</p>
                          <p className="text-xs text-[#6b7280]">{tx.timestamp.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === 'deposit' || tx.type === 'payout' || tx.type === 'yield' ? 'text-[#1abc9c]' : 'text-[#e74c3c]'}`}>
                          {tx.type === 'deposit' || tx.type === 'payout' || tx.type === 'yield' ? '+' : '-'}
                          {tx.currency === 'USD' ? '$' : ''}{tx.amount.toLocaleString()}
                          {tx.currency === 'CRYPTO' ? ` ${wallet.cryptoSymbol}` : ''}
                        </p>
                        <Badge variant="outline" className={tx.status === 'completed' ? 'text-[#1abc9c] border-[#1abc9c]' : tx.status === 'pending' ? 'text-[#f39c12] border-[#f39c12]' : 'text-[#e74c3c] border-[#e74c3c]'}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="font-['Poppins']">Wallet Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Total Deposited</span>
                    <span className="font-medium text-[#12284b]">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Total Withdrawn</span>
                    <span className="font-medium text-[#12284b]">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Circle Contributions</span>
                    <span className="font-medium text-[#12284b]">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Payouts Received</span>
                    <span className="font-medium text-[#1abc9c]">+$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Yield Earned</span>
                    <span className="font-medium text-[#f39c12]">+$12.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#2467ec] to-[#1abc9c]">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Earn Yield</span>
                </div>
                <p className="text-white/80 text-sm mb-4">Put your idle funds to work with up to 7.2% APY.</p>
                <Button onClick={() => setCurrentPage('yield')} variant="secondary" className="w-full rounded-full bg-white text-[#2467ec] hover:bg-gray-100">
                  Explore Yields
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepositPage({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('card');

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentPage('wallet')} className="flex items-center gap-2 text-[#6b7280] hover:text-[#12284b] mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Wallet
        </button>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-['Poppins']">Deposit Funds</CardTitle>
            <CardDescription>Add money to your wallet (converts to USDC automatically)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="p-4 bg-[#f9fafb] rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2467ec]/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-[#2467ec]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#12284b]">How it works</p>
                      <p className="text-sm text-[#6b7280]">Your fiat deposit is automatically converted to USDC stablecoin</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#6b7280]" />
                    <Input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-12 h-16 text-3xl font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['50', '100', '250', '500', '1000'].map((amt) => (
                      <button key={amt} onClick={() => setAmount(amt)} className="px-4 py-2 bg-[#f9fafb] rounded-lg text-sm text-[#12284b] hover:bg-gray-200 transition-colors">
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, last4: '•••• 4242', instant: true },
                      { id: 'bank', name: 'Bank Account (ACH)', icon: Landmark, last4: '•••• 1234', instant: false },
                      { id: 'wire', name: 'Wire Transfer', icon: Globe, last4: '', instant: false },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${method === m.id ? 'border-[#2467ec] bg-[#2467ec]/5' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <m.icon className="w-5 h-5 text-[#6b7280]" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-[#12284b]">{m.name}</p>
                          {m.last4 && <p className="text-sm text-[#6b7280]">{m.last4}</p>}
                        </div>
                        <div className="text-right">
                          {m.instant && <Badge className="bg-[#1abc9c]/10 text-[#1abc9c]">Instant</Badge>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full bg-[#2467ec] hover:bg-[#1a5fd4] h-14 text-lg rounded-full">
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-[#2467ec]/10 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-10 h-10 text-[#2467ec]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#12284b] mb-2">Confirm Deposit</h3>
                  <p className="text-[#6b7280]">Review your deposit details</p>
                </div>

                <div className="space-y-4 p-4 bg-[#f9fafb] rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">You deposit</span>
                    <span className="font-medium text-[#12284b]">${amount || '0.00'} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Conversion rate</span>
                    <span className="font-medium text-[#12284b]">1 USD = 1 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b7280]">Network fee</span>
                    <span className="font-medium text-[#1abc9c]">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium text-[#12284b]">You receive</span>
                    <span className="font-bold text-[#1abc9c]">{amount || '0.00'} USDC</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-full h-12">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full h-12">
                    Confirm Deposit
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-[#1abc9c]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-[#1abc9c]" />
                </div>
                <h3 className="text-xl font-semibold text-[#12284b] mb-2">Deposit Initiated!</h3>
                <p className="text-[#6b7280] mb-6">Your ${amount || '0.00'} is being processed and will be converted to USDC.</p>
                <div className="p-4 bg-[#f9fafb] rounded-xl mb-6">
                  <p className="text-sm text-[#6b7280]">Transaction ID</p>
                  <code className="text-[#12284b]">0x7a8f...9c2d</code>
                </div>
                <Button onClick={() => setCurrentPage('wallet')} className="bg-[#2467ec] hover:bg-[#1a5fd4] rounded-full px-8">
                  View Wallet
                </Button>
              </div>
            )}

            <p className="text-center text-sm text-[#6b7280]">
              <Lock className="w-3 h-3 inline mr-1" />
              Secured by 256-bit encryption. Funds held in audited smart contracts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PublicProfilePage({ userId, setCurrentPage }: { userId: string; setCurrentPage: (page: string) => void }) {
  const publicUser = MOCK_PUBLIC_USERS.find(u => u.id === userId);

  if (!publicUser || !publicUser.isPublic) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-[#6b7280]" />
          </div>
          <h1 className="text-2xl font-bold text-[#12284b] mb-2">Profile Private</h1>
          <p className="text-[#6b7280] mb-6">This user has chosen to keep their profile private.</p>
          <Button onClick={() => setCurrentPage('circles')} className="bg-[#2467ec] rounded-full">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentPage('circles')} className="flex items-center gap-2 text-[#6b7280] hover:text-[#12284b] mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-[#2467ec]">
                <AvatarFallback className="bg-gradient-to-br from-[#2467ec] to-[#1abc9c] text-white text-3xl">
                  {publicUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-[#12284b] font-['Poppins']">{publicUser.name}</h1>
                  <Badge className={publicUser.verificationLevel === 'premium' ? 'bg-[#f39c12]/10 text-[#f39c12]' : publicUser.verificationLevel === 'verified' ? 'bg-[#1abc9c]/10 text-[#1abc9c]' : 'bg-gray-100 text-gray-600'}>
                    {publicUser.verificationLevel === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                    {publicUser.verificationLevel.charAt(0).toUpperCase() + publicUser.verificationLevel.slice(1)}
                  </Badge>
                </div>
                {publicUser.location && (
                  <div className="flex items-center justify-center md:justify-start gap-1 text-[#6b7280] mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{publicUser.location}</span>
                  </div>
                )}
                <div className="flex items-center justify-center md:justify-start gap-1 text-[#6b7280]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Member since {publicUser.memberSince.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                {publicUser.bio && (
                  <p className="text-[#12284b] mt-4">{publicUser.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg text-center p-4">
            <p className="text-2xl font-bold text-[#2467ec] font-['Poppins']">{getTrustTierInfo(publicUser.trustTier).label}</p>
            <p className="text-sm text-[#6b7280]">Trust Level</p>
          </Card>
          <Card className="border-0 shadow-lg text-center p-4">
            <p className="text-2xl font-bold text-[#1abc9c] font-['Poppins']">${publicUser.totalSaved.toLocaleString()}</p>
            <p className="text-sm text-[#6b7280]">Total Saved</p>
          </Card>
          <Card className="border-0 shadow-lg text-center p-4">
            <p className="text-2xl font-bold text-[#f39c12] font-['Poppins']">{publicUser.circlesJoined}</p>
            <p className="text-sm text-[#6b7280]">Circles Joined</p>
          </Card>
          <Card className="border-0 shadow-lg text-center p-4">
            <p className="text-2xl font-bold text-[#9b59b6] font-['Poppins']">{publicUser.circlesCompleted}</p>
            <p className="text-sm text-[#6b7280]">Completed</p>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="font-['Poppins']">Shared Circles</CardTitle>
            <CardDescription>Circles you both participate in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_CIRCLES.filter(c => c.members.some(m => m.userId === userId) && c.members.some(m => m.userId === '1')).map(circle => (
                <div key={circle.id} className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2467ec]/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#2467ec]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#12284b]">{circle.name}</p>
                      <p className="text-sm text-[#6b7280]">{circle.members.length} members</p>
                    </div>
                  </div>
                  <Button onClick={() => setCurrentPage('circle-detail')} variant="outline" size="sm" className="rounded-full">
                    View
                  </Button>
                </div>
              ))}
              {MOCK_CIRCLES.filter(c => c.members.some(m => m.userId === userId) && c.members.some(m => m.userId === '1')).length === 0 && (
                <p className="text-center text-[#6b7280] py-4">No shared circles yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | undefined>(undefined);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState<string>('1');

  const handleLogin = () => {
    setUser(MOCK_USER);
  };

  const navigateToCircle = (circleId: string) => {
    setSelectedCircleId(circleId);
    setCurrentPage('circle-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <AuthPage type="login" setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'signup':
        return <AuthPage type="signup" setCurrentPage={setCurrentPage} onLogin={handleLogin} />;
      case 'dashboard':
        return user ? <Dashboard user={user} setCurrentPage={setCurrentPage} navigateToCircle={navigateToCircle} /> : <LandingPage setCurrentPage={setCurrentPage} />;
      case 'wallet':
        return <WalletPage setCurrentPage={setCurrentPage} />;
      case 'deposit':
        return <DepositPage setCurrentPage={setCurrentPage} />;
      case 'circles':
        return <CirclesPage setCurrentPage={setCurrentPage} navigateToCircle={navigateToCircle} />;
      case 'circle-detail':
        return <CircleDetailPage circleId={selectedCircleId} setCurrentPage={setCurrentPage} setViewingUserId={setViewingUserId} />;
      case 'create-circle':
        return <CreateCirclePage setCurrentPage={setCurrentPage} />;
      case 'add-money':
        return <AddMoneyPage setCurrentPage={setCurrentPage} />;
      case 'credit':
        return user ? <TrustScorePage user={user} /> : <LandingPage setCurrentPage={setCurrentPage} />;
      case 'yield':
        return <YieldPage />;
      case 'matching':
        return <MatchingFundsPage setCurrentPage={setCurrentPage} />;
      case 'demographics':
        return <DemographicsPage setCurrentPage={setCurrentPage} />;
      case 'verification':
        return <VerificationPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return user ? <ProfilePage user={user} setCurrentPage={setCurrentPage} /> : <LandingPage setCurrentPage={setCurrentPage} />;
      case 'public-profile':
        return viewingUserId ? <PublicProfilePage userId={viewingUserId} setCurrentPage={setCurrentPage} /> : <LandingPage setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
      {renderPage()}
    </div>
  );
}

export default App;
