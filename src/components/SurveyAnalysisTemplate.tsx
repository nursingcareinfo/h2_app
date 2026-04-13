import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Target, Users, Zap, Shield, 
  TrendingDown, Briefcase, Heart, 
  ArrowRight, BarChart4, PieChart
} from 'lucide-react';

const bmcBlocks = [
  {
    id: 'vp',
    title: 'Value Proposition',
    icon: Target,
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    description: 'What "Fair Pay" and "Choice" mean to nurses.',
    insights: [
      { survey: 'Nurses receive < 60% of patient fee', action: 'Implement 15% flat service fee model' },
      { survey: 'Desire to set own market rates', action: 'Deploy "Dynamic Pricing Engine" for staff' }
    ]
  },
  {
    id: 'kp',
    title: 'Key Partners',
    icon: Users,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    description: 'Institutions for recruitment & verification.',
    insights: [
      { survey: 'PNC license renewal is a major friction', action: 'Partner with PNC for digital verification API' },
      { survey: 'Recruitment from 167 nursing colleges', action: 'Establish campus ambassador programs' }
    ]
  },
  {
    id: 'rs',
    title: 'Revenue Streams',
    icon: TrendingDown,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    description: 'Monetizing the "Formalization Engine".',
    insights: [
      { survey: 'Willingness to pay for credential vault', action: 'SaaS subscription for premium nurse profiles' },
      { survey: 'Delayed payments are a dealbreaker', action: 'Instant payout feature via digital wallets' }
    ]
  },
  {
    id: 'ch',
    title: 'Channels',
    icon: Zap,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    description: 'WhatsApp-Native coordination path.',
    insights: [
      { survey: '80% coordination happens on WhatsApp', action: 'Build WhatsApp-to-App bridge for shift alerts' },
      { survey: 'Trust built through peer reviews', action: 'Implement "Family-to-Nurse" rating system' }
    ]
  }
];

export default function SurveyAnalysisTemplate() {
  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-purple-400">
            Strategic Analysis Pipeline
          </h2>
          <p className="text-slate-400 font-medium">Mapping field insights to the Deterministic Execution Pipeline (BMC)</p>
        </div>
        <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 px-4 py-1.5 font-bold tracking-widest uppercase text-[10px] animate-pulse">
          DICE Fellowship Framework
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bmcBlocks.map((block, i) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md h-full hover:border-sky-500/30 transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 ${block.bg} rounded-xl border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
                    <block.icon className={`h-5 w-5 ${block.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white tracking-tight">{block.title}</CardTitle>
                    <CardDescription className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">{block.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {block.insights.map((insight, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/40 rounded-xl border border-sky-500/5 space-y-3 group-hover:bg-slate-950/60 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500/40 flex-shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                        <p className="text-xs text-slate-400 italic font-medium leading-relaxed">"{insight.survey}"</p>
                      </div>
                      <div className="flex flex-col gap-2 pl-4.5 border-l border-sky-500/10">
                        <div className="flex items-center gap-2 text-sky-400">
                          <ArrowRight className="h-3 w-3" />
                          <p className="text-[9px] font-black uppercase tracking-widest">Strategic Action</p>
                        </div>
                        <p className="text-sm text-slate-200 font-semibold leading-snug">{insight.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-sky-500/20 bg-slate-900/40 backdrop-blur-md border-t-sky-500/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-white tracking-tighter">Sludge Cost Validation Matrix</CardTitle>
              <CardDescription className="text-slate-400 font-medium">Quantifying the 34% markup gap from survey data</CardDescription>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
              <TrendingDown className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg. Patient Fee (24h)</div>
              <div className="text-3xl font-black text-white tracking-tighter">Rs. 8,500</div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                <div className="h-full bg-slate-600 w-full" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg. Nurse Pay (Survey)</div>
              <div className="text-3xl font-black text-emerald-400 tracking-tighter">Rs. 5,200</div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-emerald-500/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '61%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identified Sludge Cost</div>
              <div className="text-3xl font-black text-rose-400 tracking-tighter">38.8%</div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-rose-500/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '38.8%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
                />
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-sky-500/10" />
          <div className="flex items-center gap-5 p-6 bg-sky-500/10 border border-sky-500/20 rounded-2xl shadow-[inset_0_0_30px_rgba(56,189,248,0.05)]">
            <div className="p-3 bg-sky-500/20 rounded-xl border border-sky-500/30">
              <Shield className="h-6 w-6 text-sky-400 flex-shrink-0" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              <span className="font-black text-white uppercase tracking-widest text-[10px] mr-2 px-2 py-0.5 bg-sky-500/20 rounded">Analyst Note</span> 
              The survey data confirms that the markup gap is higher than the initial 34% theory. This strengthens the <span className="text-sky-400 font-bold">"Fair Pay" moat</span> and justifies the mandatory PNC verification as a premium filter.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
