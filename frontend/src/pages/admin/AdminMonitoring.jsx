import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, ShieldOff, Ban, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { adminService } from '../../services/adminService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (raw) => {
  if (!raw) return '—';
  return new Date(raw).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

const ACTION_CONFIG = {
  login:               { label: 'Connexion',        cls: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  register:            { label: 'Inscription',       cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  video_submit:        { label: 'Soumission vidéo',  cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  admin_video_status:  { label: 'Statut vidéo',      cls: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
  admin_user_create:   { label: 'Créat. utilisateur',cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  admin_user_delete:   { label: 'Suppr. utilisateur',cls: 'bg-red-500/15 text-red-400 border border-red-500/30' },
  admin_invite_sent:   { label: 'Invitation envoyée',cls: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' },
};

const ActionBadge = ({ action = '' }) => {
  const cfg = ACTION_CONFIG[action] || { label: action || '—', cls: 'bg-gray-500/15 text-gray-400 border border-gray-500/30' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const Mono = ({ children, dim }) => (
  <span className={`font-mono text-xs ${dim ? 'text-gray-500' : 'text-gray-300'}`}>
    {children || '—'}
  </span>
);

// ─── Empty / Loading / Error states ──────────────────────────────────────────

const Loading = () => (
  <div className="flex items-center justify-center py-16 text-gray-500 gap-2 text-sm">
    <RefreshCw size={16} className="animate-spin" />
    Chargement…
  </div>
);

const Empty = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-600 gap-2">
    <ShieldOff size={32} />
    <span className="text-sm">{label}</span>
  </div>
);

const ErrorMsg = ({ msg, onRetry }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
    <span>{msg}</span>
    {onRetry && (
      <button onClick={onRetry} className="flex items-center gap-1 text-xs hover:text-red-300 transition-colors">
        <RefreshCw size={12} /> Réessayer
      </button>
    )}
  </div>
);

// ─── Tab: Journal d'activité ──────────────────────────────────────────────────

const LogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getSecurityLogs();
      setLogs(Array.isArray(data) ? data : (data?.logs ?? []));
    } catch (err) {
      console.error('[ADMIN MONITORING] Erreur logs:', err.message);
      setError(err.message || 'Impossible de charger les logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {logs.length} action{logs.length !== 1 ? 's' : ''} enregistrée{logs.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white border border-white/10 transition-all"
        >
          <RefreshCw size={12} /> Actualiser
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={fetchLogs} />}

      {loading ? <Loading /> : logs.length === 0 ? (
        <Empty label="Aucune action enregistrée" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                {['Date', 'Action', 'Utilisateur', 'Détail', 'IP'].map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={log.id ?? i}
                  className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Mono>{formatDate(log.created_at)}</Mono>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    {log.user_email ? (
                      <span className="text-xs text-gray-300 truncate block" title={log.user_email}>
                        {log.user_email}
                      </span>
                    ) : (
                      <Mono dim>Anonyme</Mono>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="block text-xs text-gray-400 truncate" title={log.details}>
                      {log.details || (log.entity && log.entity_id ? `${log.entity} #${log.entity_id}` : '—')}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Mono dim>{log.ip || '—'}</Mono>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Tab: Blacklist ───────────────────────────────────────────────────────────

const BlacklistTab = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unbanning, setUnbanning] = useState(null);

  // Ban manuel
  const [banForm, setBanForm] = useState({ ip: '', fingerprint: '', reason: '' });
  const [banLoading, setBanLoading] = useState(false);
  const [banError, setBanError] = useState('');
  const [banSuccess, setBanSuccess] = useState('');

  const fetchBlacklist = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getBlacklist();
      setEntries(Array.isArray(data) ? data : (data?.entries ?? data?.blacklist ?? []));
    } catch (err) {
      console.error('[ADMIN MONITORING] Erreur blacklist:', err.message);
      setError(err.message || 'Impossible de charger la blacklist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlacklist(); }, [fetchBlacklist]);

  const handleUnban = async (entry) => {
    setUnbanning(entry.id);
    try {
      await adminService.unbanEntry(entry.id);
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    } catch (err) {
      console.error('[ADMIN MONITORING] Erreur unban:', err.message);
      setError(err.message || 'Erreur lors du débannissement');
    } finally {
      setUnbanning(null);
    }
  };

  const handleBanSubmit = async (e) => {
    e.preventDefault();
    if (!banForm.ip && !banForm.fingerprint) {
      setBanError('Renseignez au moins une IP ou un Fingerprint');
      return;
    }
    setBanLoading(true);
    setBanError('');
    setBanSuccess('');
    try {
      await adminService.banManual(banForm);
      setBanSuccess('Entrée bannie avec succès');
      setBanForm({ ip: '', fingerprint: '', reason: '' });
      fetchBlacklist();
    } catch (err) {
      console.error('[ADMIN MONITORING] Erreur ban manuel:', err.message);
      setBanError(err.message || 'Erreur lors du bannissement');
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Bannissement manuel ─────────────────────────────────────── */}
      <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
          <Ban size={14} className="text-rose-400" />
          Bannir manuellement
        </h3>

        <form onSubmit={handleBanSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              IP
            </label>
            <input
              type="text"
              value={banForm.ip}
              onChange={(e) => setBanForm((p) => ({ ...p, ip: e.target.value }))}
              placeholder="192.168.1.1"
              className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Fingerprint
            </label>
            <input
              type="text"
              value={banForm.fingerprint}
              onChange={(e) => setBanForm((p) => ({ ...p, fingerprint: e.target.value }))}
              placeholder="abc123def456…"
              className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Raison
            </label>
            <input
              type="text"
              value={banForm.reason}
              onChange={(e) => setBanForm((p) => ({ ...p, reason: e.target.value }))}
              placeholder="Spam, attaque SQLi…"
              className="w-full bg-[#0d0d14] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20 transition-all"
            />
          </div>
          <div className="sm:col-span-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={banLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Ban size={13} />
              {banLoading ? 'Bannissement…' : 'Bannir'}
            </button>
            {banError && <span className="text-rose-400 text-xs">{banError}</span>}
            {banSuccess && <span className="text-green-400 text-xs">{banSuccess}</span>}
          </div>
        </form>
      </div>

      {/* ── Tableau blacklist ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {entries.length} entrée{entries.length !== 1 ? 's' : ''} bannie{entries.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={fetchBlacklist}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white border border-white/10 transition-all"
        >
          <RefreshCw size={12} /> Actualiser
        </button>
      </div>

      {error && <ErrorMsg msg={error} onRetry={fetchBlacklist} />}

      {loading ? <Loading /> : entries.length === 0 ? (
        <Empty label="Aucune entrée dans la blacklist" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                {['IP', 'Fingerprint', 'Raison', 'Banni jusqu\'à', 'Action'].map((col) => (
                  <th key={col} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.id ?? i}
                  className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Mono>{entry.ip}</Mono>
                  </td>
                  <td className="px-4 py-3 max-w-[130px]">
                    <Mono dim>
                      {entry.fingerprint ? entry.fingerprint.slice(0, 12) + '…' : '—'}
                    </Mono>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    <span className="text-xs text-gray-400 truncate block" title={entry.reason}>
                      {entry.reason || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Mono>
                      {entry.banned_until
                        ? formatDate(entry.banned_until)
                        : <span className="text-red-400">Permanent</span>
                      }
                    </Mono>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleUnban(entry)}
                      disabled={unbanning === entry.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ShieldOff size={12} />
                      {unbanning === entry.id ? '…' : 'Débannir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'logs',      label: "Journal d'activité", icon: <Activity size={15} /> },
  { id: 'blacklist', label: 'Liste noire',          icon: <Ban size={15} /> },
];

export default function AdminMonitoring() {
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldAlert size={20} className="text-rose-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Monitoring</h1>
          <p className="text-xs text-gray-500">WAF — Surveillance des attaques & liste noire</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07] w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'logs'      && <LogsTab />}
        {activeTab === 'blacklist' && <BlacklistTab />}
      </div>

    </div>
  );
}
