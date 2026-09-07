import * as XLSX from "xlsx";

export const exportToExcel = (data, filename = "transaction") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    // create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    //Generate an Excel file and trigger download
    const fullFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    XLSX.writeFile(workbook, fullFilename);
  } catch (error) {
    console.error("Export error:", error);
    alert("Error exporting data. Please try again.")
  }
};
