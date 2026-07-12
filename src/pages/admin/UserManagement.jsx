import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import Loader from '../../components/common/Loader.jsx';
import { userApi } from '../../api/userApi';
import { getInitials } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const ROLE_OPTIONS = Object.values(ROLES).map((r) => ({ value: r, label: r }));

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', { search }],
    queryFn: () => userApi.getAllUsers({ search }).then((r) => r.data),
  });

  const changeRole = async (id, role) => {
    try {
      await userApi.updateUserRole(id, role);
      toast.success('Role updated.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    } catch {
      toast.error('Could not update role.');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await userApi.toggleUserStatus(id);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    } catch {
      toast.error('Could not update status.');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">User Management</h1>
        <p className="mt-1 text-sm text-ink-400">Manage roles and access across the platform.</p>
      </div>

      <div className="max-w-sm">
        <Input icon={Search} placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="overflow-x-auto p-0">
        {isLoading ? (
          <Loader />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase text-ink-400 dark:border-ink-800">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.content || []).map((u) => (
                <tr key={u.id} className="border-b border-ink-100 last:border-0 dark:border-ink-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pulse-600 text-xs font-semibold text-white">
                        {getInitials(u.name)}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-400">{u.email}</td>
                  <td className="px-4 py-3 w-40">
                    <Select
                      options={ROLE_OPTIONS}
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(u.id)}>
                      <Badge
                        className={
                          u.active
                            ? 'bg-ok-500/10 text-ok-600'
                            : 'bg-danger-500/10 text-danger-500'
                        }
                      >
                        {u.active ? 'Active' : 'Suspended'}
                      </Badge>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
