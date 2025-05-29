import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const EditorDashboard = () => {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState({ title: '', body: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const contentCollection = await getDocs(collection(db, 'content'));
        setContent(contentCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setIsLoading(false);
      } catch (error) {
        console.error('EditorDashboard: Content fetch error:', error);
        toast.error('Error al cargar contenido');
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const addContent = async (e) => {
    e.preventDefault();
    if (!newContent.title || !newContent.body) {
      toast.error('Título y contenido son requeridos');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'content'), {
        ...newContent,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setContent([...content, { id: docRef.id, ...newContent, createdBy: user.uid }]);
      setNewContent({ title: '', body: '' });
      toast.success('Contenido añadido');
    } catch (error) {
      console.error('EditorDashboard: Content add error:', error);
      toast.error('Error al añadir contenido');
    }
  };

  const deleteContent = async (id) => {
    try {
      await deleteDoc(doc(db, 'content', id));
      setContent(content.filter(c => c.id !== id));
      toast.success('Contenido eliminado');
    } catch (error) {
      console.error('EditorDashboard: Content delete error:', error);
      toast.error('Error al eliminar contenido');
    }
  };

  if (isLoading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-8">Dashboard de Editor - IoT Solutions</h1>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <svg
              className="w-10 h-10 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Bienvenido, {user.name || user.username || 'Editor'}!
              </p>
              <p className="text-gray-600 dark:text-gray-400">Rol: {user.role}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Añadir Contenido</h2>
            <motion.form
              onSubmit={addContent}
              className="space-y-6 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              aria-label="Formulario para añadir contenido"
            >
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Contenido
                </label>
                <textarea
                  id="body"
                  value={newContent.body}
                  onChange={(e) => setNewContent({ ...newContent, body: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 transition-all duration-200"
                  rows="5"
                  required
                  aria-required="true"
                />
              </div>
              <motion.button
                type="submit"
                className="px-6 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Añadir contenido"
              >
                Añadir
              </motion.button>
            </motion.form>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Contenido Existente</h2>
            {content.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No hay contenido disponible.</p>
            ) : (
              <div className="space-y-4">
                {content.map((item) => (
                  <motion.div
                    key={item.id}
                    className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{item.body}</p>
                    <motion.button
                      onClick={() => deleteContent(item.id)}
                      className="mt-3 text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Eliminar contenido ${item.title}`}
                    >
                      Eliminar
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Acciones</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li>
                <Link
                  to="/user/profile"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Editar perfil"
                >
                  Editar Perfil
                </Link>
              </li>
              <li>
                <Link
                  to="/editor/content"
                  className="block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  aria-label="Gestionar contenido"
                >
                  Gestionar Contenido
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default EditorDashboard;