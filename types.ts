
export type InputType = 'text' | 'select';

export interface FieldConfig {
  id: string;
  label: string;
  type: InputType;
  options?: string[];
  // نحدد مصفوفة الصفحات التي يظهر فيها هذا الحقل
  belongsTo: ('new_customers' | 'idle_customers')[];
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'staff';
  permissions: Record<string, boolean>; 
}

export interface CallLog {
  id: string;
  date: string;
  summary: string;
  contactPerson: string;
  notes: string;
}

export interface Customer {
  id: string;
  type: 'new' | 'idle';
  merchantData: Record<string, any>;
  callHistory: CallLog[];
  quotation: {
    priceProvided: boolean;
    priceDetails: string;
    nextReminder: string;
    requiredAction: string;
  };
  createdAt: string;
}

export type PageView = 'login' | 'welcome' | 'new_customers' | 'idle_customers' | 'system_settings' | 'users' | 'permissions';
export type CustomerView = 'entry' | 'dashboard' | 'stats' | 'config';
