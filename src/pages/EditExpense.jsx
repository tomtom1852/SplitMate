import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function EditExpense() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [expenseDate, setExpenseDate] = useState("");
    const [amount, setAmount] = useState("");
    const [categories, setCategories] = useState([]);

    const [categoryType, setCategoryType] =
        useState("Bills");

    const [categoryId, setCategoryId] =
        useState("");
    const filteredCategories =
        categories.filter(
            c =>
                c.category_type === categoryType
        );
    const [details, setDetails] = useState("");
    const [splitType, setSplitType] = useState("equal");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadExpense();
    }, []);

    async function loadExpense() {

        const { data: categoryData } =
            await supabase
                .from("categories")
                .select("*")
                .order("name");

        setCategories(categoryData || []);

        const { data: expense, error } =
            await supabase
                .from("expenses")
                .select("*")
                .eq("id", id)
                .single();

        if (error) {
            console.error(error);
            return;
        }

        setExpenseDate(
            expense.expense_date
        );

        setAmount(
            expense.amount
        );

        setDetails(
            expense.details || ""
        );

        setSplitType(
            expense.split_type || "equal"
        );

        setCategoryId(
            expense.category_id
        );

        const selectedCategory =
            categoryData?.find(
                c =>
                    c.id ===
                    expense.category_id
            );

        if (selectedCategory) {
            setCategoryType(
                selectedCategory.category_type
            );
        }

        setLoading(false);
    }

    async function handleUpdate(e) {
        e.preventDefault();

        try {
            setSaving(true);

            const { error } = await supabase
                .from("expenses")
                .update({
                    expense_date: expenseDate,
                    amount: Number(amount),
                    category_id: categoryId,
                    details,
                    split_type: splitType,
                })
                .eq("id", id);

            if (error) {
                console.error(error);
                alert("Failed to update expense.");
                return;
            }

            alert("Expense updated successfully.");

            navigate("/transactions");
        } catch (err) {
            console.error(err);
            alert("Unexpected error updating expense.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div>
                <h2>Edit Expense</h2>
                <p>Loading expense...</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Edit Expense</h2>

            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: "12px" }}>
                    <label>Date</label>
                    <br />
                    <input
                        type="date"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Amount</label>
                    <br />
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Category</label>
                    <br />
                    
                    <select
                        value={categoryType}
                        onChange={(e) =>
                            setCategoryType(
                                e.target.value
                            )
                        }
                    >
                        <option value="Bills">
                            Bills
                        </option>

                        <option value="Expense">
                            Expense
                        </option>
                    </select>

                    <label>
                        Category
                    </label>

                    <br />

                    <select
                        value={categoryId}
                        onChange={(e) =>
                            setCategoryId(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            Select
                        </option>

                        {filteredCategories.map(cat => (

                            <option
                                key={cat.id}
                                value={cat.id}
                            >
                                {cat.category_type}
                                {" - "}
                                {cat.name}
                            </option>

                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Split Type</label>
                    <br />
                    <select
                        value={splitType}
                        onChange={(e) => setSplitType(e.target.value)}
                    >
                        <option value="equal">Equal</option>
                        <option value="percentage">Percentage</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>Details</label>
                    <br />
                    <textarea
                        rows="3"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Updating..." : "Update Expense"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/transactions")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}