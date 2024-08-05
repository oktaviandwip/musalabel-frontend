"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox } from "@/components/ui/checkbox";

// Define the size options
const items = [
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "XXL", label: "XXL" },
] as const;

// Define the validation schema
const formSchema = z.object({
  image: z
    .array(z.instanceof(File))
    .min(1, "Please select at least one image.")
    .max(5, "You can only upload up to 5 images.")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be less than 5MB"
    )
    .refine(
      (files) =>
        files.every((file) => ["image/jpeg", "image/png"].includes(file.type)),
      "Only .jpg and .png files are accepted"
    ),
  name: z.string().min(6, {
    message: "Name must be at least 6 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  stock: z.number().min(0, {
    message: "Stock min. 1",
  }),
  price: z.number().min(0.01, {
    message: "Price must be at least 0.01",
  }),
  size: z
    .array(z.string())
    .nonempty({ message: "You have to select at least one item." }),
});

export default function EditProduct() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: [],
      name: "",
      description: "",
      stock: 0,
      price: 0,
      size: [],
    },
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8080/products/${id}`);
        if (res.ok) {
          const { data } = await res.json();
          const imageUrls = data.Image.split(",");
          setSelectedImages(imageUrls);

          const imageFiles = await Promise.all(
            imageUrls.map(async (url: string, index: number) => {
              const response = await fetch(url);
              const blob = await response.blob();
              const fileName = `image${index + 1}.png`;
              return new File([blob], fileName, { type: blob.type });
            })
          );

          form.setValue("image", imageFiles);
          form.setValue("name", data.Name);
          form.setValue("description", data.Description);
          form.setValue("stock", data.Stock);
          form.setValue("price", data.Price);
          form.setValue("size", data.Size.split(",")); // Ensure the size field is set correctly
        } else {
          console.error("Failed to fetch the product data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchProduct();
  }, [id, form]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (files.length > 0) {
      if (selectedImages.length < 5) {
        const newImages = files.filter((file) => selectedImages.length < 5);
        const newImageUrls = newImages.map((file) => URL.createObjectURL(file));
        form.setValue("image", [...form.getValues("image"), ...newImages]);
        setSelectedImages((prevImages) => [...prevImages, ...newImageUrls]);
      }
    }
    // Reset the input to allow re-selection of the same file
    e.target.value = "";
    setFileInputKey((prev) => prev + 1); // Change the key to re-render the input
  }

  function removeImage(index: number) {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    const updatedFiles = form.getValues("image").filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    form.setValue("image", updatedFiles);
  }

  function resetImages() {
    setSelectedImages([]);
    form.setValue("image", []);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    values.image.forEach((file) => {
      formData.append("image", file);
    });

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("stock", values.stock.toString());
    formData.append("price", values.price.toString());
    formData.append("size", values.size.join(",")); // Send sizes as a comma-separated string

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (res.status === 201) {
      console.log("Success");
    } else {
      console.error("Failed to submit the form");
    }
  }

  return (
    <div className="pt-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {selectedImages.map((src, index) => (
              <div key={index} className="relative w-32 h-48 group">
                <Image
                  src={src}
                  alt={`Selected image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 hidden group-hover:flex justify-center items-center bg-black bg-opacity-30 text-white rounded-full w-6 h-6"
                >
                  <DeleteIcon style={{ fontSize: 15 }} />
                </button>
              </div>
            ))}
          </div>

          <FormField
            name="images"
            render={() => (
              <FormItem className="relative">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input readOnly placeholder="Choose Images" />
                </FormControl>
                <FormControl>
                  <Input
                    multiple
                    key={fileInputKey}
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleFileChange}
                    className="opacity-0 absolute top-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" onClick={resetImages} variant="secondary">
            Reset Images
          </Button>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Basic Dress Asma" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Baju wanita muslim dengan bahan katun."
                    {...field}
                    rows={4} // Adjust the number of rows as needed
                    className="w-full border-2 border-secondary rounded-xl p-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {items.map((item) => (
                    <FormItem
                      key={item.id}
                      className="flex items-center space-x-2"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...(field.value || []), item.id]
                              : field.value?.filter(
                                  (value) => value !== item.id
                                );
                            field.onChange(newValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="leading-none">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Simpan</Button>
        </form>
      </Form>
    </div>
  );
}
