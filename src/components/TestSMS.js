import React, { useState } from 'react';

const TestSMS = () => {
  const [phone, setPhone] = useState('+84899450801');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use relative path if you set "proxy" in package.json to "http://localhost:4000"
  const BASE = 'http://localhost:4001'; // '' => uses CRA proxy; or set to 'http://localhost:4000' to call backend directly

  const postJson = async (path, body) => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      const contentType = res.headers.get('content-type') || '';

      // If server returns JSON, parse it. Otherwise show text for debugging.
      let data;
      if (contentType.includes('application/json')) {
        data = JSON.parse(text);
      } else {
        // got HTML or plain text — likely frontend index.html or error page
        throw new Error(`Non-JSON response (content-type: ${contentType}). Preview: ${text.slice(0,300)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || JSON.stringify(data));
      }

      return data;
    } catch (err) {
      // return error object for UI
      return { __error: true, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const sendCode = async () => {
    const result = await postJson('/api/send-code', { to: phone });
    setStatus(result);
  };

  const verifyCode = async () => {
    const result = await postJson('/api/verify-code', { to: phone, code });
    setStatus(result);
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h5>Gửi mã xác thực và kiểm tra</h5>

      <label>Số điện thoại</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={sendCode} disabled={loading}>
          {loading ? 'Đang...' : 'Gửi mã'}
        </button>
      </div>

      <label>Mã xác thực (6 chữ số)</label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={verifyCode} disabled={loading}>
          {loading ? 'Đang...' : 'Xác minh mã'}
        </button>
      </div>

      <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
};

export default TestSMS;
