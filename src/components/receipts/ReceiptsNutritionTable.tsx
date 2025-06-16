import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DownloadIcon } from "lucide-react";

// Helper to group ingredients by category within each receipt
function groupByReceiptAndCategory(receipts: any[]) {
  return receipts.map((receipt) => {
    const grouped: Record<string, any[]> = {};
    (receipt.user_receipts_detail || []).forEach((detail) => {
      const cat = detail.ingredient_category?.name || "Lainnya";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(detail);
    });
    return {
      receipt_name: receipt.receipt_name,
      groupedDetails: grouped,
      allDetails: receipt.user_receipts_detail || [],
    };
  });
}

const nutrientCols = [
  { key: "Ca", label: "Ca" },
  { key: "EM", label: "EM" },
  { key: "ID", label: "ID" },
  { key: "LK", label: "LK" },
  { key: "SK", label: "SK" },
  { key: "PK", label: "PK" },
  { key: "Abu", label: "Abu" },
  { key: "Ptot", label: "Ptot" },
  { key: "Pavail", label: "Pavail" },
  { key: "Sodium", label: "Sodium" },
  { key: "Chloride", label: "Chloride" },
  { key: "Methionin", label: "Methionin" },
  { key: "Lysin", label: "Lysin" },
  { key: "Linoleat", label: "Linoleat" },
];

