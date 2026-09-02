import React, { useState } from 'react';
import {
  Award,
  Star,
  Flame,
  ShieldCheck,
  PackageCheck,
  Sprout,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowUpRight,
  Gift,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RewardItem } from '../../types';

export const RewardsView: React.FC = () => {
  const { totalPoints, currentLevel, longestStreak, transactions, rewards, redeemReward } = useApp();

  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleRedeem = async (reward: RewardItem) => {
    setIsRedeeming(true);
    const ok = await redeemReward(reward.id);
    setIsRedeeming(false);
    if (ok) {
      setSelectedReward(reward);
      setSuccessModalOpen(true);
    }
  };

  const milestones = [
    { title: '7-Day Survival', points: '+20 pts', desc: 'First week of consistent hydration and observation' },
    { title: '30-Day Pioneer', points: '+50 pts', desc: 'Sustained acclimation and foliage stability' },
    { title: '90-Day Seasoned', points: '+100 pts', desc: 'Full seasonal survival through environmental shifts' },
    { title: '180-Day Guardian', points: '+150 pts', desc: 'Half-year mastery of personal indoor/balcony microclimate' },
    { title: 'Plant Recovery', points: '+75 pts', desc: 'Successfully nursing a stressed plant back to thriving health' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Sustainable Reward Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Verified Ledger & Maintenance Rewards</h1>
          <p className="text-emerald-200/80 text-sm mt-1">
            We reward long-term plant survival, consistent care, and health recoveries rather than impulse purchasing.
          </p>
        </div>

        {/* Gamification Stats Summary */}
        <div className="flex items-center gap-4 bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-700/60">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Total Green Points</span>
            <div className="text-2xl font-black text-white flex items-center gap-1.5">
              <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" />
              <span>{totalPoints}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-emerald-800" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Current Level</span>
            <div className="text-2xl font-black text-amber-300">Lvl {currentLevel}</div>
          </div>
        </div>
      </div>

      {/* Sustainable Maintenance Milestones */}
      <div className="bg-emerald-950/70 rounded-2xl p-6 border border-emerald-800/60 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Long-Term Plant Survival Milestones</span>
          </h2>
          <span className="text-xs text-emerald-300 font-mono">Longest Active Streak: {longestStreak} Days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-800/50 space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{m.title}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{m.points}</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 mt-1 leading-snug">{m.desc}</p>
              </div>
              <div className="pt-2 text-[10px] text-emerald-400/60 font-mono">Verified Server-Side</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Rewards Catalog (Left) + Verified Point Ledger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Rewards Store (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-400" />
              <span>Available Rewards & Eco-Kits</span>
            </h2>
            <span className="text-xs text-emerald-300/80">Simulated Partner Fulfillment</span>
          </div>

          <div className="space-y-4">
            {rewards.map((reward) => {
              const canAfford = totalPoints >= reward.pointsCost;
              const isRedeemed = reward.isRedeemed;

              return (
                <div
                  key={reward.id}
                  id={`reward-card-${reward.id}`}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isRedeemed
                      ? 'bg-emerald-950/40 border-emerald-900/60 opacity-80'
                      : canAfford
                      ? 'bg-emerald-900/50 border-emerald-600/70 hover:border-emerald-400 shadow-md'
                      : 'bg-emerald-950/60 border-emerald-800/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center shrink-0">
                      <Sprout className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{reward.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-emerald-200 uppercase font-mono">
                          {reward.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/80 max-w-md">{reward.description}</p>
                      <span className="text-[10px] text-emerald-400/60 block">
                        {reward.deliveryType === 'instant_digital'
                          ? '⚡ Instant Digital Certificate'
                          : '📦 Sustainable Nursery Partner Kit'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-base font-black text-amber-300">{reward.pointsCost} pts</span>
                    </div>

                    {isRedeemed ? (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Redeemed</span>
                      </span>
                    ) : (
                      <button
                        id={`redeem-btn-${reward.id}`}
                        disabled={!canAfford || isRedeeming}
                        onClick={() => handleRedeem(reward)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                          canAfford
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
                            : 'bg-emerald-900/60 text-emerald-500/60 cursor-not-allowed border border-emerald-800/40'
                        }`}
                      >
                        {canAfford ? 'Redeem Reward' : `Need ${reward.pointsCost - totalPoints} more`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Verified Server-Side Points Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Verified Points Ledger</span>
            </h2>
            <span className="text-xs text-emerald-400 font-mono">Anti-Tamper Record</span>
          </div>

          <div className="bg-emerald-950/70 rounded-2xl p-5 border border-emerald-800/60 space-y-3 max-h-[580px] overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800/50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">{tx.description}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400/70">
                    <span>{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="text-emerald-300 font-medium">Server-Verified ✓</span>
                  </div>
                </div>

                <span
                  className={`font-mono font-bold text-sm shrink-0 ${
                    tx.points > 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redemption Success Modal */}
      {successModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-950 border border-emerald-600 rounded-2xl max-w-md w-full p-6 text-center space-y-5 animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-300">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Reward Unlocked!</h3>
              <p className="text-xs text-emerald-300/80 mt-1">
                You successfully redeemed <strong className="text-white">{selectedReward.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-700/60 text-xs text-emerald-200/90 text-left space-y-1">
              <span className="font-bold text-white">Fulfillment Details:</span>
              <p>{selectedReward.description}</p>
              <p className="text-[11px] text-emerald-400 font-mono pt-1">
                {selectedReward.deliveryType === 'instant_digital'
                  ? 'Digital badge added to your LittleStep profile.'
                  : 'Fulfillment order voucher generated for partner nursery dispatch.'}
              </p>
            </div>

            <button
              onClick={() => setSuccessModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm shadow transition-colors"
            >
              Continue Green Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
