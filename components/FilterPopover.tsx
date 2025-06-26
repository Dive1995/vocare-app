"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Category, PatientSearchResult } from "@/types/models";
import { RefreshCw } from "lucide-react";

type Props = {
  categories: Category[];
  patients: PatientSearchResult[];
  setPatients: Dispatch<SetStateAction<PatientSearchResult[]>>;
  onCategoryChange: (value: string | null) => void;
  onPatientChange: (value: string | null) => void;
  onPatientSearch: (search: string) => void;
};

export default function FilterPopover({
  categories,
  patients,
  setPatients,
  onCategoryChange,
  onPatientChange,
  onPatientSearch,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // seacrch user
  useEffect(() => {
    if (searchTerm.length > 1) {
      onPatientSearch(searchTerm);
    } else {
      setPatients([]);
    }
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4">
      {/* category filter */}
      <div className="space-y-2">
        <Label>Kategorie</Label>
        <Select
          value={selectedCategory ?? ""}
          onValueChange={(val) => {
            setSelectedCategory(val);
            onCategoryChange(val);
          }}>
          <SelectTrigger>
            <SelectValue placeholder="Kategorie wählen" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* patient search & select */}
      <div className="space-y-2">
        <Label>Patient suchen</Label>
        <Input
          placeholder="Name eingeben..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {patients.length > 0 && (
          <Select
            value={selectedPatient ?? ""}
            onValueChange={(val) => {
              setSelectedPatient(val);
              onPatientChange(val);
            }}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Patient auswählen" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.firstname} {p.lastname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* reset */}
      <Button
        variant="secondary"
        onClick={() => {
          setSelectedCategory(null);
          setSelectedPatient(null);
          setSearchTerm("");
          onCategoryChange(null);
          onPatientChange(null);
          setPatients([]);
        }}
        className="w-full">
        <RefreshCw />
        Filter zurücksetzen
      </Button>
    </div>
  );
}
