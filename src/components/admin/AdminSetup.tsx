import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * Component to help first-time setup of admin users
 * This should only be used during initial setup
 */
export const AdminSetup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const setupAdmin = async () => {
    if (!email) {
      setError('Wprowadź adres email');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // First check if user exists
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw new Error('Nie można sprawdzić użytkowników: ' + authError.message);
      }

      const user = authUsers.users.find(u => u.email === email);
      
      if (!user) {
        setError('Użytkownik z tym emailem nie istnieje. Najpierw utwórz konto.');
        return;
      }

      // Add admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (roleError) {
        if (roleError.code === '23505') { // Unique constraint violation
          setMessage('Ten użytkownik już ma rolę admina');
        } else {
          throw roleError;
        }
      } else {
        setMessage('Pomyślnie nadano uprawnienia administratora');
      }

    } catch (err: any) {
      setError('Błąd: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Konfiguracja Administratora</h2>
      </div>
      
      <p className="text-gray-600 mb-4">
        Wprowadź email użytkownika, któremu chcesz nadać uprawnienia administratora.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email administratora
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
          />
        </div>

        <button
          onClick={setupAdmin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Przetwarzanie...' : 'Nadaj uprawnienia administratora'}
        </button>

        {message && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700">{message}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Ważne:</strong> Ten komponent służy tylko do konfiguracji początkowej. 
          Po nadaniu uprawnień administratora usuń ten komponent ze względów bezpieczeństwa.
        </p>
      </div>
    </div>
  );
};