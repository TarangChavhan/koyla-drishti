import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { Users, UserPlus, Shield, KeyRound, Check, X, Search } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'Dr. Anand Verma, IAS',
      email: 'admin@coal.gov.in',
      role: 'admin',
      designation: 'Joint Secretary (Coal Governance)',
      department: 'Ministry of Coal, Shastri Bhawan',
      phone: '+91 11 2338 4567',
      status: 'Active'
    },
    {
      id: 'USR-002',
      name: 'Rajesh Sharma',
      email: 'inspector@dgms.gov.in',
      role: 'inspector',
      designation: 'Senior Inspector of Mines Safety',
      department: 'Directorate General of Mines Safety (DGMS)',
      phone: '+91 326 220 4891',
      status: 'Active'
    },
    {
      id: 'USR-003',
      name: 'P. K. Mukherjee',
      email: 'mine@bccl.gov.in',
      role: 'mine',
      designation: 'Chief General Manager (Safety & Environment)',
      department: 'Bharat Coking Coal Limited (BCCL)',
      mineId: 'KD-101',
      mineName: 'Jharia Coalfield Block IV',
      phone: '+91 326 257 1289',
      status: 'Active'
    },
    {
      id: 'USR-004',
      name: 'Sunil Verma',
      email: 'sverma@dgms.gov.in',
      role: 'inspector',
      designation: 'Environmental Compliance Officer',
      department: 'DGMS Regional Inspectorate, Ranchi',
      phone: '+91 651 249 1034',
      status: 'Active'
    },
    {
      id: 'USR-005',
      name: 'R. K. Agarwal',
      email: 'ccl.mine@coal.gov.in',
      role: 'mine',
      designation: 'General Manager (Mines)',
      department: 'Central Coalfields Limited (CCL)',
      mineId: 'KD-104',
      mineName: 'Amrapali Open Cast Mine',
      phone: '+91 651 236 0001',
      status: 'Inactive'
    }
  ]);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('inspector');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
          showToast(`Account status for ${u.name} set to ${newStatus}`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const resetUserPassword = (u: User) => {
    showToast(`Temporary security credentials dispatched to ${u.email}`, 'success');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-00${users.length + 1}`,
      name: newName,
      email: newEmail,
      role: newRole,
      designation: newDesignation || 'Designated Officer',
      department: newDepartment || 'Government of India',
      status: 'Active'
    };

    setUsers((prev) => [...prev, newUser]);
    showToast(`User ${newUser.name} provisioned with role ${newRole.toUpperCase()}`, 'success');
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Government User Directory & Access Control (RBAC)
          </h1>
          <p className="text-xs text-[#728594]">
            Manage authorized administrative, inspection, and mine operator credentials.
          </p>
        </div>
        <button
          onClick={() => setIsAddUserOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white flex items-center gap-1.5 shadow transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Provision New User
        </button>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                <th className="py-3 px-3 font-semibold">User ID</th>
                <th className="py-3 px-3 font-semibold">Official Name</th>
                <th className="py-3 px-3 font-semibold">Assigned Role</th>
                <th className="py-3 px-3 font-semibold">Department / Mine Authority</th>
                <th className="py-3 px-3 font-semibold">Account Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e9ee]">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#f9fbfc] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{u.id}</td>
                  <td className="py-3 px-3 font-semibold text-[#152737]">
                    <div>{u.name}</div>
                    <small className="text-[10px] text-[#728594] font-normal">{u.email}</small>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-[#edf5fb] text-[#126fba]'
                          : u.role === 'inspector'
                          ? 'bg-[#ebf8f5] text-[#159e89]'
                          : 'bg-[#fef7eb] text-[#d48b17]'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#526a79]">
                    <div>{u.department}</div>
                    <small className="text-[10px] text-[#728594]">{u.designation}</small>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={u.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => resetUserPassword(u)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#526a79] font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      title="Reset Security Password"
                    >
                      <KeyRound className="w-3 h-3" /> Reset
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                        u.status === 'Active'
                          ? 'bg-rose-50 text-[#df4d52] hover:bg-rose-100'
                          : 'bg-emerald-50 text-[#18a873] hover:bg-emerald-100'
                      }`}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Provision Authorized User"
        subtitle="Ministry of Coal Security Directory"
        maxWidth="md"
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#516777] mb-1">Full Official Name *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Smt. Kavita Roy"
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#516777] mb-1">Government Email Address *</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="name@gov.in or name@mine.gov.in"
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#516777] mb-1">Assigned Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              >
                <option value="admin">Government Admin</option>
                <option value="inspector">DGMS Inspector</option>
                <option value="mine">Mine Authority</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Designation</label>
              <input
                type="text"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                placeholder="e.g. Deputy Director (Safety)"
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#516777] mb-1">Department / Mine Authority</label>
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              placeholder="e.g. DGMS Dhanbad Region or ECL Rajmahal"
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e9ee]">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-4 py-2 font-semibold text-[#516777] bg-slate-100 rounded-lg hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow"
            >
              Issue Credentials
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
