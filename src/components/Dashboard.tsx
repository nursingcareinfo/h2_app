import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, HeartPulse, Clock, 
  BarChart3, PieChart, Activity, MessageSquare,
  Search, Filter, Download, RefreshCw, FileText,
  ShieldCheck, TrendingUp, MapPin, Database, AlertTriangle, Table as TableIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  mockKpis, staffByCategory, staffByArea, 
  patientRegistrations, recentPatients, STAFF_CATEGORIES 
} from '@/src/lib/mockData';
import { generateUserAgreement } from '@/src/lib/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import NurseSurveyForm from './NurseSurveyForm';
import SurveyAnalysisTemplate from './SurveyAnalysisTemplate';
import { useDatabaseStatus } from '../hooks/useDatabaseStatus';

const COLORS = ['#38bdf8', '#8b5cf6', '#f472b6', '#10b981', '#fbbf24'];

export default function Dashboard() {
  const [agreement, setAgreement] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { status: dbStatus, lastCheck: dbLastCheck, error: dbError, refetch: refetchDb } = useDatabaseStatus();

  const handleGenerateAgreement = async (role: "nurse" | "patient") => {
    setIsGenerating(true);
    const text = await generateUserAgreement(role);
    setAgreement(text);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-8 font-sans text-slate-200 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="relative z-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-purple-400">
            Karachi Home Care
          </h1>
          <p className="text-slate-400 font-medium">Deterministic Execution Pipeline for Staffing & Patient Management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
            dbStatus === 'connected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            dbStatus === 'loading' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
            'bg-rose-500/10 border-rose-500/20 text-rose-400'
          } text-[10px] font-bold uppercase tracking-widest`}>
            <Database className={`h-3 w-3 ${dbStatus === 'loading' ? 'animate-pulse' : ''}`} />
            {dbStatus === 'connected' ? 'DB Connected' : dbStatus === 'loading' ? 'Connecting DB...' : 'DB Offline'}
          </div>
          <Button variant="outline" size="sm" onClick={() => refetchDb()} className="gap-2 border-sky-500/20 bg-sky-500/5 text-sky-300 hover:bg-sky-500/10">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-purple-500/20 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white gap-2 shadow-lg shadow-sky-500/20">
            <ShieldCheck className="h-4 w-4" /> Verify Staff
          </Button>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockKpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-sky-500/20 bg-slate-900/40 backdrop-blur-xl shadow-2xl border-t-sky-500/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{kpi.title}</CardTitle>
                <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                  {kpi.icon === "Users" && <Users className="h-4 w-4 text-sky-400" />}
                  {kpi.icon === "CheckCircle" && <CheckCircle className="h-4 w-4 text-sky-400" />}
                  {kpi.icon === "HeartPulse" && <HeartPulse className="h-4 w-4 text-sky-400" />}
                  {kpi.icon === "Clock" && <Clock className="h-4 w-4 text-sky-400" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white tracking-tight">{kpi.value}</div>
                <p className={`text-xs mt-1 ${kpi.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1`}>
                  <TrendingUp className={`h-3 w-3 ${kpi.change.startsWith('-') ? 'rotate-180' : ''}`} />
                  {kpi.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="relative z-10 space-y-4" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-slate-900/60 border-slate-800 backdrop-blur-md p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">Overview</TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">Staff Analytics</TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">Patient Care</TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">WhatsApp Analytics</TabsTrigger>
            <TabsTrigger value="survey" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">Nurse Survey</TabsTrigger>
            <TabsTrigger value="agreements" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">Legal & Trust</TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white transition-all">Database</TabsTrigger>
          </TabsList>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search records..." 
                className="pl-9 w-[200px] lg:w-[300px] bg-slate-900/40 border-sky-500/20 text-slate-200 focus:border-sky-500/50"
              />
            </div>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            <Card className="lg:col-span-4 border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-sky-400" />
                  Patient Registrations
                </CardTitle>
                <CardDescription className="text-slate-400">Daily growth trend for April 2026</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientRegistrations}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(str) => str.split('-')[2]}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #38bdf833', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#38bdf8" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0f172a' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-purple-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-400" />
                  Staff Distribution
                </CardTitle>
                <CardDescription className="text-slate-400">By professional category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={staffByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {staffByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #a78bfa33' }}
                    />
                    <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}/>
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-sky-400" />
                  Revenue Projection
                </CardTitle>
                <CardDescription className="text-slate-400">MTD vs Target (PKR)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-white">Rs. 2.4M</div>
                    <div className="text-xs text-slate-500">Current MTD</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-sky-400">80%</div>
                    <div className="text-xs text-slate-500">of Rs. 3.0M Target</div>
                  </div>
                </div>
                <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-sky-500/10 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Avg Case Value</div>
                    <div className="text-sm font-bold text-white">Rs. 45,000</div>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-purple-500/10 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Projected EOM</div>
                    <div className="text-sm font-bold text-white">Rs. 3.2M</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sky-400" />
                    District Demand Heatmap
                  </CardTitle>
                  <CardDescription className="text-slate-400">High-growth areas in Karachi</CardDescription>
                </div>
                <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30 animate-pulse">Live Data</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { area: 'Gulshan', demand: 'Critical', color: 'text-rose-400', bg: 'bg-rose-400/20', border: 'border-rose-400/20' },
                    { area: 'DHA', demand: 'High', color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/20' },
                    { area: 'Korangi', demand: 'Stable', color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/20' },
                    { area: 'Clifton', demand: 'High', color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/20' },
                    { area: 'Malir', demand: 'Growing', color: 'text-sky-400', bg: 'bg-sky-400/20', border: 'border-sky-400/20' },
                    { area: 'Nazimabad', demand: 'Stable', color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/20' },
                    { area: 'Saddar', demand: 'High', color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/20' },
                    { area: 'North K.', demand: 'Growing', color: 'text-sky-400', bg: 'bg-sky-400/20', border: 'border-sky-400/20' },
                  ].map((item) => (
                    <div key={item.area} className={`p-3 bg-slate-800/40 rounded-xl border ${item.border} hover:bg-slate-800/60 transition-all cursor-default group`}>
                      <div className="text-sm font-bold text-slate-200 group-hover:text-white">{item.area}</div>
                      <div className={`text-[9px] font-black mt-2 px-2 py-0.5 rounded-full inline-block uppercase tracking-tighter ${item.bg} ${item.color}`}>
                        {item.demand}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-white">Recent Patient Assignments</CardTitle>
                <CardDescription className="text-slate-400">Real-time status of home care cases</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10">View All</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-800">
                    <TableHead className="w-[200px] text-slate-500 font-bold uppercase text-[10px] tracking-widest">Patient Name</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Area</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Service Type</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right text-slate-500 font-bold uppercase text-[10px] tracking-widest">Assigned Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPatients.map((patient) => (
                    <TableRow key={patient.id} className="border-slate-800/50 hover:bg-sky-500/5 transition-colors">
                      <TableCell className="font-semibold text-slate-200">{patient.name}</TableCell>
                      <TableCell className="text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-sky-500" /> {patient.area}
                      </TableCell>
                      <TableCell className="text-slate-400">{patient.service}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className={
                          patient.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-amber-500/20 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                        }>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sky-400 font-bold">
                        {patient.staff === 'Unassigned' ? (
                          <span className="text-rose-400 flex items-center justify-end gap-1 font-bold">
                            <Clock className="h-3 w-3" /> Unassigned
                          </span>
                        ) : patient.staff}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-sky-400" />
                  Staff by Area (Karachi)
                </CardTitle>
                <CardDescription className="text-slate-400">Geographic distribution of available caregivers</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffByArea} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1e293b" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="area" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #38bdf833' }}
                    />
                    <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-purple-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-400" />
                  Staff Performance & Ratings
                </CardTitle>
                <CardDescription className="text-slate-400">Peer-reviewed ranking distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-black text-white tracking-tighter">4.82</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">Average Platform Rating</div>
                </div>
                <div className="w-full space-y-4">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-xs font-bold w-4 text-slate-500">{star}★</span>
                      <div className="flex-1 h-2.5 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/20">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${star === 5 ? 75 : star === 4 ? 20 : 5}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full ${star >= 4 ? 'bg-amber-400' : 'bg-slate-600'} shadow-[0_0_10px_rgba(251,191,36,0.3)]`} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 w-8 text-right">
                        {star === 5 ? '75%' : star === 4 ? '20%' : '5%'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-center text-slate-500 max-w-[280px] font-medium leading-relaxed">
                  Ratings are verified through post-service patient feedback calls and digital surveys.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md mt-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-400" />
                Weekly Coverage Heatmap
              </CardTitle>
              <CardDescription className="text-slate-400">Staff availability across shifts (24hr, 12hr, 8hr)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-2">
                <div className="h-8"></div>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">{day}</div>
                ))}
                {['24hr', '12hr (Day)', '12hr (Night)', '8hr'].map(shift => (
                  <React.Fragment key={shift}>
                    <div className="text-[9px] font-bold text-slate-400 flex items-center uppercase tracking-tighter">{shift}</div>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-10 rounded-lg border border-slate-800/50 ${
                          Math.random() > 0.3 ? 'bg-sky-500/10' : 'bg-slate-800/20'
                        } flex items-center justify-center group hover:border-sky-500/30 transition-all cursor-pointer`}
                      >
                        <div className={`h-2 w-2 rounded-full ${Math.random() > 0.3 ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'bg-slate-700'}`} />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-end gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-slate-800/20 border border-slate-700/30" /> Low Coverage</div>
                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded bg-sky-500/10 border border-sky-500/30" /> Optimal Coverage</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Broadcast Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white tracking-tighter">4,250</div>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-bold">
                  <TrendingUp className="h-3 w-3" /> +15% engagement
                </p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Verified Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white tracking-tighter">92%</div>
                <p className="text-xs text-slate-500 mt-1 font-medium">1,215 of 1,321 staff</p>
              </CardContent>
            </Card>
            <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white tracking-tighter">14m</div>
                <p className="text-xs text-emerald-400 mt-1 font-bold">-5m from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-sky-400" />
                Broadcast Effectiveness
              </CardTitle>
              <CardDescription className="text-slate-400">Engagement rates for staff recruitment broadcasts</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Nurses', sent: 450, read: 410, replied: 120 },
                  { name: 'Attendants', sent: 380, read: 320, replied: 85 },
                  { name: 'Doctors', sent: 51, read: 48, replied: 15 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #38bdf833' }} 
                  />
                  <Legend />
                  <Bar dataKey="sent" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="read" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="replied" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="survey" className="space-y-4">
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="bg-slate-900/60 border-sky-500/10 mb-4 p-1 backdrop-blur-md">
              <TabsTrigger value="form" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">Digital Form</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Strategic Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <NurseSurveyForm />
            </TabsContent>
            <TabsContent value="analysis">
              <SurveyAnalysisTemplate />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 border-sky-500/10 bg-slate-900/40 backdrop-blur-md h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-sky-400" /> Trust Infrastructure
                </CardTitle>
                <CardDescription className="text-slate-400">Generate and manage legal agreements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-sky-500/10 rounded-xl border border-sky-500/20 shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]">
                  <h4 className="text-sm font-bold text-sky-300 mb-1 uppercase tracking-tighter">DICE Fellowship Principles</h4>
                  <p className="text-[11px] text-sky-200/70 leading-relaxed font-medium">
                    Our agreements bridge the informal market gap by formalizing digital profiles with mandatory PNC license verification.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleGenerateAgreement("nurse")} 
                    disabled={isGenerating}
                    className="w-full bg-slate-800/60 text-slate-200 border border-sky-500/20 hover:bg-sky-500/10 hover:text-sky-300 gap-2 transition-all"
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                    Draft Nurse Agreement
                  </Button>
                  <Button 
                    onClick={() => handleGenerateAgreement("patient")} 
                    disabled={isGenerating}
                    className="w-full bg-slate-800/60 text-slate-200 border border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-300 gap-2 transition-all"
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <HeartPulse className="h-4 w-4" />}
                    Draft Patient Agreement
                  </Button>
                </div>

                <Separator className="bg-slate-800/50" />

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest text-[10px]">Verification Checklist</h4>
                  <div className="space-y-2">
                    {['PNC License Upload', 'CNIC Verification', 'Area Mapping', 'Price Setting'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <CheckCircle className="h-3 w-3 text-emerald-400" />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-sky-500/10 bg-slate-900/40 backdrop-blur-md min-h-[600px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Agreement Preview</CardTitle>
                  <CardDescription className="text-slate-400">AI-generated draft based on Karachi regulatory norms</CardDescription>
                </div>
                {agreement && (
                  <Button variant="outline" size="sm" className="gap-2 border-sky-500/20 text-sky-400 hover:bg-sky-500/10">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-xl border border-sky-500/10 p-6 bg-slate-950/40 backdrop-blur-sm">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full space-y-4 py-20"
                      >
                        <RefreshCw className="h-8 w-8 text-sky-400 animate-spin" />
                        <p className="text-slate-500 animate-pulse font-bold tracking-widest text-xs uppercase">Architecting Deterministic Pipeline...</p>
                      </motion.div>
                    ) : agreement ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-invert prose-slate max-w-none prose-headings:text-sky-400 prose-strong:text-white"
                      >
                        <ReactMarkdown>{agreement}</ReactMarkdown>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-600">
                        <FileText className="h-16 w-16 mb-4 opacity-5" />
                        <p className="font-bold tracking-widest text-xs uppercase">Select an agreement type to generate a draft</p>
                      </div>
                    )}
                  </AnimatePresence>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="border-sky-500/10 bg-slate-900/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-sky-400" />
                Supabase Connection Status
              </CardTitle>
              <CardDescription className="text-slate-400">Real-time monitoring of the PostgreSQL backend</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-xl border border-sky-500/10">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Status</div>
                  <div className={`text-xl font-bold flex items-center gap-2 ${
                    dbStatus === 'connected' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {dbStatus === 'connected' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                    {dbStatus.toUpperCase()}
                  </div>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-sky-500/10">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Last Sync</div>
                  <div className="text-xl font-bold text-white">{dbLastCheck || 'Never'}</div>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-sky-500/10">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Provider</div>
                  <div className="text-xl font-bold text-sky-400">Supabase (PostgreSQL)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 rounded-xl border border-emerald-500/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Anon Key</div>
                    <div className="text-sm font-bold text-white">Configured</div>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-purple-500/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Service Role Key</div>
                    <div className="text-sm font-bold text-white">Configured</div>
                  </div>
                  <ShieldCheck className="h-5 w-5 text-purple-400" />
                </div>
              </div>

              {dbError && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-rose-400">Connection Error</div>
                      <p className="text-xs text-rose-300/70 mt-1 font-mono">{dbError}</p>
                    </div>
                  </div>

                  {dbError.includes('ETIMEDOUT') && (
                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-amber-500/20 rounded-lg">
                          <ShieldCheck className="h-4 w-4 text-amber-400" />
                        </div>
                        <h4 className="text-sm font-bold text-amber-400">How to Fix: Timeout Error</h4>
                      </div>
                      <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                        <p>
                          Your Supabase project is likely using an <span className="text-amber-300 font-bold">IPv6-only</span> direct connection, or you are using the <span className="text-amber-300 font-bold">API URL</span> instead of the Database Host.
                        </p>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                          <p className="font-bold text-slate-300 mb-2">Required Steps:</p>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>Go to <span className="text-sky-400">Supabase Dashboard</span> &gt; <span className="text-sky-400">Settings</span> &gt; <span className="text-sky-400">Database</span></li>
                            <li>Find the <span className="text-white font-bold">Connection Pooler</span> section</li>
                            <li>Ensure Mode is set to <span className="text-emerald-400">Transaction</span></li>
                            <li>Copy the connection string (it uses port <span className="text-emerald-400 font-bold">6543</span>)</li>
                            <li>Update your <span className="text-white font-bold">DATABASE_URL</span> secret in AI Studio</li>
                          </ol>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">
                          Note: The direct connection (port 5432) will not work in this environment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {dbStatus === 'connected' && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Database className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-400">Database Ready</div>
                      <div className="text-[10px] text-slate-400">Connection established and verified.</div>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/db-init', { method: 'POST' });
                        const data = await res.json();
                        if (data.status === 'ok') alert('Database tables initialized!');
                        else alert('Error: ' + data.message);
                      } catch (e) {
                        alert('Failed to initialize database');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition-colors border border-emerald-500/20"
                  >
                    Initialize Tables
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest text-[10px]">Database Architecture</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-sky-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-sky-400">
                      <TableIcon className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Staff Table</span>
                    </div>
                    <p className="text-xs text-slate-400">Stores 1,157+ records including CNIC, verification status, and ratings.</p>
                  </div>
                  <div className="p-4 bg-slate-950/40 rounded-xl border border-purple-500/5 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400">
                      <TableIcon className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Patients Table</span>
                    </div>
                    <p className="text-xs text-slate-400">Manages active cases, service types, and staff assignments.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <footer className="relative z-10 mt-12 pt-8 border-t border-sky-500/10 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer">
            <MessageSquare className="h-4 w-4 text-sky-500" /> WhatsApp Support
          </span>
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" /> System Status: Optimal
          </span>
        </div>
        <div className="text-slate-600">
          © 2026 Karachi Home Care • Formalizing the Future of Care
        </div>
      </footer>
    </div>
  );
}
