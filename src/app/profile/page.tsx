"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import photoProfile from "@/assets/photo-profile.svg";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getProfile } from "@/store/reducer/user";
import Header from "@/components/header/Header";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

// Define the validation schema
const formSchema = z.object({
  id: z.string(),
  image: z.union([
    z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Each file must be less than 5MB"
      )
      .refine(
        (file) => ["image/jpeg", "image/png"].includes(file.type),
        "Only .jpg and .png files are accepted"
      ),
    z.null(),
  ]),
  email: z.string().email("Alamat email tidak valid."),
  phone_number: z.string().min(10, "No. Telp min. 10 digit."),
  address1: z.string().min(10, "Alamat min. 10 karakter."),
  address2: z.string().optional(),
  address3: z.string().optional(),
  username: z.string().min(6, "Username min. 6 karakter."),
  birthday: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Tanggal tidak valid."),
  gender: z.string(),
  full_name: z.string().min(3, "Nama lengkap min. 3 karakter."),
});

const passwordSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password tidak cocok.",
    path: ["confirm_password"],
  });

export default function UserProfileForm() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.user);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [fileName, setFileName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showSecondAddress, setShowSecondAddress] = useState(false);
  const [showThirdAddress, setShowThirdAddress] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      image: null,
      email: "",
      phone_number: "",
      address1: "",
      address2: "",
      address3: "",
      username: "",
      birthday: "",
      gender: "m",
      full_name: "",
    },
  });

  const formPassword = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    async function createFile(url: string) {
      if (!url) return null;
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], "image.png", { type: blob.type });
    }

    if (profile) {
      if (profile.Image) {
        createFile(profile.Image).then((file) => {
          setSelectedImage(profile.Image);
          setFileName("image.png");
          form.setValue("image", file);
        });
      }

      if (profile.Birthday) {
        setDate(new Date(profile.Birthday));
      }

      // Setting form values from profile
      form.setValue("id", profile.Id);
      formPassword.setValue("email", profile.Email);
      form.setValue("email", profile.Email);
      form.setValue("phone_number", profile.Phone_number);
      form.setValue("address1", profile.Address1);
      form.setValue("address2", profile.Address2);
      form.setValue("address3", profile.Address3);
      form.setValue("username", profile.Username);
      form.setValue("birthday", profile.Birthday);
      form.setValue("gender", profile.Gender);
      form.setValue("full_name", profile.Full_name); // Set full_name from profile
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      form.setValue("image", selectedFile);
      setSelectedImage(imageUrl);
      setFileName(selectedFile.name);
    } else {
      setSelectedImage(null);
      form.setValue("image", null);
      setFileName("");
    }

    e.target.value = "";
    setFileInputKey((prev) => prev + 1);
  }

  function removeImage() {
    setSelectedImage(null);
    form.setValue("image", null);
    setFileName("");
  }

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleCancel() {
    router.push("/");
  }

  function openPasswordDialog() {
    setPasswordDialogOpen(true);
  }

  function closePasswordDialog() {
    setPasswordDialogOpen(false);
  }

  function handleShowSecondAddress() {
    if (showThirdAddress) {
      setShowThirdAddress(false);
    }
    setShowSecondAddress(!showSecondAddress);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("id", values.id);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone_number);
    formData.append("address1", values.address1);
    formData.append("address2", values.address2 || "");
    formData.append("address3", values.address3 || "");
    formData.append("username", values.username);
    formData.append("birthday", values.birthday);
    formData.append("gender", values.gender);
    formData.append("full_name", values.full_name);

    if (values.image) {
      formData.append("image", values.image);
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/profile`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (res.ok) {
      const { data } = await res.json();
      dispatch(getProfile(data));
      router.push("/");
    } else {
      console.error("Failed to submit the form");
    }
  }

  async function handleUpdatePassword(values: z.infer<typeof passwordSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/password`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (res.ok) {
      closePasswordDialog();
    } else {
      console.error("Failed to submit the form");
    }
  }

  return (
    <>
      <Header />
      <div className="container pt-28">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-10"
          >
            <div className="flex gap-4">
              <div className="w-1/2 space-y-2">
                <div className="flex justify-center">
                  <div className="relative group cursor-pointer w-36 h-36">
                    <Image
                      src={selectedImage || photoProfile}
                      alt="Photo profile"
                      layout="fill"
                      objectFit="cover"
                      quality={100}
                      className="rounded-full"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100"
                      onClick={handleImageClick}
                    >
                      Ganti Foto
                    </div>
                    {selectedImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="hidden absolute top-1 right-[-6px] justify-center items-center bg-black bg-opacity-50 text-white rounded-full w-6 h-6 group-hover:flex"
                      >
                        <DeleteIcon style={{ fontSize: 15 }} />
                      </button>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem className="relative">
                      <FormLabel>Foto Profil</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          placeholder={fileName || "Choose Image"}
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          ref={fileInputRef}
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="button" onClick={openPasswordDialog}>
                  Ganti Password
                </Button>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2 space-y-2">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. Telp</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate || undefined);
                              field.onChange(
                                selectedDate ? selectedDate.toISOString() : ""
                              );
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat 1</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Address 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showSecondAddress && (
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex space-x-4">
                          <div>Alamat 2</div>
                          <div
                            className="flex space-x-1 text-destructive items-center cursor-pointer underline text-xs mt-[-1px]"
                            onClick={handleShowSecondAddress}
                          >
                            Tutup
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alamat 2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showThirdAddress && (
                  <FormField
                    control={form.control}
                    name="address3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex space-x-4">
                          <div>Alamat 3</div>
                          <div
                            className="flex space-x-1 text-destructive items-center cursor-pointer underline text-xs mt-[-1px]"
                            onClick={handleShowSecondAddress}
                          >
                            Tutup
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alamat 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!showSecondAddress && (
                  <Button
                    type="button"
                    onClick={() => setShowSecondAddress(true)}
                  >
                    Alamat 2
                  </Button>
                )}

                {showSecondAddress && !showThirdAddress && (
                  <Button
                    type="button"
                    onClick={() => setShowThirdAddress(true)}
                  >
                    Alamat 3
                  </Button>
                )}

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex gap-4 items-center"
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <RadioGroupItem value="m" id="m" />
                          <label htmlFor="m">Laki-laki</label>
                          <RadioGroupItem value="f" id="f" />
                          <label htmlFor="f">Perempuan</label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Batalkan
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>

        <Dialog
          open={isPasswordDialogOpen}
          onOpenChange={setPasswordDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ganti Password</DialogTitle>
            </DialogHeader>
            <Form {...formPassword}>
              <form
                onSubmit={formPassword.handleSubmit(handleUpdatePassword)}
                className="space-y-4"
              >
                <FormField
                  control={formPassword.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Password Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Icon
                            icon={
                              isPasswordVisible ? "mage:eye-off" : "mage:eye"
                            }
                            onClick={() =>
                              setIsPasswordVisible(!isPasswordVisible)
                            }
                            className="absolute top-[11px] right-4"
                          />
                          <Input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="*********"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPassword.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Konfirmasi Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Icon
                            icon={
                              isConfirmPassVisible ? "mage:eye-off" : "mage:eye"
                            }
                            onClick={() =>
                              setIsConfirmPassVisible(!isConfirmPassVisible)
                            }
                            className="absolute top-[11px] right-4"
                          />
                          <Input
                            type={isConfirmPassVisible ? "text" : "password"}
                            placeholder="*********"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={closePasswordDialog}
                    variant="outline"
                  >
                    Batalkan
                  </Button>
                  <Button type="submit">Simpan</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
