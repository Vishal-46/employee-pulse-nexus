
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeTable from "@/components/EmployeeTable";
import { supabase } from "@/integrations/supabase/client";

// Updated Employee interface to match the database schema
interface Employee {
  id?: string;
  name: string;
  email: string;
  emp_num: string;
  phone_no: string;
  created_at?: string;
  updated_at?: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load employees from Supabase
  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employees. Please check your Supabase configuration.",
          variant: "destructive",
        });
        return;
      }

      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to database. Please ensure Supabase is configured.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();

    // Set up real-time subscription
    const subscription = supabase
      .channel('employees_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employees' },
        (payload) => {
          console.log('Real-time update:', payload);
          loadEmployees(); // Refresh the list
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAddEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (error) {
        console.error('Error adding employee:', error);
        toast({
          title: "Error",
          description: "Failed to add employee. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Employee added successfully!",
      });

      // Reset editing state
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = async (employee: Employee) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('employees')
        .update({
          name: employee.name,
          email: employee.email,
          emp_num: employee.emp_num,
          phone_no: employee.phone_no,
          updated_at: new Date().toISOString()
        })
        .eq('id', employee.id);

      if (error) {
        console.error('Error updating employee:', error);
        toast({
          title: "Error",
          description: "Failed to update employee. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Employee updated successfully!",
      });

      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEmployees.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedEmployees.length} employee${selectedEmployees.length !== 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      const ids = selectedEmployees.map(emp => emp.id).filter(Boolean);
      
      const { error } = await supabase
        .from('employees')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('Error deleting employees:', error);
        toast({
          title: "Error",
          description: "Failed to delete employees. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${selectedEmployees.length} employee${selectedEmployees.length !== 1 ? 's' : ''} deleted successfully!`,
      });

      setSelectedEmployees([]);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error deleting employees:', error);
      toast({
        title: "Error",
        description: "Failed to delete employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (selectedEmployees.length !== 1) {
      toast({
        title: "Selection Error",
        description: "Please select exactly one employee to send email.",
        variant: "destructive",
      });
      return;
    }

    const employee = selectedEmployees[0];
    const webhookUrl = "https://vishalarcadia6.app.n8n.cloud/webhook/send-mail";

    try {
      setIsLoading(true);
      console.log("Sending email via n8n webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS
        body: JSON.stringify({
          name: employee.name,
          email: employee.email,
          emp_num: employee.emp_num,
          phone_no: employee.phone_no,
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      // Since we're using no-cors, we can't check response status
      toast({
        title: "Email Sent",
        description: `Email request sent for ${employee.name}. Please check your n8n workflow to confirm delivery.`,
      });

      console.log("Email webhook triggered successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please check the webhook URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-8rem)]">
        {/* Left Panel - Employee Form (40%) */}
        <div className="lg:col-span-2">
          <EmployeeForm
            onAddEmployee={handleAddEmployee}
            onDeleteSelected={handleDeleteSelected}
            onSendEmail={handleSendEmail}
            selectedEmployees={selectedEmployees}
            editingEmployee={editingEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            isLoading={isLoading}
          />
        </div>

        {/* Right Panel - Employee Table (60%) */}
        <div className="lg:col-span-3">
          <EmployeeTable
            employees={employees}
            selectedEmployees={selectedEmployees}
            onSelectionChange={setSelectedEmployees}
            onEmployeeEdit={handleEmployeeEdit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Employees;
