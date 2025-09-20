import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const FormVerify = ({ onVerify }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 11) {
      return 'Số điện thoại không hợp lệ (9-11 chữ số).';
    }
    if (!/^\d{4,8}$/.test(code)) {
      return 'Mã truy cập phải là 4–8 chữ số.';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    if (typeof onVerify === 'function') {
      onVerify({ phone: phone.replace(/\D/g, ''), code });
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3" controlId="fvPhone">
        <Form.Label>Số điện thoại</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
        />
        <Form.Text className="text-muted">Chỉ nhập số, có thể kèm mã vùng.</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="fvCode">
        <Form.Label>Mã truy cập</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập mã truy cập"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={8}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="primary" type="submit">Xác nhận</Button>
      </div>
    </Form>
  );
};

export default FormVerify;