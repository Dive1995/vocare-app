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
import {
  Appointment,
  AppointmentForm,
  Category,
  PatientSearchResult,
} from "@/types/models";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { addHours, format, formatISO } from "date-fns";
import { toast } from "sonner";

type Props = {
  appointment?: Appointment | null;
  open: boolean;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: AppointmentForm) => void;
  onPatientSearch: (search: string) => void;
  patients: PatientSearchResult[];
  setPatients: Dispatch<SetStateAction<PatientSearchResult[]>>;
};

export default function AppointmentFormDialog({
  appointment,
  open,
  categories,
  onOpenChange,
  onPatientSearch,
  onSubmit,
  patients,
  setPatients,
}: Props) {
  const [formData, setFormData] = useState<AppointmentForm>({
    title: "",
    start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    location: "",
    notes: "",
    patient: "",
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const now = new Date();

  // seacrch user
  useEffect(() => {
    if (searchTerm.length > 1) {
      onPatientSearch(searchTerm);
    } else {
      setPatients([]);
    }
  }, [searchTerm]);

  // set form data
  useEffect(() => {
    if (appointment) {
      const data = {
        title: appointment.title,
        start: format(appointment.start, "yyyy-MM-dd'T'HH:mm"),
        end: format(appointment.end, "yyyy-MM-dd'T'HH:mm"),
        location: appointment.location,
        notes: appointment.notes,
        patient: appointment.patient.id,
        category: appointment.category.id,
      };
      setFormData(data);
    }
  }, [appointment]);

  // set patient when editing an appointment
  useEffect(() => {
    if (appointment?.patient) {
      setPatients((prev) => {
        const alreadyExists = prev.some((p) => p.id === appointment.patient.id);
        if (!alreadyExists) {
          return [...prev, appointment.patient];
        }
        return prev;
      });
    }
  }, [appointment]);

  // reset form on close
  useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        end: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        location: "",
        notes: "",
        patient: "",
        category: "",
      });
      setSearchTerm("");
      setPatients([]);
    }
  }, [open]);

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
    console.log(formData);
    //  required fields check
    if (
      !formData.title ||
      !formData.start ||
      !formData.end ||
      !formData.location ||
      !formData.patient ||
      !formData.category
    ) {
      toast.warning("Bitte füllen Sie alle Pflichtfelder aus.");
      return true;
    }

    // start should be before end
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (startDate > endDate) {
      toast.error("Die Startzeit darf nicht nach der Endzeit liegen.");
      return true;
    }

    // start and end must be on the same day
    if (
      startDate.getFullYear() !== endDate.getFullYear() ||
      startDate.getMonth() !== endDate.getMonth() ||
      startDate.getDate() !== endDate.getDate()
    ) {
      toast.error("Start und Endzeit müssen am selben Tag liegen.");
      return true;
    }

    // start time should be not in the past
    if (startDate < now || endDate < now) {
      toast.error(
        "Die Startzeit/Endzeit darf nicht in der Vergangenheit liegen."
      );
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
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                value={formData.start}
                onChange={(e) => handleChange("start", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ende</Label>
              <Input
                type="datetime-local"
                value={formData.end}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => handleChange("end", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            {/* patient search & select */}
            <div className="space-y-2">
              <Label>Patient suchen</Label>
              <Input
                placeholder="Name eingeben..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {(patients.length > 0 || appointment) && (
                <Select
                  value={formData.patient}
                  onValueChange={(val) => handleChange("patient", val)}>
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
