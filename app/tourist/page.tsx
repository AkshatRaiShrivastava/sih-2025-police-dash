"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, IdCard, User2, Plus, PhoneCall } from "lucide-react";
import Image from "next/image";

type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

const contacts: EmergencyContact[] = [
  { id: "1", name: "John Doe", relation: "Brother", phone: "+91 9876543210" },
  { id: "2", name: "Jane Smith", relation: "Friend", phone: "+91 8765432109" },
];

export default function TouristDashboard() {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <header className="mb-4 md:mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tourist Data</h1>
        <p className="text-muted-foreground">Overview of personal details and emergency settings</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="grid gap-4">
              <InfoRow icon={<User2 className="h-4 w-4 text-primary" />} label="Name" value="akshat" />
              <InfoRow icon={<Mail className="h-4 w-4 text-primary" />} label="Email" value="abcd@gmail.com" />
              <InfoRow icon={<Phone className="h-4 w-4 text-primary" />} label="Mobile" value="0123456789" />
              <InfoRow icon={<IdCard className="h-4 w-4 text-primary" />} label="ID Number" value="0123456789" />
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-6" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Emergency Contacts</h2>
        <Card>
          <CardContent className="p-4 md:p-6 space-y-3">
            {contacts.map((c) => (
              <ContactItem key={c.id} contact={c} />
            ))}

            <div className="pt-1">
              <Button variant="outline" className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-6" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Location Sharing</p>
                <p className="text-sm text-muted-foreground">Share location with emergency contacts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </span>
        <span className="text-sm text-muted-foreground">{label}:</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function ContactItem({ contact }: { contact: EmergencyContact }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/30 p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary">
            {contact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-tight">{contact.name}</p>
          <p className="text-xs text-muted-foreground">
            {contact.relation} • {contact.phone}
          </p>
        </div>
      </div>
      <Button size="icon" variant="ghost" aria-label={`Call ${contact.name}`}>
        <PhoneCall className="h-5 w-5" />
      </Button>
    </div>
  );
}


