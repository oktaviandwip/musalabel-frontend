"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Label } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const chartConfig = {} satisfies ChartConfig;

export default function Component() {
  const [incomeInterval, setIncomeInterval] = useState("daily");
  const [quantityInterval, setQuantityInterval] = useState("week");
  const [incomeData, setIncomeData] = useState([]);
  const [quantityData, setQuantityData] = useState([{}]);

  useEffect(() => {
    console.log(incomeData);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/dashboard?kind=income&interval=${incomeInterval}`
        );
        const { data } = await response.json();
        setIncomeData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [incomeInterval]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/dashboard?kind=quantity&interval=${quantityInterval}`
        );
        const { data } = await response.json();
        if (data) {
          setQuantityData(data);
        } else {
          setQuantityData([
            {
              Produk: "Habibah",
              "Total Penjualan": 0,
            },
            {
              Produk: "Fatimah",
              "Total Penjualan": 0,
            },
            {
              Produk: "Hafshah",
              "Total Penjualan": 0,
            },
            {
              Produk: "Khadijah",
              "Total Penjualan": 0,
            },
            {
              Produk: "Safiyyah",
              "Total Penjualan": 0,
            },
            {
              Produk: "Aurvi",
              "Total Penjualan": 0,
            },
            {
              Produk: "Maryam",
              "Total Penjualan": 0,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [quantityInterval]);

  return (
    <>
      <div className="pt-24">
        <h1 className="text-center font-semibold mb-8">Total Pendapatan</h1>
        <RadioGroup
          value={incomeInterval}
          onValueChange={(value) => setIncomeInterval(value)}
          className="mb-4 flex justify-center items-center"
        >
          <RadioGroupItem value="daily" id="daily" />
          <label htmlFor="daily" className="mr-8">
            Harian
          </label>
          <RadioGroupItem value="weekly" id="weekly" />
          <label htmlFor="weekly" className="mr-8">
            Mingguan
          </label>
          <RadioGroupItem value="monthly" id="monthly" />
          <label htmlFor="monthly">Bulanan</label>
        </RadioGroup>

        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={incomeData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Periode"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="Total Pendapatan"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                if (value > 100000) {
                  return `${(value / 1000000).toFixed(1)} M`;
                } else {
                  return value.toLocaleString();
                }
              }}
            >
              <Label angle={-90} position="insideLeft">
                Pendapatan
              </Label>
            </YAxis>

            <Label value="Total Pendapatan" angle={-90} position="insideLeft" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Total Pendapatan" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="pt-24">
        <h1 className="text-center font-semibold mb-8">Total Penjualan</h1>
        <RadioGroup
          value={quantityInterval}
          onValueChange={(value) => setQuantityInterval(value)}
          className="mb-4 flex justify-center items-center"
        >
          <RadioGroupItem value="week" id="week" />
          <label htmlFor="week" className="mr-8">
            1 Minggu
          </label>
          <RadioGroupItem value="month" id="month" />
          <label htmlFor="month" className="mr-8">
            1 Bulan
          </label>
          <RadioGroupItem value="year" id="year" />
          <label htmlFor="year">1 Tahun</label>
        </RadioGroup>

        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={quantityData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Produk"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const words = value.split(" ");
                return words[words.length - 1];
              }}
            />
            <YAxis
              dataKey="Total Penjualan"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            >
              <Label angle={-90} position="insideLeft">
                Jumlah
              </Label>
            </YAxis>

            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Total Penjualan" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </>
  );
}
