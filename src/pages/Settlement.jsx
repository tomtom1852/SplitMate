import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function Settlement() {

    const { user } = useAuth();

    const [loading, setLoading] =
        useState(true);

    const [selectedMonth, setSelectedMonth] =
        useState(
            new Date()
                .toISOString()
                .slice(0, 7)
        );

    const [paybackMessage, setPaybackMessage] =
        useState("");

    const [memberTotals, setMemberTotals] =
        useState([]);

    const [categoryTotals, setCategoryTotals] =
        useState([]);

    const [totalSpending, setTotalSpending] =
        useState(0);

    useEffect(() => {
        if (user) {
            loadSettlement();
        }
    }, [user, selectedMonth]);

    async function loadSettlement() {

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
            new Date(startDate);

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
                    *,
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

        const paidMap = {};

        const categoryMap = {};

        expenses.forEach(expense => {

            const amount =
                Number(expense.amount) || 0;

            total += amount;

            // Member Totals

            const payer =
                expense.paid_by_name ||
                "Unknown";

            if (!paidMap[payer]) {
                paidMap[payer] = 0;
            }

            paidMap[payer] += amount;

            // Category Totals

            const categoryName =
                expense.categories?.name ||
                "Unknown";

            if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = 0;
            }

            categoryMap[categoryName] += amount;
        });

        const memberList =
            Object.entries(paidMap)
                .map(([name, amount]) => ({
                    name,
                    amount
                }))
                .sort(
                    (a, b) =>
                        b.amount - a.amount
                );

        const breakdown =
            Object.entries(categoryMap)
                .map(([name, amount]) => ({
                    name,
                    amount,
                    percent:
                        total > 0
                            ? (
                                amount /
                                total *
                                100
                            ).toFixed(1)
                            : 0
                }))
                .sort(
                    (a, b) =>
                        b.amount - a.amount
                );

        let message =
            "No settlement required";

        if (memberList.length === 2) {

            const person1 =
                memberList[0];

            const person2 =
                memberList[1];

            const share =
                total / 2;

            const person1Diff =
                person1.amount - share;

            if (person1Diff > 0) {

                message =
                    `${person2.name} owes ${person1.name} $${person1Diff.toFixed(2)}`;

            } else if (person1Diff < 0) {

                message =
                    `${person1.name} owes ${person2.name} $${Math.abs(person1Diff).toFixed(2)}`;
            }
        }

        setTotalSpending(total);
        setMemberTotals(memberList);
        setCategoryTotals(breakdown);
        setPaybackMessage(message);

        setLoading(false);
    }

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    return (
        <div>

            <h1>
                Settlement
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

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding:
                        "15px",
                    marginBottom:
                        "20px"
                }}
            >
                <h2>
                    Payback
                </h2>

                {memberTotals.map(member => (

                    <div
                        key={member.name}
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            marginBottom:
                                "8px"
                        }}
                    >
                        <span>
                            {member.name}
                        </span>

                        <strong>
                            $
                            {member.amount.toFixed(
                                2
                            )}
                        </strong>

                    </div>

                ))}

                <hr />

                <div
                    style={{
                        marginTop:
                            "12px",
                        fontWeight:
                            "bold",
                        color:
                            "green"
                    }}
                >
                    {paybackMessage}
                </div>
            </div>

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding:
                        "15px"
                }}
            >
                <h2>
                    Spending Breakdown
                </h2>

                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "space-between",
                        fontWeight:
                            "bold",
                        marginBottom:
                            "10px"
                    }}
                >
                    <span>
                        Total Spending
                    </span>

                    <span>
                        $
                        {totalSpending.toFixed(
                            2
                        )}
                    </span>
                </div>

                <hr />

                {categoryTotals.map(item => (

                    <div
                        key={item.name}
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            marginTop:
                                "8px"
                        }}
                    >
                        <span>
                            {item.name}
                        </span>

                        <span>
                            $
                            {item.amount.toFixed(
                                2
                            )}
                            {" "}
                            (
                            {item.percent}
                            %)
                        </span>
                    </div>

                ))}
            </div>

        </div>
    );
}