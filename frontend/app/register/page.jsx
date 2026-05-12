"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  user_id: z.coerce.number().min(1, "User ID wajib diisi"),
  role_id: z.coerce.number().min(1, "Role ID wajib diisi"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar"),
});

function getErrorMessage(data) {
  if (typeof data?.detail === "string") return data.detail;

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((err) => `${err.loc?.join(".")}: ${err.msg}`)
      .join(", ");
  }

  return data?.message || "Register gagal";
}

export default function RegisterPage() {
  const [serverMessage, setServerMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      user_id: "",
      role_id: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    setServerMessage(null);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${API_BASE_URL}/accounts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(values.user_id),
          role_id: Number(values.role_id),
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMessage({
          type: "error",
          text: getErrorMessage(data),
        });
        return;
      }

      setServerMessage({
        type: "success",
        text: "Register berhasil!",
      });

      form.reset();
    } catch {
      setServerMessage({
        type: "error",
        text: "Tidak dapat terhubung ke server. Pastikan backend berjalan.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>Buat akun baru untuk melanjutkan</CardDescription>
        </CardHeader>

        <CardContent>
          {serverMessage && (
            <div
              className={`mb-4 rounded-md border px-4 py-3 text-sm font-medium ${
                serverMessage.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {serverMessage.type === "success" ? "✅ " : "❌ "}
              {serverMessage.text}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="contoh: 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="contoh: 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="contoh: naduser" {...field} />
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
                      <Input
                        type="email"
                        placeholder="contoh: nadnut@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Min. 8 karakter, ada huruf besar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Mendaftarkan..." : "Daftar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}