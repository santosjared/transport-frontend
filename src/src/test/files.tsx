// pages/index.tsx
import { useState } from 'react';
import axios from 'axios';

interface FormData {
  username: string;
  name: string;
  file: File | null;
}

export default function Files() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    name: '',
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append('username', formData.username);
    formPayload.append('name', formData.name);
    formData.file && formPayload.append('file', formData.file);
    console.log(formData)

    try {
      const response = await axios.post('http://localhost:3001/bus', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error al enviar datos:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          File:
          <input type="file" name="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
