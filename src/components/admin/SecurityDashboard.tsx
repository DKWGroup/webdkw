import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, User, Activity, Lock } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

interface SecurityEvent {
  id: string;
  event_type: string;
  ip_address: string;
  user_agent: string | null;
  email: string | null;
  timestamp: string;
  details: any;
}

interface SecurityStats {
  totalEvents: number;
  failedLogins: number;
  suspiciousActivity: number;
  uniqueIPs: number;
}

export const SecurityDashboard: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    failedLogins: 0,
    suspiciousActivity: 0,
    uniqueIPs: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('24h');

  useEffect(() => {
    fetchSecurityData();
  }, [timeFilter]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Calculate time filter
      const now = new Date();
      let fromDate = new Date();
      
      switch (timeFilter) {
        case '1h':
          fromDate.setHours(now.getHours() - 1);
          break;
        case '24h':
          fromDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          fromDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          fromDate.setDate(now.getDate() - 30);
          break;
        default:
          fromDate.setDate(now.getDate() - 1);
      }

      // Fetch security events
      const { data: events, error } = await supabase
        .from('security_logs')
        .select('*')
        .gte('timestamp', fromDate.toISOString())
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching security events:', error);
        return;
      }

      setSecurityEvents(events || []);

      // Calculate stats
      const failedLogins = events?.filter(e => e.event_type === 'login_failure').length || 0;
      const suspiciousActivity = events?.filter(e => e.event_type === 'suspicious_activity').length || 0;
      const uniqueIPs = new Set(events?.map(e => e.ip_address)).size;

      setStats({
        totalEvents: events?.length || 0,
        failedLogins,
        suspiciousActivity,
        uniqueIPs
      });

    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'login_failure':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'logout':
        return <Lock className="h-4 w-4 text-blue-500" />;
      case 'suspicious_activity':
        return <Eye className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels: { [key: string]: string } = {
      'login_success': 'Udane logowanie',
      'login_failure': 'Nieudane logowanie',
      'logout': 'Wylogowanie',
      'password_reset': 'Reset hasła',
      'blocked_ip': 'Zablokowane IP',
      'suspicious_activity': 'Podejrzana aktywność',
      'session_timeout': 'Timeout sesji'
    };
    return labels[eventType] || eventType;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Łączne zdarzenia</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nieudane logowania</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.failedLogins}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Podejrzana aktywność</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.suspiciousActivity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unikalne IP</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.uniqueIPs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
            Dziennik zdarzeń bezpieczeństwa
          </h3>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="1h">Ostatnia godzina</option>
              <option value="24h">Ostatnie 24h</option>
              <option value="7d">Ostatnie 7 dni</option>
              <option value="30d">Ostatnie 30 dni</option>
            </select>
            
            <button
              onClick={fetchSecurityData}
              className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Odśwież
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zdarzenie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adres IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Czas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Brak zdarzeń bezpieczeństwa w wybranym okresie
                  </td>
                </tr>
              ) : (
                securityEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getEventIcon(event.event_type)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getEventTypeLabel(event.event_type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.ip_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString('pl-PL')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;