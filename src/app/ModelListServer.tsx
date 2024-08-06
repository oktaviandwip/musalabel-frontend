import { FC } from "react";
import ModelListClient from "./ModelListClient";

interface Model {
  Id: number;
  Name: string;
  Price: number;
  Stock: number;
  Image: string;
  Slug: string;
}

const fetchModels = async (): Promise<Model[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products/?page=1&limit=12`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.data;
};

const ModelListServer: FC = async () => {
  try {
    const models = await fetchModels();
    return <ModelListClient models={models} />;
  } catch (error) {
    console.error("Error fetching models:", error);
    return <p>Error loading models</p>;
  }
};

export default ModelListServer;
