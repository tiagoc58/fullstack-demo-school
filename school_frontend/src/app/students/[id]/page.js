"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:8000";

export default function StudentDetail({ params }) {
  const { id } = params;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_BASE_URL}/students/${id}/`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      }
    }
    load();
  }, [id]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Detalle de estudiante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Nombre:</strong> {student.full_name}</div>
            <div><strong>Email:</strong> {student.email}</div>
            <div><strong>Código:</strong> {student.code}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
