
import { useState } from "react";
import { Users, Search, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee } from "@/lib/supabase";

interface EmployeeTableProps {
  employees: Employee[];
  selectedEmployees: Employee[];
  onSelectionChange: (employees: Employee[]) => void;
  onEmployeeEdit: (employee: Employee) => void;
  isLoading: boolean;
}

const EmployeeTable = ({
  employees,
  selectedEmployees,
  onSelectionChange,
  onEmployeeEdit,
  isLoading
}: EmployeeTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.emp_num.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(sortedEmployees);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectEmployee = (employee: Employee, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedEmployees, employee]);
    } else {
      onSelectionChange(selectedEmployees.filter(emp => emp.id !== employee.id));
    }
  };

  const isSelected = (employee: Employee) => {
    return selectedEmployees.some(emp => emp.id === employee.id);
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Employee Database</h2>
            <p className="text-sm text-slate-500">
              {employees.length} employee{employees.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4">
                <Checkbox
                  checked={selectedEmployees.length === sortedEmployees.length && sortedEmployees.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:bg-slate-50 rounded transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:bg-slate-50 rounded transition-colors"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  Email
                  <SortIcon field="email" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:bg-slate-50 rounded transition-colors"
                onClick={() => handleSort('emp_num')}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  Employee #
                  <SortIcon field="emp_num" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:bg-slate-50 rounded transition-colors"
                onClick={() => handleSort('phone_no')}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  Phone
                  <SortIcon field="phone_no" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-500">
                  No employees found. Add your first employee to get started.
                </td>
              </tr>
            ) : (
              sortedEmployees.map((employee, index) => (
                <tr 
                  key={employee.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                  }`}
                  onClick={() => onEmployeeEdit(employee)}
                >
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(employee)}
                      onCheckedChange={(checked) => handleSelectEmployee(employee, checked as boolean)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{employee.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-600">{employee.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-600">{employee.emp_num}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-600">{employee.phone_no}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-slate-600">Active</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedEmployees.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
