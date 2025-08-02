'use client';
import { useEffect, useState } from 'react';

export default function Checklist({ email }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`/api/checklist?email=${email}`)
      .then((res) => res.json())
      .then((data) => setItems(data.length ? data : defaultChecklist));
  }, []);

  const defaultChecklist = [
    { label: 'Personal Info Submitted', completed: false },
    { label: 'Passport Uploaded', completed: false },
    { label: 'Transcripts', completed: false },
    { label: 'Recommendation Letter', completed: false },
  ];

  const toggleItem = (index) => {
    const updated = [...items];
    updated[index].completed = !updated[index].completed;
    setItems(updated);

    // Persist to DB
    fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, checklist: updated }),
    });
  };

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '8px' }}>
          <label>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(i)}
            />{' '}
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  );
}