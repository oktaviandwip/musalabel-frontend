"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "@/components/pagination/Pagination";
import Header from "@/components/header/Header";

interface Model {
  Id: string;
  Name: string;
  Image: string;
  Stock: number;
  Slug: string;
  Price: number; // Add price field
  Size: string; // Add size field
}

interface Meta {
  next: number | null;
  prev: number | null;
  total: number;
}

async function getModels(
  page: number = 1,
  limit: number = 5
): Promise<{ data: Model[]; meta: Meta }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products/?page=${page}&limit=${limit}`
  );
  return res.json();
}

async function deleteModel(id: string): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
}

export default function Admin() {
  const [data, setData] = useState<Model[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const maxPages = 4;

  async function fetchData() {
    const { data, meta } = await getModels(currentPage, itemsPerPage);
    setData(data);
    setTotalPages(Math.ceil(meta.total / itemsPerPage));
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    try {
      await deleteModel(id);
      fetchData();
    } catch (error) {
      console.error("Failed to delete the model:", error);
    }
  };

  return (
    <div className="pt-24">
      <div className="flex justify-end my-4">
        <Button>
          <Link href="/admin/create">Add Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">No.</TableHead>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-center">Model</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Size</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((model: Model, index) => {
              const imageUrls = model.Image.split(",");
              return (
                <TableRow key={model.Id} className="text-center">
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <Image
                      src={imageUrls[0]}
                      alt={model.Name}
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell>{model.Name}</TableCell>
                  <TableCell>{model.Price}</TableCell>
                  <TableCell>{model.Stock}</TableCell>
                  <TableCell>{model.Size}</TableCell>
                  <TableCell>
                    <div className="flex justify-center text-white gap-x-4">
                      <Button className="size-10 bg-primary rounded-lg hover:bg-white hover:text-primary">
                        <Link href={`/admin/edit/${model.Id}`}>
                          <EditIcon />
                        </Link>
                      </Button>
                      <Button className="size-10 bg-secondary rounded-lg text-primary hover:text-white">
                        <Link href={`/products/${model.Slug}`}>
                          <VisibilityIcon />
                        </Link>
                      </Button>
                      <Button
                        className="size-10 bg-destructive rounded-lg"
                        onClick={() => handleDelete(model.Id)}
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        maxPages={maxPages}
      />
    </div>
  );
}
