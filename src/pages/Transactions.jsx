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
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
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
                <div className="border-b-2 border-gray-300 pb-3 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold">
                        {month}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {monthExpenses.length} item
                        {monthExpenses.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <div className="text-xl font-bold text-green-600">
                      ${monthTotal.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {monthExpenses.map((expense) => {
                    const title =
                      expense.details?.trim() ||
                      expense.category;

                    return (
                      <div
                        key={expense.id}
                        className="bg-white rounded-lg shadow p-3"
                      >
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 break-words">
                              {title}
                            </div>

                            <div className="text-sm text-gray-500 mt-1">
                              {expense.paid_by_name}
                              {" • "}
                              {expense.expense_date}
                            </div>

                            <div className="text-xs text-gray-400 mt-1">
                              {expense.category}
                            </div>
                          </div>

                          <div className="ml-4 text-lg font-bold text-green-600 whitespace-nowrap">
                            $
                            {Number(
                              expense.amount
                            ).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/edit-expense/${expense.id}`
                              )
                            }
                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                expense.id
                              )
                            }
                            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
