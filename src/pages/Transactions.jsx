import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Transactions() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("household_id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        return;
      }

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("household_id", profile.household_id)
        .order("expense_date", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setExpenses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete expense");
      console.error(error);
      return;
    }

    loadExpenses();
  }

  // =======================
  // GROUP BY MONTH (NO TIMEZONE ISSUES)
  // =======================
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const [year, month] = expense.expense_date.split("-");

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthKey = `${monthNames[parseInt(month, 10) - 1]} ${year}`;

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }

    groups[monthKey].push(expense);

    return groups;
  }, {});

  const groupedEntries = Object.entries(groupedExpenses);

  if (loading) {
    return (
      <div className="p-4">
        <h2>Transactions</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Transactions
      </h2>

      {expenses.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <p>No expenses found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedEntries.map(([month, monthExpenses]) => {
            const monthTotal = monthExpenses.reduce(
              (sum, expense) =>
                sum + Number(expense.amount),
              0
            );

            return (
              <div key={month}>
                <div className="bg-gray-100 p-4 rounded shadow mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                      {month}
                    </h3>

                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ${monthTotal.toFixed(2)}
                      </div>

                      <div className="text-sm text-gray-500">
                        {monthExpenses.length} item
                        {monthExpenses.length !== 1
                          ? "s"
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {monthExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-white p-4 rounded shadow"
                    >
                      <h3 className="font-bold text-lg">
                        {expense.category}
                      </h3>

                      <p className="text-2xl font-semibold text-green-600">
                        ${Number(expense.amount).toFixed(2)}
                      </p>

                      <div className="mt-3 space-y-1">
                        <p>
                          <strong>Date:</strong>{" "}
                          {expense.expense_date}
                        </p>

                        <p>
                          <strong>Paid By:</strong>{" "}
                          {expense.paid_by_name}
                        </p>

                        <p>
                          <strong>Split Type:</strong>{" "}
                          {expense.split_type}
                        </p>

                        {expense.details && (
                          <p>
                            <strong>Details:</strong>{" "}
                            {expense.details}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/edit-expense/${expense.id}`
                            )
                          }
                          className="px-3 py-2 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(expense.id)
                          }
                          className="px-3 py-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
