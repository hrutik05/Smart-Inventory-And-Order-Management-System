import { useState } from 'react';
import { UserCog, ShieldCheck } from 'lucide-react';
import { users } from '../../data/mockData';
import { useAuth, ROLE_PERMISSIONS } from '../../context/AuthContext';
import { PageHeader, Modal } from '../../components/common/CommonComponents';
import toast from 'react-hot-toast';

const ROLE_TONES = {
  ADMIN: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
  MANAGER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  STAFF: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
};

export default function UserManagement() {
  const { isAdmin } = useAuth();
  const [roleModal, setRoleModal] = useState(null);
  const [nextRole, setNextRole] = useState('STAFF');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldCheck size={36} className="text-slate-400 mb-3" />
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin access required</p>
      </div>
    );
  }

  const changeRole = () => {
    toast.success(`${roleModal.fullName}'s role set to ${nextRole}`);
    setRoleModal(null);
  };

  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage team members and their access roles" />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50 dark:bg-navy-800/50 border-b border-slate-200 dark:border-navy-800">
              <tr>
                <th className="table-th">User</th>
                <th className="table-th">Email</th>
                <th className="table-th">Role</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${u.avatarColor} text-xs font-bold text-white`}>
                        {u.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="table-td">{u.email}</td>
                  <td className="table-td">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_TONES[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="table-td text-right">
                    <button
                      className="btn-secondary !px-3 !py-1.5 text-xs"
                      onClick={() => { setRoleModal(u); setNextRole(u.role); }}
                    >
                      <UserCog size={14} /> Change Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-4 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => (
            <div key={role} className="rounded-lg border border-slate-200 dark:border-navy-800 p-4">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_TONES[role]}`}>{role}</span>
              <p className="mt-3 text-xs text-slate-500">Page access:</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 capitalize">{perms.pages.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={!!roleModal}
        onClose={() => setRoleModal(null)}
        title={`Change Role — ${roleModal?.fullName || ''}`}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setRoleModal(null)}>Cancel</button>
            <button className="btn-primary" onClick={changeRole}>Save</button>
          </>
        }
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Role</label>
          <select className="input" value={nextRole} onChange={(e) => setNextRole(e.target.value)}>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="STAFF">STAFF</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
