import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertCircle, History } from 'lucide-react';
import { getPrediction } from '../services/geminiService';
import { INITIAL_DATA, DEFAULT_MODEL } from '../constants';
import Button from './Button';
import Input from './Input';
import { MultiplierData, AppSettings } from '../types';

interface DashboardProps {
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ settings }) => {
  const [data, setData] = useState<MultiplierData[]>(INITIAL_DATA);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ value: number, confidence: string, reasoning: string } | null>(null);
  
  // Ref for auto-scrolling log if needed, though we use chart mostly
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const handleAddData = () => {
    const num = parseFloat(inputValue);
    if (!isNaN(num) && num > 0) {
      setData(prev => {
        const newId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
        // Keep only last 20 points for cleaner chart
        const newData = [...prev, { id: newId, value: num }];
        return newData.slice(-20); 
      });
      setInputValue('');
      // Clear prediction on new input to encourage fresh prediction
      setPrediction(null);
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    const historyValues = data.map(d => d.value);
    
    // Call Gemini
    const result = await getPrediction(historyValues, settings.modelName || DEFAULT_MODEL);
    
    setPrediction({
      value: result.nextMultiplier,
      confidence: result.confidence,
      reasoning: result.reasoning
    });
    setLoading(false);
  };

  const getConfidenceColor = (conf: string) => {
    switch (conf.toLowerCase()) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in pb-20 md:pb-0">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1E1E1E] p-4 rounded-xl border border-zinc-800 shadow-lg">
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
            <Activity size={16} /> Latest
          </div>
          <div className="text-2xl font-black text-white">
            {data.length > 0 ? data[data.length - 1].value.toFixed(2) : '0.00'}x
          </div>
        </div>
        <div className="bg-[#1E1E1E] p-4 rounded-xl border border-zinc-800 shadow-lg">
           <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
            <TrendingUp size={16} /> Trend
          </div>
          <div className="text-2xl font-black text-orange-500">
             {data.length > 5 
               ? (data[data.length-1].value > data[data.length-5].value ? 'UP' : 'DOWN') 
               : 'STABLE'}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-[#1E1E1E] rounded-2xl p-4 shadow-2xl border border-zinc-800 relative overflow-hidden h-64 md:h-80" ref={chartContainerRef}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600 z-10"></div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-bold text-lg text-zinc-200">Multiplier Trend</h3>
          <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded">Live Data</span>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF6A00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="id" hide />
            <YAxis stroke="#666" domain={[0, 'auto']} tickFormatter={(val) => `${val}x`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', borderRadius: '8px' }}
              itemStyle={{ color: '#FF6A00' }}
              formatter={(value: number) => [`${value}x`, 'Multiplier']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#FF6A00" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Input & Action Area */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Manual Input */}
        <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <h3 className="font-bold text-zinc-300 mb-4 flex items-center gap-2">
            <History size={18} className="text-orange-500"/> Data Entry
          </h3>
          <div className="flex gap-3">
            <Input 
              type="number" 
              placeholder="e.g. 2.50" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddData()}
            />
            <Button onClick={handleAddData} variant="secondary">Add</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {data.slice().reverse().slice(0, 8).map((d) => (
              <span key={d.id} className="bg-zinc-900 text-zinc-400 text-xs px-2 py-1 rounded border border-zinc-800">
                {d.value.toFixed(2)}x
              </span>
            ))}
          </div>
        </div>

        {/* Prediction Output */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-2xl border border-zinc-700 shadow-lg relative overflow-hidden">
           {/* Decorative glow */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
           
           <h3 className="font-bold text-zinc-300 mb-4 flex items-center gap-2">
             <span className="text-orange-500">✨</span> Oracle Prediction
           </h3>

           <div className="text-center py-2">
             {!prediction && !loading && (
               <div className="text-zinc-500 text-sm">Waiting for input data...</div>
             )}
             
             {prediction && !loading && (
               <div className="animate-in fade-in zoom-in duration-300">
                 <div className="text-sm text-zinc-400 uppercase tracking-widest mb-1">Target</div>
                 <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 drop-shadow-sm mb-2">
                   {prediction.value.toFixed(2)}x
                 </div>
                 <div className={`text-sm font-bold flex items-center justify-center gap-2 ${getConfidenceColor(prediction.confidence)}`}>
                   <AlertCircle size={14} /> {prediction.confidence} Confidence
                 </div>
                 <p className="mt-4 text-xs text-zinc-400 italic border-t border-zinc-700 pt-3">
                   "{prediction.reasoning}"
                 </p>
               </div>
             )}
           </div>

           <div className="mt-6">
             <Button onClick={handlePredict} isLoading={loading} className="w-full">
               {loading ? 'Analyzing Patterns...' : 'Predict Next'}
             </Button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
