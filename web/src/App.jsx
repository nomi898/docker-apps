import { useEffect, useState } from 'react';

function useApi(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setData)
      .catch(() => setError('not reachable'));
  }, [url]);

  return { data, error };
}

function List({ title, url, field }) {
  const { data, error } = useApi(url);

  return (
    <section>
      <h2>{title}</h2>

      {error && <p>API {error}</p>}

      {data && (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item[field]}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function App() {
  return (
    <main style={{ padding: '2rem', textAlign: 'left' }}>
      <h1>Docker Bootcamp Dashboard</h1>

      <p>Served by Nginx from a multi-stage Docker build.</p>

      <List title="Notes (Node.js)" url="/api/notes" field="text" />

      <List title="Tasks (FastAPI)" url="/api/tasks" field="title" />
    </main>
  );
}