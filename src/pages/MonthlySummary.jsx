import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function MonthlySummary() {
    const { user } = useAuth();

    const [loading, setLoading] =
        useState(true);

    const [selectedMonth, setSelectedMonth] =
        useState(
            new Date()
                .toISOString()
                .slice(0, 7)
        );

    const [totalSpending, setTotalSpending] =
        useState(0);

    const [totalBills, setTotalBills] =
        useState(0);

    const [totalExpenses, setTotalExpenses] =
        useState(0);

    const [categoryTotals, setCategoryTotals] =
        useState([]);

    useEffect(() => {
        if (user) {
            loadSummary();
        }
    }, [user, selectedMonth]);

    async function loadSummary() {

        setLoading(true);

        const { data: profile } =
            await supabase
                .from("profiles")
                .select("household_id")
                .eq("id", user.id)
                .single();

        if (!profile) {
            setLoading(false);
            return;
        }

        const startDate =
            `${selectedMonth}-01`;

        const nextMonth =
            new Date(`${selectedMonth}-01`);

        nextMonth.setMonth(
            nextMonth.getMonth() + 1
        );

        const endDate =
            nextMonth
                .toISOString()
                .split("T")[0];

        const { data: expenses, error } =
            await supabase
                .from("expenses")
                .select(`
                    amount,
                    expense_date,
                    category_id,
                    categories (
                        id,
                        name,
                        category_type
                    )
                `)
                .eq(
                    "household_id",
                    profile.household_id
                )
                .gte(
                    "expense_date",
                    startDate
                )
                .lt(
                    "expense_date",
                    endDate
                );




        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        let total = 0;
        let bills = 0;
        let expenseTotal = 0;

        const categoryMap = {};

        expenses.forEach(expense => {

            const amount =
                Number(expense.amount) || 0;

            total += amount;

            const category =
                expense.categories;

            if (category) {

                if (
                    category.category_type ===
                    "Bills"
                ) {
                    bills += amount;
                } else {
                    expenseTotal += amount;
                }

                if (
                    !categoryMap[
                    category.name
                    ]
                ) {
                    categoryMap[
                        category.name
                    ] = 0;
                }

                categoryMap[
                    category.name
                ] += amount;
            }
        });

        const breakdown =
            Object.entries(categoryMap)
                .map(([name, total]) => ({
                    name,
                    total
                }))
                .sort(
                    (a, b) =>
                        b.total - a.total
                );

        setTotalSpending(total);
        setTotalBills(bills);
        setTotalExpenses(
            expenseTotal
        );

        setCategoryTotals(
            breakdown
        );

        setLoading(false);
    }

    return (
        <div>

            <h1>
                Monthly Summary
            </h1>

            <br />

            <label>
                Month
            </label>

            <br />

            <input
                type="month"
                value={selectedMonth}
                onChange={(e) =>
                    setSelectedMonth(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            {loading ? (
                <p>
                    Loading...
                </p>
            ) : (
                <>
                    <div
                        style={{
                            border:
                                "1px solid #ccc",
                            padding:
                                "12px",
                            marginBottom:
                                "12px"
                        }}
                    >
                        <h3>
                            Total Spending
                        </h3>

                        <h2>
                            $
                            {totalSpending.toFixed(
                                2
                            )}
                        </h2>
                    </div>

                    <div
                        style={{
                            border:
                                "1px solid #ccc",
                            padding:
                                "12px",
                            marginBottom:
                                "12px"
                        }}
                    >
                        <h3>
                            Bills
                        </h3>

                        <h2>
                            $
                            {totalBills.toFixed(
                                2
                            )}
                        </h2>
                    </div>

                    <div
                        style={{
                            border:
                                "1px solid #ccc",
                            padding:
                                "12px",
                            marginBottom:
                                "20px"
                        }}
                    >
                        <h3>
                            Expenses
                        </h3>

                        <h2>
                            $
                            {totalExpenses.toFixed(
                                2
                            )}
                        </h2>
                    </div>

                    <h2>
                        Category Breakdown
                    </h2>

                    {categoryTotals.length ===
                        0 ? (
                        <p>
                            No expenses found.
                        </p>
                    ) : (
                        categoryTotals.map(
                            item => (
                                <div
                                    key={
                                        item.name
                                    }
                                    style={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        borderBottom:
                                            "1px solid #ddd",
                                        padding:
                                            "8px 0"
                                    }}
                                >
                                    <span>
                                        {
                                            item.name
                                        }
                                    </span>

                                    <strong>
                                        $
                                        {item.total.toFixed(
                                            2
                                        )}
                                    </strong>
                                </div>
                            )
                        )
                    )}
                </>
            )}
        </div>
    );
}