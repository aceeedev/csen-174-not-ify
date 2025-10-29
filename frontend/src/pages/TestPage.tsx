import React, { useState } from 'react';
import axios from 'axios';

interface TestData {
  name: string;
  age: number;
  city: string;
}

const MyComponent: React.FC = () => {
  const [data, setData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<TestData>('http://localhost:5000/api/data');
      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchPost} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch Post'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>{data.name}</h2>
          <p>Age: {data.age}</p>
          <p>City: {data.city}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;