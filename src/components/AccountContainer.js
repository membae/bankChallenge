import React, { useEffect, useState } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";

function AccountContainer() {
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filtertransactions, setFilterTransactions] = useState([]);

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
  });

  useEffect(() => {
    const fetchTranasctions = async () => {
      const response = await fetch("http://localhost:8001/transactions");
      const data = await response.json();
      if (!response.ok) {
        alert("Failed to fetch transactions");
      }
      setTransactions((prev) => [...prev, ...data]);
    };
    fetchTranasctions();
  }, []);

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8001/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, amount: parseInt(data.amount) }),
    });
    if (!response.ok) {
      alert("Failed to add new Transaction!");
    } else {
      setFormData({
        date: "",
        description: "",
        category: "",
        amount: "",
      });
    }
  };

  useEffect(() => {
    if (search !== "") {
      setFilterTransactions(
        transactions.filter((transaction) =>
          transaction.description?.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilterTransactions(transactions);
    }
  }, [transactions, search]);

  return (
    <div>
      <Search search={search} setSearch={setSearch} />
      <AddTransactionForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
      <TransactionsList transactions={filtertransactions} />
    </div>
  );
}

export default AccountContainer;
