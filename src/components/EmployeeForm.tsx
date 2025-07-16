
import { useState } from "react";
import { User, Mail, Hash, Phone, UserPlus, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/lib/supabase";

interface EmployeeFormProps {
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onDeleteSelected: () => void;
  onSendEmail: () => void;
  selectedEmployees: Employee[];
  editingEmployee: Employee | null;
  onUpdateEmployee: (employee: Employee) => void;
  isLoading: boolean;
}

const EmployeeForm = ({ 
  onAddEmployee, 
  onDeleteSelected, 
  onSendEmail, 
  selectedEmployees, 
  editingEmployee,
  onUpdateEmployee,
  isLoading 
}: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    emp_num: '',
    phone_no: ''
  });
  const { toast } = useToast();

  // Update form when editing employee changes
  useState(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        email: editingEmployee.email,
        emp_num: editingEmployee.emp_num,
        phone_no: editingEmployee.phone_no
      });
    }
  }, [editingEmployee]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Valid email is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.emp_num.trim()) {
      toast({
        title: "Validation Error",
        description: "Employee number is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.phone_no.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingEmployee) {
      onUpdateEmployee({
        ...editingEmployee,
        ...formData
      });
    } else {
      onAddEmployee(formData);
    }
    
    setFormData({
      name: '',
      email: '',
      emp_num: '',
      phone_no: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Employee Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">Gmail ID</Label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emp_num" className="text-slate-700 font-medium">Employee Number</Label>
          <div className="relative">
            <Hash className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <Input
              id="emp_num"
              type="text"
              placeholder="EMP001"
              value={formData.emp_num}
              onChange={(e) => handleInputChange('emp_num', e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_no" className="text-slate-700 font-medium">Phone Number</Label>
          <div className="relative">
            <Phone className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <Input
              id="phone_no"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone_no}
              onChange={(e) => handleInputChange('phone_no', e.target.value)}
              className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {editingEmployee ? 'Update Employee' : 'Add Row'}
          </Button>

          <Button 
            type="button"
            onClick={onDeleteSelected}
            disabled={selectedEmployees.length === 0 || isLoading}
            className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Row ({selectedEmployees.length})
          </Button>

          <Button 
            type="button"
            onClick={onSendEmail}
            disabled={selectedEmployees.length !== 1 || isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Email
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
