import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Appointment, AppointmentForm } from "@/types/models";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatISO } from "date-fns";
import { toast } from "sonner";

const patients = [
  {
    id: "f5013ec7-500b-4eab-a8e7-bce158a58321",
    firstname: "Anna",
    lastname: "Müller",
  },
  {
    id: "43d28dce-df0c-4d10-9ff0-c0295b6795b1",
    firstname: "Lukas",
    lastname: "Schmidt",
  },
  {
    id: "dcf0e285-1856-436d-aa5f-c833397f4f92",
    firstname: "Maria",
    lastname: "Becker",
  },
  {
    id: "0667a0a7-6909-4f05-9be1-9bc390462311",
    firstname: "Paul",
    lastname: "Weber",
  },
  {
    id: "bde3bd51-f416-41d1-b7f2-e753e8dae296",
    firstname: "Lea",
    lastname: "Schneider",
  },
];

const categories = [
  {
    id: "a2486be6-5e6b-4b2a-ab19-e2f8350b2897",
    label: "Arztbesuch",
    color: "#00ff00",
  },
  {
    id: "3f0611b2-f03c-464a-94c4-48934aa80e92",
    label: "MDK-Besuch",
    color: "#ff0000",
  },
  {
    id: "4d38eb6d-741e-4611-9b2d-d2a0a23b8727",
    label: "Erstgespräch",
    color: "#0000ff",
  },
];

type Props = {
  appointment?: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: AppointmentForm) => void;
};

export default function AppointmentFormDialog({
  appointment,
  open,
  onOpenChange,
  onSubmit,
}: Props) {
  const [formData, setFormData] = useState<AppointmentForm>({
    title: "",
    start: formatISO(new Date()),
    end: formatISO(new Date()),
    location: "",
    notes: "",
    patient: "",
    category: "",
  });

  useEffect(() => {
    if (appointment) {
      const data = {
        title: appointment.title,
        start: appointment.start,
        end: appointment.end,
        location: appointment.location,
        notes: appointment.notes,
        patient: appointment.patient.id,
        category: appointment.category.id,
      };
      setFormData(data);
    }
  }, [appointment]);

  const handleChange = (field: keyof AppointmentForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (handleValidation()) return;

    const updatedData = {
      ...formData,
      start: formatISO(new Date(formData.start)),
      end: formatISO(new Date(formData.end)),
    };
    console.log("submit: ", updatedData);
    if (onSubmit) onSubmit(updatedData);
    onOpenChange(false);
  };

  const handleValidation = () => {
    //  required fields check
    if (
      !formData.title ||
      !formData.start ||
      !formData.end ||
      !formData.location ||
      !formData.patient ||
      !formData.category
    ) {
      toast("Bitte füllen Sie alle Pflichtfelder aus.");
      return true;
    }

    // start should be before end
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (startDate > endDate) {
      toast("Die Startzeit darf nicht nach der Endzeit liegen.");
      return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {appointment ? "Termin bearbeiten" : "Neuer Termin erstellen"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Titel</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input
                type="datetime-local"
                value={formData.start}
                onChange={(e) => handleChange("start", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ende</Label>
              <Input
                type="datetime-local"
                value={formData.end}
                onChange={(e) => handleChange("end", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select
                value={formData.patient}
                onValueChange={(val) => handleChange("patient", val)}>
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => handleChange("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
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
          </div>

          <div className="space-y-2">
            <Label>Ort</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notizen</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSubmit} className="w-full font-semibold">
              {appointment ? "Speichern" : "Erstellen"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
