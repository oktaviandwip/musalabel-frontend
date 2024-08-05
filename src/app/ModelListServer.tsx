// app/products/ModelList.server.tsx

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
    "https://f3f0-2001-448a-2074-6bdc-cc6e-28-a9ee-9c06.ngrok-free.app/products/?page=1&limit=12",
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
