import React, { useState, useEffect } from 'react';
import { useAuth } from '../Autenticacion/AuthProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Layout from '../../hocs/layouts/layout';
import Spinner from '../Spinner';
import { toast } from 'react-toastify';

const EditorContent = () => {
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
        console.error('EditorContent: Content fetch error:', error);
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
      console.error('EditorContent: Content add error:', error);
      toast.error('Error al añadir contenido');
    }
  };

  const deleteContent = async (id) => {
    try {
      await deleteDoc(doc(db, 'content', id));
      setContent(content.filter(c => c.id !== id));
      toast.success('Contenido eliminado');
    } catch (error) {
      console.error('EditorContent: Content delete error:', error);
      toast.error('Error al eliminar contenido');
    }
  };

  if (isLoading || !user) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Gestión de Contenido</h1>
        <p className="text-gray-700 dark:text-gray-200">
          Bienvenido, {user.name || user.username || 'Editor'}!
        </p>
        <p className="text-gray-700 dark:text-gray-200">Rol: {user.role}</p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Añadir Contenido</h2>
          <form onSubmit={addContent} className="space-y-4" aria-label="Formulario para añadir contenido">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-200"
                rows="5"
                required
                aria-required="true"
              />
            </div>
            <button type="submit" className="btn-primary" aria-label="Añadir contenido">
              Añadir
            </button>
          </form>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Contenido Existente</h2>
          {content.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No hay contenido disponible.</p>
          ) : (
            <div className="space-y-4 mt-4">
              {content.map(item => (
                <div key={item.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-primary">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.body}</p>
                  <button
                    onClick={() => deleteContent(item.id)}
                    className="mt-2 text-red-600 hover:underline"
                    aria-label={`Eliminar contenido ${item.title}`}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary">Acciones</h2>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/user/profile" className="text-primary hover:underline" aria-label="Editar perfil">
                Editar Perfil
              </Link>
            </li>
            <li>
              <Link to="/editor/dashboard" className="text-primary hover:underline" aria-label="Volver al dashboard">
                Volver al Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default EditorContent;