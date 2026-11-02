import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function Expenses() {

    const { user } = useAuth();

    const [profile, setProfile] =
        useState(null);

    const [categories, setCategories] =
        useState([]);

    const [amount, setAmount] =
        useState("");

    const [expenseDate, setExpenseDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [categoryType, setCategoryType] =
        useState("Bills");

    const filteredCategories =
        categories.filter(
            c =>
                c.category_type === categoryType
        );
    const [details, setDetails] =
        useState("");


    const [categoryId, setCategoryId] =
        useState("");

    const [splitType, setSplitType] =
        useState("equal");



    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {

        const { data: profileData } =
            await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

        setProfile(profileData);

        const { data: categoryData } =
            await supabase
                .from("categories")
                .select("*")
                .order("name");

        setCategories(categoryData || []);
    }

    async function saveExpense() {

        if (!categoryId) {
            alert("Please select a category");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        const category =
            categories.find(
                c => c.id === categoryId
            );

        const { error } =
            await supabase
                .from("expenses")
                .insert({

                    household_id:
                        profile.household_id,

                    expense_date:
                        expenseDate,

                    amount:
                        Number(amount),

                    category_id:
                        categoryId,

                    details,

                    paid_by:
                        user.id,

                    paid_by_name:
                        profile.display_name,

                    split_type:
                        splitType,

                    created_by:
                        user.id

                });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Expense Saved");

        setAmount("");
        setDetails("");
    }

    return (

        <div>

            <h1>
                New Expense
            </h1>

            <label>
                Date
            </label>

            <br />

            <input
                type="date"
                value={expenseDate}
                onChange={(e) =>
                    setExpenseDate(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <label>
                Amount
            </label>

            <br />

            <input
                value={amount}
                onChange={(e) =>
                    setAmount(
                        e.target.value
                    )
                }
            />

            <br />
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

            <br />
            <br />

            <label>
                Details
            </label>

            <br />

            <textarea
                value={details}
                onChange={(e) =>
                    setDetails(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <label>
                Split Type
            </label>

            <br />

            <select
                value={splitType}
                onChange={(e) =>
                    setSplitType(
                        e.target.value
                    )
                }
            >
                <option value="equal">
                    Equal
                </option>

                <option value="custom">
                    Custom
                </option>

                <option value="sole">
                    Sole
                </option>

            </select>

            <br />
            <br />

            <button
                onClick={saveExpense}
            >
                Save Expense
            </button>

        </div>

    );
}