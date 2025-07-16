import { useState, useEffect } from "react";
import { Plus, Trash2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Employee {
  id?: string;
  name: string;
  email: string;
  emp_num: string;
  phone_no: string;
  created_at?: string;
  updated_at?: string;
}

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
  isLoading,
}: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emp_num: "",
    phone_no: "",
  });

  // Update form when editing employee changes
  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        email: editingEmployee.email,
        emp_num: editingEmployee.emp_num,
        phone_no: editingEmployee.phone_no,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        emp_num: "",
        phone_no: "",
      });
    }
  }, [editingEmployee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      onUpdateEmployee({
        ...editingEmployee,
        ...formData,
      });
    } else {
      onAddEmployee(formData);
    }
    
    // Clear form after submission
    setFormData({
      name: "",
      email: "",
      emp_num: "",
      phone_no: "",
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Employee Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Gmail ID</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emp_num">Employee Number</Label>
            <Input
              id="emp_num"
              value={formData.emp_num}
              onChange={(e) => handleInputChange("emp_num", e.target.value)}
              placeholder="Enter employee number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_no">Phone Number</Label>
            <Input
              id="phone_no"
              value={formData.phone_no}
              onChange={(e) => handleInputChange("phone_no", e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              {editingEmployee ? "Update Row" : "Add Row"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteSelected}
              disabled={selectedEmployees.length === 0 || isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Row
            </Button>

            <Button
              type="button"
              onClick={onSendEmail}
              disabled={selectedEmployees.length !== 1 || isLoading}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
