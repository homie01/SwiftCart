import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function ProfilePage() {
  const { user, updateProfile } = useStore();
  const [form, setForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    contact: user?.contact || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await updateProfile(form);
      setMessage(response.message || 'Profile updated successfully.');
    } catch (error) {
      setMessage(error.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="split-layout">
      <section className="content-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Account</span>
            <h1>Profile page</h1>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.entries(form).map(([key, value]) => (
              <label className="field" key={key}>
                <span>{key}</span>
                <input
                  className="text-input"
                  type={key === 'email' ? 'email' : 'text'}
                  value={value}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>

          {message ? <p className="status-text">{message}</p> : null}

          <button className="primary-button wide-button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>

      <aside className="summary-panel">
        <div className="section-kicker">Saved addresses</div>
        <h2>{user?.address?.length || 0} address entries</h2>
        <div className="address-stack">
          {(user?.address || []).map((address) => (
            <div className="address-card" key={address._id || address.street}>
              <strong>{address.type}</strong>
              <span>{address.street}</span>
              <span>
                {address.area}, {address.city}
              </span>
              <span>
                {address.state}, {address.country} - {address.pincode}
              </span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
