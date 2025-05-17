import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const AdminRoles = () => {
  const { user, checkPermissionAccess } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !checkPermissionAccess(user, ['manage:users'])) {
      navigate('/unauthorized');
      return;
    }
    const fetchUsers = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'users'));
        setUsers(usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      } catch (error) {
        console.error('AdminRoles: User fetch error:', error);
        toast.error('Error al cargar usuarios');
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [user, navigate, checkPermissionAccess]);

  const updateUserRole = async (userId, newRole, newPermissions) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole, permissions: newPermissions });
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole, permissions: newPermissions } : u)));
      toast.success('Rol actualizado');
    } catch (error) {
      console.error('AdminRoles: Role update error:', error);
      toast.error('Error al actualizar rol');
    }
  };

  if (isLoading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Gestión de Roles - IoT Solutions</h1>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Usuario</th>
                  <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Rol</th>
                  <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Permisos</th>
                  <th className="py-3 px-4 text-gray-800 dark:text-gray-200">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.role}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.permissions?.join(', ') || 'Ninguno'}</td>
                    <td className="py-3 px-4">
                      <select
                        onChange={(e) => {
                          const role = e.target.value;
                          const permissions = {
                            user: ['view:profile', 'view:devices', 'control:own_devices', 'manage:schedules', 'view:analytics'],
                            editor: ['view:profile', 'view:devices', 'manage:content'],
                            admin: ['manage:users', 'manage:devices', 'manage:content'],
                          }[role] || [];
                          updateUserRole(user.id, role, permissions);
                        }}
                        defaultValue={user.role}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-all duration-200"
                        aria-label={`Cambiar rol de ${user.email}`}
                      >
                        <option value="user">Usuario</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AdminRoles;