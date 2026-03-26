import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/api';
import { Settings as SettingsIcon, Save, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    site_name: 'EduPortal Max',
    site_email: '', site_phone: '',
    admission_open: 'true',
    max_applications: '5',
    maintenance_mode: 'false'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { getSettings().then(r => { setSettings(prev => ({ ...prev, ...r.data.data })); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess('');
    try { await updateSettings(settings); setSuccess('Settings saved!'); }
    catch (err) { alert('Error saving settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><SettingsIcon className="h-6 w-6 text-blue-600" />Settings</h1><p className="text-gray-500">Configure system settings</p></div>

      {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-2"><CheckCircle className="h-5 w-5" />{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">General Settings</h2>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label><input value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} className="input-field" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label><input value={settings.site_email} onChange={e => setSettings({...settings, site_email: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label><input value={settings.site_phone} onChange={e => setSettings({...settings, site_phone: e.target.value})} className="input-field" /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Admission Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Admission Status</label>
              <select value={settings.admission_open} onChange={e => setSettings({...settings, admission_open: e.target.value})} className="input-field">
                <option value="true">Open</option><option value="false">Closed</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Applications Per Student</label><input type="number" value={settings.max_applications} onChange={e => setSettings({...settings, max_applications: e.target.value})} className="input-field" /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">System</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Mode</label>
            <select value={settings.maintenance_mode} onChange={e => setSettings({...settings, maintenance_mode: e.target.value})} className="input-field">
              <option value="false">Disabled</option><option value="true">Enabled</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="h-4 w-4" />Save Settings</>}
        </button>
      </form>
    </div>
  );
}
