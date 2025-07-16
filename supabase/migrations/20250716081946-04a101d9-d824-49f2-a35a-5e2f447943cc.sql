
-- Alter the existing employees table to match the code structure
ALTER TABLE public.employees 
RENAME COLUMN employee_number TO emp_num;

ALTER TABLE public.employees 
RENAME COLUMN phone TO phone_no;

-- Add any missing columns that might be expected by the code
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create an update trigger to automatically set updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON public.employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
