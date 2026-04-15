import Input from "./Input";
import { Search, Mail, Lock } from "lucide-react";

export default function TestInputs() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-surface min-h-screen">
      
      {/* Default */}
      <Input label="Company" placeholder="Enter company name" />

      {/* With ID (for accessibility) */}
      <Input
        id="position"
        label="Position"
        placeholder="Frontend Developer"
      />

      {/* Error State */}
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@email.com"
        error="Invalid email address"
      />

      {/* Disabled */}
      <Input
        label="Disabled Field"
        placeholder="Can't type here"
        disabled
      />

      {/* Sizes */}
      <div className="flex flex-col gap-3">
        <Input label="Small" size="sm" placeholder="Small input" />
        <Input label="Medium" size="md" placeholder="Medium input" />
        <Input label="Large" size="lg" placeholder="Large input" />
      </div>

      {/* Start Icon */}
      <Input
        label="Search"
        placeholder="Search jobs..."
        startIcon={<Search size={16} />}
      />

      {/* End Icon */}
      <Input
        label="Email with icon"
        type="email"
        placeholder="Enter email"
        endIcon={<Mail size={16} />}
      />

      {/* Password */}
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter password"
      />

      {/* Password + Error */}
      <Input
        id="password-error"
        label="Password"
        type="password"
        placeholder="Enter password"
        error="Password must be at least 8 characters"
      />

      {/* Start + Password (edge case) */}
      <Input
        label="Secure Field"
        type="password"
        placeholder="With icon"
        startIcon={<Lock size={16} />}
      />

      {/* Number */}
      <Input
        label="Salary Expectation"
        type="number"
        placeholder="50000"
      />

      {/* Search Type */}
      <Input
        label="Search Applications"
        type="search"
        placeholder="Search..."
        startIcon={<Search size={16} />}
      />

      <div className="grid grid-cols-2 gap-4">
  <Input label="Company" placeholder="Company" />
  <Input label="Position" placeholder="Role" />
</div>

    </div>
  );
}