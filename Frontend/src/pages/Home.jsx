import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  // Load from localStorage (starts empty if nothing saved)
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const categories = ["Food", "Transport", "Shopping", "Other"];

  const handleAdd = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const amount = parseFloat(form.amount);

    if (!name) return alert("Please enter an expense name.");
    if (!amount || amount <= 0) return alert("Enter a valid amount > 0.");
    if (!form.date) return alert("Please select a date.");

    const newExpense = {
      id: Date.now(),
      name,
      amount: Number(amount.toFixed(2)),
      category: form.category,
      date: form.date,
    };

    setExpenses((prev) => [...prev, newExpense]);
    setForm({ name: "", amount: "", category: "Food", date: "" });
  };

  const startEdit = (exp) => {
    setEditingId(exp.id);
    setEditForm({
      name: exp.name,
      amount: String(exp.amount),
      category: exp.category,
      date: exp.date,
    });
  };

  const saveEdit = (id) => {
    const name = editForm.name.trim();
    const amount = parseFloat(editForm.amount);

    if (!name) return alert("Please enter an expense name.");
    if (!amount || amount <= 0) return alert("Enter a valid amount > 0.");
    if (!editForm.date) return alert("Please select a date.");

    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              name,
              amount: Number(amount.toFixed(2)),
              category: editForm.category,
              date: editForm.date,
            }
          : e
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const downloadCSV = () => {
    if (expenses.length === 0) return alert("No expenses to download.");
    const header = ["Expense Name", "Amount", "Category", "Date"];
    const rows = expenses.map((e) => [
      e.name.replace(/"/g, '""'),
      e.amount.toFixed(2),
      e.category,
      e.date,
    ]);
    const csv =
      [header, ...rows]
        .map((r) => r.map((cell) => `"${cell}"`).join(","))
        .join("\n") + "\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>Expense Tracker</h1>
        <div className="header-actions">
          <button className="download-btn" onClick={downloadCSV}>
            Download Expenses
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <form className="expense-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Expense Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <button type="submit" className="add-btn">
          Add Expense
        </button>
      </form>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-row">
                No expenses yet — add your first one above.
              </td>
            </tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp.id}>
                {editingId === exp.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) =>
                          setEditForm({ ...editForm, date: e.target.value })
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="save-btn"
                        type="button"
                        onClick={() => saveEdit(exp.id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancel-btn"
                        type="button"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{exp.name}</td>
                    <td>${exp.amount.toFixed(2)}</td>
                    <td>{exp.category}</td>
                    <td>{exp.date}</td>
                    <td>
                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() => startEdit(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() => handleDelete(exp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="total">
        <strong>Total: </strong>${total.toFixed(2)}
      </div>
    </div>
  );
}