const ReceiptsNutritionTable = ({ receipts, onEditReceipt }) => {
  const receiptsGrouped = groupByReceiptAndCategory(receipts);
  // Helper to sum nutrition columns and price
  function getTotals(details) {
    const totals = { price: 0, kilos: 0 };
    nutrientCols.forEach((col) => {
      totals[col.key] = details.reduce(
        (sum, d) => sum + (Number(d.ingredient?.[col.key]) || 0),
        0
      );
    });
    totals.price = details.reduce(
      (sum, d) => sum + (Number(d.price_per_kilos) || 0),
      0
    );
    totals.kilos = details.reduce((sum, d) => sum + (Number(d.kilos) || 0), 0);
    return totals;
  }
  function totalKilosPercentage(perkilos, total) {
    const totalKilos = (perkilos / total) * 100;
    if (Number(totalKilos) < 0) {
      return 0;
    }
    return (Math.round(totalKilos * 100) / 100).toFixed(2);
  }
  // Compute chart data for total value of each header
  const chartData = useMemo(() => {
    if (!receipts?.length) return [];
    const allDetails = receipts[0]?.user_receipts_detail || [];
    const totals = {};
    nutrientCols.forEach((col) => {
      totals[col.label] = allDetails.reduce(
        (sum, d) => sum + (Number(d.ingredient?.[col.key]) || 0),
        0
      );
    });
    // Prepare for Recharts
    return [
      {
        name: "Total Nutrient",
        ...totals,
      },
    ];
  }, [receipts]);

  // Bar chart data: show each ingredient's kilos for all receipts in the table
  const barChartData = useMemo(() => {
    if (!receipts?.length) return [];
    // Flatten all details from all receipts
    const allDetails = receipts.flatMap((r) => r.user_receipts_detail || []);
    // Group by ingredient name and sum kilos
    const ingredientMap = {};
    allDetails.forEach((d) => {
      const name = d.ingredient?.Name || "-";
      if (!ingredientMap[name]) ingredientMap[name] = 0;
      ingredientMap[name] += d.price_per_kilos || 0;
    });
    return Object.entries(ingredientMap).map(([name, value]) => ({ name, value }));
  }, [receipts]);

  // Pie chart data: ingredient name and kilos for the first receipt
  const pieData = useMemo(() => {
    if (!receipts?.length) return [];
    const allDetails = receipts[0]?.user_receipts_detail || [];
    return allDetails.map((d) => ({
      name: d.ingredient?.Name || "-",
      value: d.price_per_kilos || 0,
    }));
  }, [receipts]);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFF",
    "#FF6699",
    "#FFB347",
    "#B6D7A8",
    "#FFD700",
    "#40E0D0",
  ];

  // XLSX Download handler
  const handleDownload = () => {
    // Prepare data for xlsx
    const tableData = [];
    let fileName = "";

    receiptsGrouped.forEach((receipt) => {
      fileName = receipt.receipt_name;
      Object.entries(receipt.groupedDetails).forEach(([category, details]) => {
        details.forEach((detail) => {
          const row = {
            Kategori: category,
            "Bahan Baku": detail.ingredient?.Name || "-",
            ...nutrientCols.reduce(
              (acc, col) => ({
                ...acc,
                [col.label]: detail.ingredient?.[col.key] ?? "-",
              }),
              {}
            ),
            "Berat (Kg)": detail.kilos ?? "-",
            "Harga Perkilo": detail.price_per_kilos ?? "-",
            "% Hasil Formulasi": totalKilosPercentage(
              detail.kilos,
              getTotals(receipt.allDetails).kilos
            ),
          };
          tableData.push(row);
        });
      });
      // Add total row
      tableData.push({
        Kategori: "",
        "Bahan Baku": "Total",
        ...nutrientCols.reduce(
          (acc, col) => ({
            ...acc,
            [col.label]: getTotals(receipt.allDetails)[col.key] ?? "-",
          }),
          {}
        ),
        "Berat (Kg)": getTotals(receipt.allDetails).kilos ?? "-",
        "Harga Perkilo": getTotals(receipt.allDetails).price ?? "-",
        "% Hasil Formulasi": "1.000",
      });
    });

    // Generate worksheet and file
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Receipts");
    const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([xlsxBuffer], { type: "application/octet-stream" }),
      "receipts_nutrition_" +
        fileName.split(" ").join("_").toLowerCase() +
        ".xlsx"
    );
  };

  // Custom Tooltip for PieChart to show percentage
  const PieChartTooltip = ({ active, payload, barChartData }) => {
    console.log('barChartData',barChartData);
    const totalSum = barChartData.reduce((sum, d) => sum + (d.value || 0), 0)
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Find the total for percentage calculation
      const total = barChartData.reduce((sum, d) => sum + (d.value || 0), 0);
      const percent = total > 0 ? ((data.value / totalSum) * 100).toFixed(2) : "0.00";
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: 8, borderRadius: 4 }}>
          <div><b>{data.name}</b></div>
          <div>Harga: {data.value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</div>
          <div>Persentase: {percent}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {receiptsGrouped.map((receipt, idx) => (
        <React.Fragment key={receipt.receipt_name}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "16px 0",
            }}
          >
            <h2 className="text-xl font-bold">{receipt.receipt_name}</h2>
            {onEditReceipt && (
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                onClick={() => onEditReceipt(receipts[idx])}
              >
                Edit Receipt
              </button>
            )}
          </div>
          <div style={{ overflowX: "auto" }}>
            <Table>
              <TableHeader style={{ textAlign: "center" }}>
                <TableRow>
                  <TableHead
                    rowSpan={2}
                    className="sticky-col"
                    style={{
                      minWidth: 180,
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      background: "#fff",
                    }}
                  >
                    Bahan Baku
                  </TableHead>
                  <TableHead colSpan={nutrientCols.length}>
                    Kandungan Nutrisi Bahan Baku
                  </TableHead>
                  <TableHead
                    align="center"
                    style={{
                      width: "120px",
                      minWidth: "120px",
                      fontWeight: "bold",
                    }}
                  >
                    Berat (Kg)
                  </TableHead>
                  <TableHead
                    align="center"
                    style={{
                      width: "150px",
                      minWidth: "150px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Harga Perkilo
                  </TableHead>
                  <TableHead
                    align="center"
                    style={{
                      width: "170px",
                      minWidth: "170px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    % Hasil Formulasi
                  </TableHead>
                </TableRow>
                <TableRow>
                  {nutrientCols.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(receipt.groupedDetails).map(
                  ([category, details]) => (
                    <React.Fragment key={category}>
                      <TableRow>
                        <TableCell
                          style={{
                            position: "sticky",
                            left: 0,
                            fontWeight: "bold",
                            background: "#fff",
                            zIndex: 1,
                            minWidth: 180,
                          }}
                        >
                          {category}
                        </TableCell>
                      </TableRow>
                      {details.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell
                            className="sticky-col"
                            style={{
                              position: "sticky",
                              left: 0,
                              background: "#fff",
                              zIndex: 1,
                              minWidth: 180,
                              fontWeight: 500,
                            }}
                          >
                            {detail.ingredient?.Name || "-"}
                          </TableCell>
                          {nutrientCols.map((col) => (
                            <TableCell key={col.key}>
                              {detail.ingredient?.[col.key]?.toLocaleString(
                                "id-ID",
                                { minimumFractionDigits: 2 }
                              ) || "-"}
                            </TableCell>
                          ))}
                          <TableCell align="center">{detail.kilos}</TableCell>
                          <TableCell align="center">
                            {detail.price_per_kilos?.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 2,
                            }) || "-"}
                          </TableCell>
                          <TableCell align="center">
                            {totalKilosPercentage(
                              detail.kilos,
                              getTotals(receipt.allDetails).kilos
                            )}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  )
                )}
                {/* Footer for sum */}
                <TableRow style={{ background: "#f5f6fa", fontWeight: "bold" }}>
                  <TableCell
                    className="sticky-col"
                    style={{
                      position: "sticky",
                      left: 0,
                      background: "#f5f6fa",
                      zIndex: 1,
                      minWidth: 180,
                      fontWeight: 700,
                    }}
                  >
                    Total
                  </TableCell>
                  {nutrientCols.map((col) => (
                    <TableCell key={col.key} style={{ fontWeight: 700 }}>
                      {getTotals(receipt.allDetails)[col.key]?.toLocaleString(
                        "id-ID",
                        { minimumFractionDigits: 2 }
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="center" style={{ fontWeight: 700 }}>
                    {getTotals(receipt.allDetails).kilos}
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: 700 }}>
                    {getTotals(receipt.allDetails).price?.toLocaleString(
                      "id-ID",
                      {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 2,
                      }
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: 700, color: "green" }}
                  >
                    1.000
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </React.Fragment>
      ))}
      {/* Chart + Button Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mt-8 gap-8">
        {/* Pie Chart */}
        <div className="w-full md:w-2/3 p-4 bg-white rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Komposisi Harga Per (Kg)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={barChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) =>
                  `${name}: ${value.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}`
                }
              >
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieChartTooltip barChartData={barChartData} active={null} payload={null} />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Download Button */}
        <div className="w-full md:w-fit float-right md:justify-end mt-4 md:mt-0">
          <button
            type="button"
            className="flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded shadow transition"
            onClick={handleDownload}
          >
            <DownloadIcon size={20} />
            <span className="ml-2">Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsNutritionTable;
