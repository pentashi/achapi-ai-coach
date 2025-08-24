import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { toast } from 'react-toastify';

const emptyEntry = {
  date: '',
  weight: '',
  squat: '',
  bench: '',
  deadlift: '',
};

export default function ProgressTracker() {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEntry);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setEntries([]);
      setLoading(false);
      return;
    }
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'users', userId, 'progress'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setEntries(data);
        setLoading(false);
      },
      () => {
        toast.error('Failed to fetch progress data.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.date) return toast.error('Date is required') || false;
    if (!form.weight || isNaN(form.weight) || form.weight <= 0)
      return toast.error('Valid weight is required') || false;
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(db, 'users', userId, 'progress'), {
        date: form.date,
        weight: Number(form.weight),
        squat: Number(form.squat) || 0,
        bench: Number(form.bench) || 0,
        deadlift: Number(form.deadlift) || 0,
        createdAt: new Date(),
      });
      toast.success('Progress entry added!');
      setForm(emptyEntry);
    } catch (error) {
      toast.error('Failed to add progress entry.');
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      date: entry.date,
      weight: entry.weight.toString(),
      squat: entry.squat.toString(),
      bench: entry.bench.toString(),
      deadlift: entry.deadlift.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyEntry);
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'users', userId, 'progress', editingId);
      await updateDoc(docRef, {
        date: form.date,
        weight: Number(form.weight),
        squat: Number(form.squat) || 0,
        bench: Number(form.bench) || 0,
        deadlift: Number(form.deadlift) || 0,
      });
      toast.success('Progress entry updated!');
      cancelEdit();
    } catch (error) {
      toast.error('Failed to update progress entry.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'users', userId, 'progress', id);
      await deleteDoc(docRef);
      toast.success('Progress entry deleted!');
      if (editingId === id) cancelEdit();
    } catch (error) {
      toast.error('Failed to delete progress entry.');
    }
  };

  const formatDateForInput = (d) => {
    if (!d) return '';
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0, 10);
    const dateObj = new Date(d);
    return dateObj.toISOString().slice(0, 10);
  };

  if (loading)
    return (
      <section className="text-center text-cyan-400 mt-20 text-xl font-semibold">
        Loading progress...
      </section>
    );

  return (
    <section className="container bg-dark text-light p-5 rounded-4 shadow-lg">
      <h2 className="text-info mb-4 fw-bold">📈 Your Progress Journey</h2>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editingId ? handleUpdate() : handleAdd();
        }}
        className="row g-4 mb-5"
      >
        {['date', 'weight', 'squat', 'bench', 'deadlift'].map((field, idx) => (
          <div className="col-sm-6 col-md-4" key={field}>
            <label className="form-label text-info fw-semibold" htmlFor={field}>
              {field === 'date'
                ? 'Date'
                : field.charAt(0).toUpperCase() + field.slice(1) + (field !== 'weight' ? ' (kg)' : ' (kg)')}
            </label>
            <input
              type={field === 'date' ? 'date' : 'number'}
              className="form-control bg-black text-light border-info"
              id={field}
              value={form[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              required={field === 'date' || field === 'weight'}
              min={field !== 'date' ? 0 : undefined}
            />
          </div>
        ))}

        <div className="col-12 d-flex justify-content-end gap-3">
          {editingId && (
            <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
          <button type="submit" className={`btn ${editingId ? 'btn-info' : 'btn-success'}`}>
            {editingId ? 'Save Changes' : 'Add Entry'}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle">
          <thead className="table-info text-dark">
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>Squat</th>
              <th>Bench</th>
              <th>Deadlift</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(({ id, date, weight, squat, bench, deadlift }) => (
              <tr key={id} className={editingId === id ? 'table-active' : ''}>
                <td>{formatDateForInput(date)}</td>
                <td>{weight} kg</td>
                <td>{squat} kg</td>
                <td>{bench} kg</td>
                <td>{deadlift} kg</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => startEdit({ id, date, weight, squat, bench, deadlift })}
                      disabled={editingId !== null}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(id)}
                      disabled={editingId !== null}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
