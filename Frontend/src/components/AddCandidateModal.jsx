import React, { useState } from "react";
import { X, User, Briefcase, Clock, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const AddCandidateModal = ({ isOpen, onClose, onSubmit, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState(initialData ? {
    name: initialData.name || "",
    role: initialData.role || "",
    experience: initialData.experience || "",
    resumeLink: initialData.resumeLink || ""
  } : {
    name: "",
    role: "",
    experience: "",
    resumeLink: ""
  });

  const [errors, setErrors] = useState({});

  
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        role: initialData.role || "",
        experience: initialData.experience || "",
        resumeLink: initialData.resumeLink || ""
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    
    if (!formData.experience) {
      newErrors.experience = "Experience is required";
    } else if (isNaN(formData.experience) || parseInt(formData.experience) < 0) {
      newErrors.experience = "Experience must be a valid number";
    }
    
    if (!formData.resumeLink.trim()) {
      newErrors.resumeLink = "Resume link is required";
    } else if (!isValidUrl(formData.resumeLink)) {
      newErrors.resumeLink = "Please enter a valid URL";
    }
    
    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      ...formData,
      experience: parseInt(formData.experience)
    });
    
    
    setFormData({
      name: "",
      role: "",
      experience: "",
      resumeLink: ""
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      name: "",
      role: "",
      experience: "",
      resumeLink: ""
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <Card className="relative w-full max-w-lg mx-4 p-8 bg-white shadow-2xl border-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Candidate' : 'Add New Candidate'}</h2>
            <p className="text-gray-600 mt-1">{isEdit ? 'Update the candidate details below' : 'Fill in the candidate details below'}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter candidate's full name"
              className={`h-12 text-lg border-2 ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Role
            </Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Frontend Developer"
              className={`h-12 text-lg border-2 ${errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"}`}
            />
            {errors.role && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.role}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Years of Experience
            </Label>
            <Input
              id="experience"
              name="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 3"
              className={`h-12 text-lg border-2 ${errors.experience ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"}`}
            />
            {errors.experience && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.experience}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeLink" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Resume Link
            </Label>
            <Input
              id="resumeLink"
              name="resumeLink"
              value={formData.resumeLink}
              onChange={handleInputChange}
              placeholder="https://example.com/resume.pdf"
              className={`h-12 text-lg border-2 ${errors.resumeLink ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"}`}
            />
            {errors.resumeLink && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.resumeLink}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {isEdit ? 'Save Changes' : 'Add Candidate'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCandidateModal;
