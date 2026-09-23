import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiPlus, FiBox, FiDroplet, FiHeart } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const mockResources = [
  { id: 1, name: 'Medical Kits', category: 'Medical', quantity: 450, max: 1000, status: 'Good', icon: FiHeart, color: '#a855f7' },
  { id: 2, name: 'Bottled Water', category: 'Food/Water', quantity: 120, max: 2000, status: 'Low', icon: FiDroplet, color: '#00d4ff' },
  { id: 3, name: 'Food Rations', category: 'Food/Water', quantity: 800, max: 1500, status: 'Good', icon: FiPackage, color: '#22c55e' },
  { id: 4, name: 'Tents', category: 'Shelter', quantity: 45, max: 100, status: 'Low', icon: FiBox, color: '#ff3b3b' },
];

const chartData = mockResources.map(r => ({ name: r.name, value: r.quantity, max: r.max }));
const COLORS = ['#a855f7', '#00d4ff', '#22c55e', '#ff3b3b'];

const ResourceManagement = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FiPackage className="text-primary" /> Logistics & Resources
          </h1>
          <p className="text-gray-400 mt-1">Manage critical supplies across all command centers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-white text-dark-400 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.3)]"
        >
          <FiPlus /> Add Resource
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-white mb-2">Current Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockResources.map((res, i) => {
              const Icon = res.icon;
              const percent = (res.quantity / res.max) * 100;
              return (
                <motion.div 
                  key={res.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5 rounded-2xl border border-white/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-dark-300" style={{ color: res.color }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{res.name}</h4>
                        <p className="text-xs text-gray-400">{res.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${res.status === 'Low' ? 'border-accent text-accent bg-accent/10' : 'border-emerald-500 text-emerald-400 bg-emerald-500/10'}`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white font-mono">{res.quantity} / {res.max}</span>
                    <span className="text-gray-400">{Math.round(percent)}%</span>
                  </div>
                  <div className="w-full bg-dark-300 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${percent}%`, backgroundColor: res.color, boxShadow: `0 0 10px ${res.color}` }}
                    ></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Analytics & Alerts */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Stock Levels Overview</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" hide />
                  <YAxis dataKey="name" type="category" stroke="#ffffff50" width={80} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)' }} cursor={{fill: '#ffffff05'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl border-accent/20">
            <h3 className="text-lg font-bold text-accent mb-4">Critical Shortages</h3>
            <div className="space-y-3">
              {mockResources.filter(r => r.status === 'Low').map(res => (
                <div key={res.id} className="bg-accent/10 border border-accent/30 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-white text-sm">{res.name}</span>
                  <button className="text-xs bg-accent text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">Request Resupply</button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
