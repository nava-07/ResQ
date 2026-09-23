import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiFilter, FiTrash2, FiShield, FiUserCheck, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getAllUsers, updateUserRole, deleteUser } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers(roleFilter !== 'all' ? { role: roleFilter } : {});
      setUsers(data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, { role: newRole });
      toast.success('Clearance Level Updated');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update clearance');
    }
  };

  const handleToggleVerified = async (id, currentVerified) => {
    try {
      await updateUserRole(id, { isVerified: !currentVerified });
      toast.success(!currentVerified ? 'Personnel Verified' : 'Personnel Unverified');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update verification status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to revoke and delete ${name}'s account?`)) {
      return;
    }
    try {
      await deleteUser(id);
      toast.success(`Account for ${name} removed`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-neon-purple/15 text-neon-purple border border-neon-purple/40">ADMIN</span>;
      case 'rescue_team':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-accent/15 text-accent border border-accent/40">RESCUE TEAM</span>;
      case 'volunteer':
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/40">VOLUNTEER</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-primary/15 text-primary border border-primary/40">CITIZEN</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FiUsers className="text-neon-purple" /> Personnel & User Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Omni-clearance oversight for citizen accounts, volunteer rosters, rescue units, and administrators.
          </p>
        </div>
        
        <button 
          onClick={fetchUsers}
          className="px-4 py-2.5 bg-dark-300 hover:bg-dark-200 border border-white/10 text-white rounded-xl text-sm flex items-center gap-2 transition-all"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh Log
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search personnel by name or email identity..."
            className="w-full bg-dark-300/80 border border-white/10 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon-purple"
          />
        </div>

        {/* Role filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 uppercase mr-1 flex items-center gap-1"><FiFilter /> Role:</span>
          {['all', 'citizen', 'volunteer', 'rescue_team', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${
                roleFilter === r
                  ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-dark-300 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Personnel Table */}
      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-dark-300/80 text-xs uppercase text-gray-400 font-mono border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Personnel</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Clearance Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  return (
                    <motion.tr 
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-dark-200 border border-white/10 flex items-center justify-center font-bold text-white">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              {u.name}
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">YOU</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                        {u.phone || 'No phone'}
                      </td>

                      {/* Role Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          disabled={isSelf}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-dark-300 border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-neon-purple cursor-pointer"
                        >
                          <option value="citizen">Citizen</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="rescue_team">Rescue Team</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>

                      {/* Verified Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleVerified(u._id, u.isVerified)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all ${
                            u.isVerified 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isVerified ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                          {u.isVerified ? 'Verified' : 'Unverified'}
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!isSelf ? (
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            title="Delete User"
                            className="p-2 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-lg transition-all border border-accent/20 cursor-pointer"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 font-mono">Owner</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <FiAlertCircle className="mx-auto text-3xl mb-2 opacity-40" />
                    No registered personnel matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
