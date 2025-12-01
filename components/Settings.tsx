import React, { useState } from 'react';
import { Save, ShieldCheck, Cpu, Bell, Key } from 'lucide-react';
import Input from './Input';
import Button from './Button';
import { AppSettings } from '../types';

interface SettingsProps {
  currentSettings: AppSettings;
  onSave: (s: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentSettings, onSave }) => {
  const [modelName, setModelName] = useState(currentSettings.modelName);
  const [enableNotifications, setEnableNotifications] = useState(currentSettings.enableNotifications);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave({
      ...currentSettings,
      modelName,
      enableNotifications
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChangeApiKey = async () => {
    try {
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
        await (window as any).aistudio.openSelectKey();
        // Visual feedback could be added here, but the dialog handles the interaction
      } else {
        alert("API Key selection is not available in this environment.");
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pt-4">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">System Configuration</h2>
        <p className="text-zinc-400">Manage connection parameters and prediction engine.</p>
      </div>

      {/* API Key Status Section */}
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-zinc-800 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-zinc-900 rounded-xl text-orange-500 border border-zinc-700">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">API Connection</h3>
            <p className="text-sm text-zinc-500">Secure connection status to Gemini AI.</p>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <span className="text-zinc-400 text-sm">Status:</span>
             <span className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Active / Env Var Loaded
             </span>
           </div>
           
           <Button 
             variant="secondary" 
             onClick={handleChangeApiKey}
             className="text-xs py-2 px-4 h-auto"
           >
             <Key size={14} className="mr-2" />
             Change API Key
           </Button>
        </div>
        <p className="text-xs text-zinc-600 mt-3 ml-1">
          * API Key is securely loaded from environment variables. Use the button above to update via the secure platform dialog.
        </p>
      </div>

      {/* Model Settings */}
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-zinc-800 shadow-lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-zinc-900 rounded-xl text-orange-500 border border-zinc-700">
            <Cpu size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Model Configuration</h3>
            <p className="text-sm text-zinc-500">Select specific Gemini models for prediction.</p>
          </div>
        </div>

        <div className="space-y-4">
          <Input 
            label="Model Name" 
            placeholder="gemini-2.5-flash" 
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
          <div className="flex justify-end">
            <span className="text-xs text-zinc-500">Default: gemini-2.5-flash</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-zinc-800 shadow-lg flex items-center justify-between">
         <div className="flex items-center gap-4">
           <div className="p-3 bg-zinc-900 rounded-xl text-orange-500 border border-zinc-700">
            <Bell size={24} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-white">High Confidence Alerts</h3>
             <p className="text-sm text-zinc-500">Notify when confidence > 80%</p>
           </div>
         </div>
         
         <button 
           onClick={() => setEnableNotifications(!enableNotifications)}
           className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${enableNotifications ? 'bg-orange-500' : 'bg-zinc-700'}`}
         >
           <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enableNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
         </button>
      </div>

      <div className="pt-4">
        <Button onClick={handleSave} className="w-full h-14 text-lg">
          {isSaved ? <span className="flex items-center gap-2"><Save size={20}/> Settings Saved!</span> : 'Save Configuration'}
        </Button>
      </div>

    </div>
  );
};

export default Settings;