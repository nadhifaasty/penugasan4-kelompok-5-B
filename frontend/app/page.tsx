"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (form.username.length < 3)
      newErrors.username = "Username minimal 3 karakter";
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(form.email))
      newErrors.email = "Format email tidak valid";
    if (form.password.length < 8)
      newErrors.password = "Password minimal 8 karakter";
    else if (!/[A-Z]/.test(form.password))
      newErrors.password = "Password harus mengandung minimal 1 huruf besar";
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/accounts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          role_id: 2,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerMessage({ type: "error", text: data.detail || data.message || "Registrasi gagal" });
      } else {
        setServerMessage({ type: "success", text: "Register berhasil!" });
        setForm({ username: "", email: "", password: "" });
      }
    } catch {
      setServerMessage({ type: "error", text: "Tidak dapat terhubung ke server." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Akun</CardTitle>
          <CardDescription>Buat akun baru untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          {serverMessage && (
            <div className={`mb-4 rounded-md px-4 py-3 text-sm font-medium ${
              serverMessage.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {serverMessage.type === "success" ? "✅ " : "❌ "}
              {serverMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="contoh: nadhifa"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh: nad@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 karakter, ada huruf besar"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}