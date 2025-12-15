"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsModal } from "./TermsModal";
import { register } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";

    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain upper, lower case, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must accept terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
      console.log("Register payload:", payload);
      await register(payload);

      toast("Registration successful", {
        description: `Welcome, ${formData.firstName}!`,
      });

      router.push("/login");
    } catch (error: any) {
      console.log("Registration error:", error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({
          general: error.response?.data?.message || "Registration failed.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof RegisterFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
          field === "agreeToTerms" ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
      };

  return (
    <Card className="shadow-xl border-0">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field === "firstName" ? "First Name" : "Last Name"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id={field}
                    type="text"
                    placeholder={field === "firstName" ? "John" : "Doe"}
                    value={formData[field as keyof RegisterFormData] as string}
                    onChange={handleInputChange(
                      field as keyof RegisterFormData
                    )}
                    className={`pl-10 ${errors[field as keyof FormErrors] ? "border-red-500" : ""
                      }`}
                    disabled={isLoading}
                  />
                </div>
                {errors[field as keyof FormErrors] && (
                  <p className="text-sm text-red-600">
                    {errors[field as keyof FormErrors]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {[
            {
              label: "Password",
              id: "password",
              show: showPassword,
              toggle: setShowPassword,
            },
            {
              label: "Confirm Password",
              id: "confirmPassword",
              show: showConfirmPassword,
              toggle: setShowConfirmPassword,
            },
          ].map(({ label, id, show, toggle }) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id={id}
                  type={show ? "text" : "password"}
                  placeholder={label}
                  value={formData[id as keyof RegisterFormData] as string}
                  onChange={handleInputChange(id as keyof RegisterFormData)}
                  className={`pl-10 pr-10 ${errors[id as keyof FormErrors] ? "border-red-500" : ""
                    }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => toggle(!show)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors[id as keyof FormErrors] && (
                <p className="text-sm text-red-600">
                  {errors[id as keyof FormErrors]}
                </p>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms")({
                    target: { checked },
                  } as any)
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-600 leading-none"
              >
                I agree to the <TermsModal />
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isLoading || !formData.agreeToTerms} // 🔹 disabled if checkbox not checked
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

