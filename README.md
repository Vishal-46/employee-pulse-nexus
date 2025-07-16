
# Employee Management System

A modern, full-featured Employee Management System built with React, Supabase, and n8n integration. Features a split-screen interface with real-time updates, email automation, and comprehensive CRUD operations.

## Features

### 🎯 Core Functionality
- **Dashboard**: Overview with employee statistics and quick actions
- **Employee Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Real-time Updates**: Live data synchronization using Supabase subscriptions
- **Email Integration**: Send emails via n8n webhook automation
- **Search & Filter**: Advanced table search and sorting capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 UI/UX Features
- **Split-screen Layout**: Form on left (40%), table on right (60%)
- **Sidebar Navigation**: Clean, collapsible sidebar with active state indicators
- **Modern Design**: Warm color scheme with blue-purple gradients
- **Professional Styling**: Rounded corners, subtle shadows, and smooth transitions
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Skeleton loaders and loading indicators throughout
- **Toast Notifications**: Success and error feedback for all actions

### 🔧 Technical Features
- **React 18** with TypeScript
- **Supabase** for backend and real-time database
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **n8n Webhook** integration for email automation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- n8n instance (optional, for email functionality)

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd employee-management-system
npm install
```

### 2. Supabase Setup

#### Create a new Supabase project:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Create the employees table:
```sql
-- Create employees table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  emp_num VARCHAR(50) NOT NULL UNIQUE,
  phone_no VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on employees" ON employees
  FOR ALL USING (true);
```

#### Configure environment:
Update `src/lib/supabase.ts` with your Supabase credentials:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. n8n Webhook Setup (Optional)

If you want to use the email functionality:

1. Set up an n8n instance (cloud or self-hosted)
2. Create a workflow with a webhook trigger
3. Configure the webhook URL in the app (currently set to: `https://vishalarcadia6.app.n8n.cloud/webhook/send-mail`)
4. Set up email sending logic in your n8n workflow

### 4. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── AppSidebar.tsx     # Sidebar navigation
│   ├── EmployeeForm.tsx   # Employee input form
│   ├── EmployeeTable.tsx  # Employee data table
│   └── Layout.tsx         # Main layout wrapper
├── pages/
│   ├── Dashboard.tsx      # Dashboard page
│   ├── Employees.tsx      # Employee management page
│   └── NotFound.tsx       # 404 page
├── lib/
│   └── supabase.ts        # Supabase client and types
├── hooks/
│   └── use-toast.ts       # Toast hook
├── App.tsx                # Main app component
└── main.tsx              # App entry point
```

## Usage Guide

### Adding Employees
1. Navigate to the Employees page
2. Fill out the form on the left panel
3. Click "Add Row" to save the employee

### Editing Employees
1. Click on any row in the employee table
2. The form will populate with the employee's data
3. Make changes and click "Update Employee"

### Deleting Employees
1. Select employees using the checkboxes
2. Click "Delete Row" button
3. Confirm the deletion in the dialog

### Sending Emails
1. Select exactly one employee
2. Click "Send Email" button
3. The n8n webhook will be triggered with employee data

### Search and Sorting
- Use the search box to filter employees
- Click column headers to sort
- Select all employees with the header checkbox

## Configuration

### Database Schema
The `employees` table includes:
- `id`: Primary key (auto-increment)
- `name`: Employee full name
- `email`: Email address (unique)
- `emp_num`: Employee number (unique)
- `phone_no`: Phone number
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Webhook Payload
The n8n webhook receives:
```json
{
  "name": "Employee Name",
  "email": "email@example.com",
  "emp_num": "EMP001",
  "phone_no": "+1234567890",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "triggered_from": "http://localhost:8080"
}
```

## Customization

### Colors and Styling
The app uses a warm color scheme defined in Tailwind classes:
- Primary: Blue to purple gradients (`from-blue-500 to-purple-600`)
- Success: Green (`from-green-500 to-green-600`)
- Error/Delete: Coral/Red (`from-red-400 to-red-500`)
- Background: Light slate (`bg-slate-50`)

### Adding New Fields
To add new employee fields:
1. Update the database schema
2. Modify the `Employee` interface in `src/lib/supabase.ts`
3. Add form fields in `EmployeeForm.tsx`
4. Add table columns in `EmployeeTable.tsx`

## Troubleshooting

### Common Issues

1. **"Failed to load employees"**
   - Check Supabase URL and API key in `src/lib/supabase.ts`
   - Verify the employees table exists
   - Check Row Level Security policies

2. **"Email sending failed"**
   - Verify n8n webhook URL is correct
   - Check n8n workflow is active
   - Review browser console for CORS issues

3. **Real-time updates not working**
   - Ensure Supabase real-time is enabled for your table
   - Check browser console for subscription errors

### Development Tips
- Enable browser developer tools to see console logs
- Check Supabase dashboard for database issues
- Use n8n execution logs to debug webhook issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
