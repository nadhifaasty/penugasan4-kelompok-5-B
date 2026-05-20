"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./schema";

// Tipe data event (sesuaikan dengan response API)
interface EventData {
  id: number;
  title: string;
  date: string;
  description: string;
}

export default function EventPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  // GET /events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Ambil token
        const res = await fetch(`${API_BASE_URL}/events`, {
          headers: {
            "Authorization": `Bearer ${token}` // Sisipkan di sini
          }
        }); 
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Gagal fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
    reset({ eventId: event.id, nama: "", nim: "", email: "" });
  };

  // POST /registrations/frontend
  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("access_token"); // Ambil token
      const res = await fetch(`${API_BASE_URL}/registrations/frontend`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Sisipkan di sini (gabung dengan Content-Type)
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Registrasi berhasil!");
        setSelectedEvent(null);
      } else {
        alert("Gagal melakukan registrasi.");
      }
    } catch (err) {
      console.error("Gagal submit form", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Event</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{event.date}</p>
            <p className="mb-4">{event.description}</p>
            <button 
              onClick={() => handleSelectEvent(event)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Daftar Event Ini
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Form Registrasi: {selectedEvent.title}</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
            <input type="hidden" {...register("eventId", { valueAsNumber: true })} />

            <div>
              <input {...register("nama")} placeholder="Nama Lengkap" className="border p-2 w-full rounded" />
              {errors.nama && <span className="text-red-500 text-sm">{errors.nama.message as string}</span>}
            </div>

            <div>
              <input {...register("nim")} placeholder="NIM" className="border p-2 w-full rounded" />
              {errors.nim && <span className="text-red-500 text-sm">{errors.nim.message as string}</span>}
            </div>

            <div>
              <input type="email" {...register("email")} placeholder="Email" className="border p-2 w-full rounded" />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message as string}</span>}
            </div>

            <div className="flex gap-2 mt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Registrasi"}
              </button>
              <button 
                type="button" 
                onClick={() => setSelectedEvent(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}