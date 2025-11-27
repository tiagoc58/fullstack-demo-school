
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";

const API_BASE_URL = "http://localhost:8000";





export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name")
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);

  const loadStudents = async () => {
    console.log("Haciendo búsqueda de... ", query)
    const url = `${API_BASE_URL}/students/?search=${encodeURIComponent(query)}&ordering=${ordering}&page=${page}`
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  const orderingClickHandler = (button) => {
    if (button === 'name_button') {
      if (ordering === 'full_name') setOrdering('-full_name')
      else setOrdering('full_name')
    } else {
      if (ordering === 'code') setOrdering('-code')
      else setOrdering('code')
    }
  }

  useEffect(() => {
    loadStudents().then((data) => {
      // DRF paginated response has {count, next, previous, results}
      if (data?.results) {
        setStudents(data.results);
        setPageData({ next: data.next, previous: data.previous, count: data.count });
      } else {
        setStudents(data);
        setPageData(null);
      }
    });
  }, [query, ordering, page]);

  const onSubmit = async (data) => {
    console.log("Submitting data: ", data);
    const response = await fetch(`${API_BASE_URL}/students/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    )
    if (response.ok) {
      const newStudent = await response.json();
      // reload current page
      loadStudents().then((data) => {
        if (data?.results) setStudents(data.results)
        else setStudents(data)
      });
      toast.success("Estudiante agregado con éxito");
      setOpenCreate(false);
    }
    else {
      const errorData = await response.json();
      console.error("Error adding student: ", errorData);

      let errorMessage = "";

      for(const key in errorData) {
        errorMessage += `${key}: ${errorData[key]}\n`;
      }

      toast.error("Error al agregar el estudiante", {
        description: errorMessage,
      });
    }
  }

  return (
    <Card className="w-96 mx-auto mt-4">
      <CardHeader>
        <CardTitle>Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="outline" onClick={() => { orderingClickHandler("name_button") }}>
            {ordering === 'full_name' ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
          <Button variant="outline" onClick={() => { orderingClickHandler("code_button") }}>
            {ordering === 'code' ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
          <div className="ml-auto">
            <Button onClick={() => setOpenCreate(true)}>Crear estudiante</Button>
          </div>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="p-4 h-72 overflow-y-auto">
          <ul>
            {students.map((student) => (
              <li key={student.code} className="text-md font-medium my-2 flex flex-row justify-between items-center" title={student.email}>
                <a className="flex-1 text-primary underline" href={`/students/${student.id}`}>{student.full_name}</a>
                <div className="ml-4">{student.code}</div>
              </li>
            ))}
          </ul>
        </div>
        <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <div className="mb-4">
          <Pagination
            previous={pageData?.previous}
            next={pageData?.next}
            onPrevious={() => { if (pageData?.previous) setPage((p) => Math.max(1, p - 1)) }}
            onNext={() => { if (pageData?.next) setPage((p) => p + 1) }}
          />
        </div>

      </CardContent>

      <Dialog open={openCreate} onOpenChange={setOpenCreate} title="Crear estudiante">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3">
            <Field>
              <FieldLabel htmlFor="full_name">Nombre completo</FieldLabel>
              <Input id="full_name" {...register("full_name", { required: true })} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" {...register("email", { required: true })} />
            </Field>
            <Field>
              <FieldLabel htmlFor="code">Código</FieldLabel>
              <Input id="code" {...register("code", { required: true })} />
            </Field>
            <div className="flex justify-end">
              <Button type="submit">Crear</Button>
            </div>
          </div>
        </form>
      </Dialog>
    </Card>

  );
}
