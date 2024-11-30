import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# Set Page Config
st.set_page_config(page_title="Online Purchase Tracker", layout="wide")

# Initialize session state
if "data" not in st.session_state:
    st.session_state["data"] = pd.DataFrame(columns=["Date", "Category", "Website", "Amount"])

# Header Section
st.title("🛒 Online Purchase Tracker")
st.subheader("Track your spending and visualize your online purchases.")
st.write("### This Month’s Overview")

# Monthly Spending Calculation
total_spending = st.session_state["data"]["Amount"].sum()
st.metric("Total Spending This Month", f"${total_spending:.2f}", delta="You’re on track to save 20% compared to last month!")

# Add Transaction Section
st.write("## Add a New Transaction")
with st.form("transaction_form"):
    date = st.date_input("Date of Transaction")
    category = st.selectbox("Category", ["Clothing", "Technology", "Groceries", "Entertainment", "Other"])
    website = st.text_input("Website/Merchant")
    amount = st.number_input("Amount ($)", min_value=0.01, step=0.01)
    submitted = st.form_submit_button("Add Transaction")

    if submitted:
        new_transaction = pd.DataFrame(
            {"Date": [date], "Category": [category], "Website": [website], "Amount": [amount]}
        )
        st.session_state["data"] = pd.concat([st.session_state["data"], new_transaction], ignore_index=True)
        st.success("Transaction added successfully!")

# Visualization Section
if not st.session_state["data"].empty:
    st.write("## Your Spending Trends")

    # Spending Trends Chart
    col1, col2, col3 = st.columns([2, 2, 1])

    # Monthly Spending Trends
    with col1:
        st.write("### Monthly Spending")
        st.session_state["data"]["Month"] = pd.to_datetime(st.session_state["data"]["Date"]).dt.to_period("M")
        monthly_spending = st.session_state["data"].groupby("Month")["Amount"].sum().reset_index()
        fig, ax = plt.subplots()
        ax.bar(monthly_spending["Month"].astype(str), monthly_spending["Amount"], color="gray")
        ax.set_title("Monthly Spending Trends")
        ax.set_xlabel("Month")
        ax.set_ylabel("Spending ($)")
        st.pyplot(fig)

    # Spending by Category
    with col2:
        st.write("### Spending by Category")
        category_spending = st.session_state["data"].groupby("Category")["Amount"].sum().reset_index()
        fig2, ax2 = plt.subplots()
        ax2.pie(
            category_spending["Amount"],
            labels=category_spending["Category"],
            autopct="%1.1f%%",
            colors=plt.cm.Paired.colors,
        )
        ax2.set_title("Category Breakdown")
        st.pyplot(fig2)

    # Spending by Website
    with col3:
        st.write("### Spending by Website")
        website_spending = st.session_state["data"].groupby("Website")["Amount"].sum().reset_index()
        fig3, ax3 = plt.subplots()
        ax3.pie(
            website_spending["Amount"],
            labels=website_spending["Website"],
            autopct="%1.1f%%",
            colors=plt.cm.Set3.colors,
        )
        ax3.set_title("Website Breakdown")
        st.pyplot(fig3)

    # Key Statistics Section
    st.write("## Summary Statistics")
    avg_order = st.session_state["data"]["Amount"].mean()
    peak_category = (
        st.session_state["data"].groupby("Category")["Amount"].sum().idxmax() if not st.session_state["data"].empty else None
    )
    st.write(f"**Average Order Value:** ${avg_order:.2f}")
    st.write(f"**Most Spending in Category:** {peak_category}")

else:
    st.write("No transactions to display. Add transactions above to see trends and statistics.")

# Footer
st.write("### Powered by Streamlit | Designed for smarter spending.")
