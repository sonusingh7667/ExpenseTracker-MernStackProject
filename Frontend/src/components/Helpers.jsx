export const getTimeFrameRange = (timeFrame, customDate = null) => {
  const base = customDate ? new Date(customDate) : new Date();
  
  if (timeFrame === "daily") {
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
    const end = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
    return { start, end, label: "Today" };
  }

  if (timeFrame === "weekly") {
    const start = new Date(base);
    start.setDate(base.getDate() - base.getDay());
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end, label: "This Week" };
  }

  if (timeFrame === "monthly") {
    const start = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end, label: "This Month" };
  }

  // yearly
  if (timeFrame === "yearly") {
    const start = new Date(base.getFullYear(), 0, 1, 0, 0, 0, 0);
    const end = new Date(base.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { start, end, label: "This Year" };
  }

  // default -> monthly
  const start = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end, label: "This Month" };
};

export const getPreviousTimeFrameRange = (timeFrame) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (timeFrame === "daily") {
    const yesterday = new Date(start);
    yesterday.setDate(start.getDate() - 1);
    const end = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23,
      59,
      59,
      999
    );
    return {
      start: yesterday,
      end,
      label: "Yesterday",
    };
  }

  if (timeFrame === "weekly") {
    const startOfLastWeek = new Date(start);
    startOfLastWeek.setDate(start.getDate() - start.getDay() - 7);
    startOfLastWeek.setHours(0, 0, 0, 0);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999);
    return { start: startOfLastWeek, end: endOfLastWeek, label: "Last Week" };
  }

  if (timeFrame === "monthly") {
    const startOfLastMonth = new Date(
      start.getFullYear(),
      start.getMonth() - 1,
      1,
      0,
      0,
      0,
      0
    );
    const endOfLastMonth = new Date(
      start.getFullYear(),
      start.getMonth(),
      0,
      23,
      59,
      59,
      999
    );
    return {
      start: startOfLastMonth,
      end: endOfLastMonth,
      label: "Last Month",
    };
  }

  if (timeFrame === "yearly") {
    const startOfLastYear = new Date(start.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
    const endOfLastYear = new Date(
      start.getFullYear() - 1,
      11,
      31,
      23,
      59,
      59,
      999
    );
    return { start: startOfLastYear, end: endOfLastYear, label: "Last Year" };
  }

  // default -> last month
  const startOfLastMonth = new Date(
    start.getFullYear(),
    start.getMonth() - 1,
    1,
    0,
    0,
    0,
    0
  );
  const endOfLastMonth = new Date(
    start.getFullYear(),
    start.getMonth(),
    0,
    23,
    59,
    59,
    999
  );
  return { start: startOfLastMonth, end: endOfLastMonth, label: "Last Month" };
};

export const calculateData = (transactions) => {
  const totals = transactions.reduce(
    (data, t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "income") {
        data.income += amt;
      } else {
        data.expenses += amt;
      }
      return data;
    },
    { income: 0, expenses: 0 }
  );

  return { ...totals, savings: totals.income - totals.expenses };
};

export const generateChartPoints = (timeFrame, customRange = null) => {
  const now = new Date();
  const points = [];

  if (timeFrame === "daily") {
    // Generate 24 hours for daily view
    for (let i = 0; i < 24; i++) {
      const hourDate = new Date(now);
      hourDate.setHours(i, 0, 0, 0);
      const hour12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? "PM" : "AM";
      points.push({
        date: hourDate,
        label: `${hour12} ${ampm}`,
        hour: i,
        isCurrent: i === now.getHours(),
      });
    }
  } else if (timeFrame === "weekly") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      points.push({
        date: day,
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
        dayOfMonth: day.getDate(),
        month: day.getMonth(),
        year: day.getFullYear(),
        isCurrent:
          day.getDate() === now.getDate() &&
          day.getMonth() === now.getMonth() &&
          day.getFullYear() === now.getFullYear(),
      });
    }
  } else if (timeFrame === "monthly") {
    const baseDate = customRange?.start || now;
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      points.push({
        date: day,
        label: `${i}`,
        dayOfMonth: i,
        month,
        year,
        isCurrent:
          i === now.getDate() &&
          month === now.getMonth() &&
          year === now.getFullYear(),
      });
    }
  } else if (timeFrame === "yearly") {
    const baseDate = customRange?.start || now;
    const year = baseDate.getFullYear();

    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(year, i, 1);
      points.push({
        date: monthDate,
        label: monthDate.toLocaleDateString("en-US", { month: "short" }),
        month: i,
        year,
        isCurrent: i === now.getMonth() && year === now.getFullYear(),
      });
    }
  } else {
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(now.getFullYear(), now.getMonth(), i);
      points.push({
        date: day,
        label: `${i}`,
        dayOfMonth: i,
        month: now.getMonth(),
        year: now.getFullYear(),
        isCurrent: i === now.getDate(),
      });
    }
  }

  return points;
};