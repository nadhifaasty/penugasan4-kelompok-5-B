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

const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function LoginPage() {
  const [serverMessage, setServerMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    setServerMessage(null);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${API_BASE_URL}/accounts/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMessage({
          type: "error",
          text: data.detail || "Login gagal",
        });
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);

      setServerMessage({
        type: "success",
        text: "Login berhasil! Token berhasil disimpan.",
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masuk menggunakan username dan password
          </CardDescription>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="contoh: kayiadmin" {...field} />
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
                        placeholder="Masukkan password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}