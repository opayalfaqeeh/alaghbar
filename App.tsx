
import React, { useState } from 'react';
import { 
  UserPlus, Settings, LayoutDashboard, LogOut, Home, ShieldCheck, 
  UserCog, BarChart3, PlusCircle, Clock, Trash2, PhoneCall, Save, 
  CheckCircle2, XCircle, ChevronLeft, Layout, List
} from 'lucide-react';
import { Customer, UserAccount, PageView, CustomerView, FieldConfig, InputType } from './types';

const PERMISSION_STRUCTURE = [
  { id: 'new_customers', label: 'عملاء جدد', sub: ['entry', 'dashboard', 'stats', 'config'] },
  { id: 'idle_customers', label: 'عملاء خاملين', sub: ['entry', 'dashboard', 'stats', 'config'] },
  { id: 'admin_tools', label: 'أدوات الإدارة', sub: ['system_settings', 'permissions', 'users'] }
];

const INITIAL_FIELDS: FieldConfig[] = [
  { id: 'storeName', label: 'اسم المتجر', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
  { id: 'merchantName', label: 'اسم التاجر', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
  { id: 'phone', label: 'رقم الهاتف', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
  { id: 'area', label: 'المنطقة', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
  { id: 'accessMethod', label: 'طريقة الوصول', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
  { id: 'accessSide', label: 'طرف الوصول', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
  { id: 'notes', label: 'ملاحظات', type: 'text', belongsTo: ['new_customers', 'idle_customers'] },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [view, setView] = useState<PageView>('login');
  const [customerType, setCustomerType] = useState<'new' | 'idle' | null>(null);
  const [customerView, setCustomerView] = useState<CustomerView>('entry');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fields, setFields] = useState<FieldConfig[]>(INITIAL_FIELDS);
  const [users, setUsers] = useState<UserAccount[]>([
    { id: '1', username: 'opay', password: '0000', role: 'admin', permissions: {} }
  ]);

  const hasPermission = (perm: string) => currentUser?.role === 'admin' || currentUser?.permissions[perm];

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = users.find(u => u.username === formData.get('username') && u.password === formData.get('password'));
    if (user) {
      setCurrentUser(user);
      setView('welcome');
    } else {
      alert('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  if (view === 'login') return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-right" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col fixed h-full shadow-2xl z-30">
        <div className="p-8 text-center border-b border-slate-800">
          <h1 className="text-xl font-black text-blue-400">شركة الاغبر</h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">للشحن الدولي</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem active={view === 'welcome'} onClick={() => { setView('welcome'); setCustomerType(null); }} icon={<Home size={20}/>} label="الرئيسية" />
          
          <div className="pt-6 pb-2 px-4 text-[10px] text-slate-500 font-bold uppercase border-t border-slate-800 mt-4">العملاء</div>
          <NavItem active={customerType === 'new'} onClick={() => { setView('new_customers'); setCustomerType('new'); setCustomerView('entry'); }} icon={<UserPlus size={20}/>} label="عملاء جدد" />
          <NavItem active={customerType === 'idle'} onClick={() => { setView('idle_customers'); setCustomerType('idle'); setCustomerView('entry'); }} icon={<Clock size={20}/>} label="عملاء خاملين" />

          <div className="pt-6 pb-2 px-4 text-[10px] text-slate-500 font-bold uppercase border-t border-slate-800 mt-4">إدارة النظام</div>
          <NavItem active={view === 'system_settings'} onClick={() => setView('system_settings')} icon={<Layout size={20}/>} label="إعدادات النظام" />
          <NavItem active={view === 'permissions'} onClick={() => setView('permissions')} icon={<ShieldCheck size={20}/>} label="إمكانية الوصول" />
          <NavItem active={view === 'users'} onClick={() => setView('users')} icon={<UserCog size={20}/>} label="إعدادات الحساب" />
        </nav>

        <button onClick={() => { setCurrentUser(null); setView('login'); }} className="m-4 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold">
          <LogOut size={20} />
          <span>خروج من النظام</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="mr-72 flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b h-20 flex items-center justify-between px-10 shrink-0 shadow-sm z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
              {currentUser?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 leading-tight">أهلاً يا {currentUser?.username}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{currentUser?.role === 'admin' ? 'مدير عام' : 'مؤسس فريق'}</p>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
            <span className="text-slate-400 text-xs font-black">شركة الاغبر للشحن الدولي &copy; 2024</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#f1f5f9]">
          {view === 'welcome' && <WelcomeScreen username={currentUser?.username || ''} onSelect={(t) => { setCustomerType(t); setView(t === 'new' ? 'new_customers' : 'idle_customers'); }} />}
          
          {(view === 'new_customers' || view === 'idle_customers') && (
            <CustomerModule 
              type={customerType!} 
              currentView={customerView} 
              onViewChange={setCustomerView} 
              customers={customers}
              setCustomers={setCustomers}
              fields={fields}
            />
          )}

          {view === 'system_settings' && <SystemSettingsView fields={fields} setFields={setFields} />}
          {view === 'permissions' && <PermissionsPage users={users} setUsers={setUsers} />}
          {view === 'users' && <UserManagement users={users} setUsers={setUsers} />}
        </div>
      </main>
    </div>
  );
};

// --- Components ---

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {icon} <span className="font-bold text-sm">{label}</span>
  </button>
);

const LoginPage = ({ onLogin }: { onLogin: (e: React.FormEvent<HTMLFormElement>) => void }) => (
  <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6" dir="rtl">
    <div className="bg-white p-12 rounded-[50px] shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900">شركة الاغبر</h1>
        <p className="text-blue-600 font-black text-sm mt-2 tracking-widest">للشحن الدولي</p>
      </div>
      <form onSubmit={onLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 mr-2">اسم المستخدم</label>
          <input name="username" type="text" required defaultValue="opay" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 mr-2">كلمة المرور</label>
          <input name="password" type="password" required defaultValue="0000" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-bold" />
        </div>
        <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-blue-600 transition shadow-xl mt-4">دخول للنظام</button>
      </form>
    </div>
  </div>
);

const WelcomeScreen = ({ username, onSelect }: any) => (
  <div className="max-w-4xl mx-auto py-20 text-center animate-fadeIn">
    <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">أهلاً يا <span className="text-blue-600">{username}</span></h2>
    <div className="grid grid-cols-2 gap-10 mt-16">
      <WelcomeCard title="عملاء جدد" desc="إدخال ومتابعة التجار الجدد" icon={<UserPlus size={40}/>} color="blue" onClick={() => onSelect('new')} />
      <WelcomeCard title="عملاء خاملين" desc="تنشيط التجار المتوقفين" icon={<Clock size={40}/>} color="amber" onClick={() => onSelect('idle')} />
    </div>
  </div>
);

const WelcomeCard = ({ title, desc, icon, color, onClick }: any) => (
  <button onClick={onClick} className={`group bg-white p-12 rounded-[40px] shadow-lg hover:shadow-2xl border-4 border-transparent hover:border-${color}-500 transition-all text-center`}>
    <div className={`w-24 h-24 bg-${color}-50 text-${color}-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition`}>{icon}</div>
    <h3 className="text-2xl font-black text-slate-800">{title}</h3>
    <p className="text-slate-400 mt-3 font-bold">{desc}</p>
  </button>
);

// --- System Settings View (Managed Pages) ---

const SystemSettingsView = ({ fields, setFields }: any) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const pages = [
    { id: 'new_customers', label: 'عملاء جدد', icon: <UserPlus /> },
    { id: 'idle_customers', label: 'عملاء خاملين', icon: <Clock /> }
  ];

  const removeFieldFromPage = (fieldId: string) => {
    setFields(fields.map((f: any) => {
      if (f.id === fieldId) {
        return { ...f, belongsTo: f.belongsTo.filter((p: string) => p !== selectedPage) };
      }
      return f;
    }));
  };

  const updateFieldLabel = (fieldId: string, newLabel: string) => {
    setFields(fields.map((f: any) => f.id === fieldId ? { ...f, label: newLabel } : f));
  };

  if (selectedPage) {
    const pageData = pages.find(p => p.id === selectedPage);
    const pageFields = fields.filter((f: any) => f.belongsTo.includes(selectedPage as any));

    return (
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-[40px] shadow-xl border animate-fadeIn">
        <button onClick={() => setSelectedPage(null)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black mb-8 transition">
          <ChevronLeft size={20} /> العودة لقائمة الصفحات
        </button>
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">{pageData?.icon}</div>
          <h2 className="text-3xl font-black text-slate-900">إدارة مدخلات صفحة: {pageData?.label}</h2>
        </div>

        <div className="space-y-4">
          {pageFields.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={f.label} 
                  onChange={(e) => updateFieldLabel(f.id, e.target.value)}
                  className="bg-transparent font-black text-slate-800 text-lg outline-none border-b-2 border-transparent focus:border-blue-500 w-fit" 
                />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">المعرف البرمجي: {f.id}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-white border rounded-xl text-xs font-black text-slate-500">{f.type === 'text' ? 'حقل نصي' : 'قائمة منسدلة'}</span>
                <button onClick={() => removeFieldFromPage(f.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100">
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>
          ))}
          <button className="w-full py-8 border-4 border-dashed border-slate-100 rounded-[35px] text-slate-300 font-black hover:border-blue-200 hover:text-blue-500 transition-all flex items-center justify-center gap-3">
            <PlusCircle /> إضافة حقل جديد لهذه الصفحة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 animate-fadeIn">
      <h2 className="text-4xl font-black text-slate-900 mb-2">إعدادات النظام</h2>
      <p className="text-slate-400 font-bold mb-12">اختر الصفحة التي تريد تعديل تصميمها ومدخلاتها</p>
      <div className="grid grid-cols-2 gap-8">
        {pages.map(p => (
          <button key={p.id} onClick={() => setSelectedPage(p.id)} className="bg-white p-10 rounded-[40px] shadow-sm border hover:shadow-xl hover:border-blue-500 transition-all flex flex-col items-center group">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[25px] flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
              {React.cloneElement(p.icon as React.ReactElement, { size: 40 })}
            </div>
            <h3 className="text-2xl font-black text-slate-800">صفحة {p.label}</h3>
            <p className="text-slate-400 mt-2 font-bold">إدارة الحقول والتصميم</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Customer Module with Stages ---

const CustomerModule = ({ type, currentView, onViewChange, customers, setCustomers, fields }: any) => {
  const filtered = customers.filter((c: any) => c.type === type);
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-900">{type === 'new' ? 'عملاء جدد' : 'عملاء خاملين'}</h2>
          <p className="text-slate-400 mt-1 font-bold">شركة الاغبر للشحن الدولي</p>
        </div>
        <div className="flex bg-slate-200 p-1.5 rounded-2xl shadow-inner">
          <TabBtn active={currentView === 'entry'} onClick={() => onViewChange('entry')} label="إدخال البيانات" icon={<PlusCircle size={18}/>} />
          <TabBtn active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} label="لوحة التحكم" icon={<LayoutDashboard size={18}/>} />
          <TabBtn active={currentView === 'stats'} onClick={() => onViewChange('stats')} label="الإحصائيات" icon={<BarChart3 size={18}/>} />
          <TabBtn active={currentView === 'config'} onClick={() => onViewChange('config')} label="الإعدادات" icon={<Settings size={18}/>} />
        </div>
      </div>

      <div className="min-h-[600px]">
        {currentView === 'entry' && <DataEntryForm type={type} fields={fields} onSubmit={(d: any) => setCustomers([...customers, d])} />}
        {currentView === 'dashboard' && <CustomerDashboard customers={filtered} />}
      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, label, icon }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black transition ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
    {icon} <span>{label}</span>
  </button>
);

const DataEntryForm = ({ type, fields, onSubmit }: any) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({ 
    id: Math.random().toString(), 
    type, 
    merchantData: {}, 
    quotation: { priceProvided: false } 
  });

  const stages = [
    { id: 1, label: 'تسجيل بيانات التاجر' },
    { id: 2, label: 'ما دار بالمكالمة' },
    { id: 3, label: 'عرض السعر والإجراء المطلوب' }
  ];

  const pageKey = type === 'new' ? 'new_customers' : 'idle_customers';
  const visibleFields = fields.filter((f: any) => f.belongsTo.includes(pageKey));

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden animate-zoomIn">
      {/* Clickable Stages */}
      <div className="flex bg-slate-50 border-b overflow-hidden">
        {stages.map((s) => (
          <button 
            key={s.id} 
            onClick={() => setStep(s.id)}
            className={`flex-1 py-8 px-4 text-center transition-all relative ${step === s.id ? 'bg-white text-blue-600 font-black' : 'text-slate-400 font-bold hover:bg-slate-100'}`}
          >
            <span className="block text-[10px] opacity-50 mb-1 tracking-widest uppercase">المرحلة {s.id}</span>
            <span className="text-sm md:text-base">{s.label}</span>
            {step === s.id && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600 animate-slideIn"></div>}
          </button>
        ))}
      </div>

      <div className="p-12 min-h-[480px]">
        {step === 1 && (
          <div className="grid grid-cols-2 gap-8 animate-fadeIn">
            {visibleFields.map((f: any) => (
              <div key={f.id} className="space-y-2">
                <label className="text-sm font-black text-slate-700 mr-1">{f.label}</label>
                <input 
                  type="text" 
                  onChange={e => setData({...data, merchantData: {...data.merchantData, [f.id]: e.target.value}})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition font-bold" 
                  placeholder={`أدخل ${f.label}`}
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700">تاريخ المكالمة</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700">طرف التواصل</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 border rounded-2xl font-bold" placeholder="من الطرف الذي تم التواصل معه؟" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700">ملخص المكالمة (ما دار بالمكالمة)</label>
              <textarea className="w-full px-6 py-4 bg-slate-50 border rounded-2xl h-44 font-bold outline-none focus:border-blue-500" placeholder="اكتب تفاصيل المكالمة هنا..."></textarea>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black text-blue-900">هل تم تقديم عرض سعر؟</h4>
                <p className="text-blue-600 font-bold text-xs">قم بتحديد الخيار إذا تم إرسال الأسعار للتاجر</p>
              </div>
              <input 
                type="checkbox" 
                checked={data.quotation.priceProvided}
                onChange={e => setData({...data, quotation: {...data.quotation, priceProvided: e.target.checked}})}
                className="w-8 h-8 rounded-xl border-blue-300 text-blue-600" 
              />
            </div>
            {data.quotation.priceProvided && (
              <div className="space-y-2 animate-slideIn">
                <label className="text-sm font-black text-slate-700">توضيح ما تم تقديمه</label>
                <textarea className="w-full px-6 py-4 border-2 border-slate-100 rounded-3xl h-32 font-bold outline-none focus:border-blue-500" placeholder="اكتب تفاصيل العرض..."></textarea>
              </div>
            )}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700">موعد التنبيه القادم</label>
                <input type="date" className="w-full px-6 py-4 border rounded-2xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700">الإجراء المطلوب</label>
                <input type="text" className="w-full px-6 py-4 border rounded-2xl font-bold" placeholder="مثلاً: بانتظار الرد، معاودة الاتصال" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-slate-50 border-t flex justify-between">
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-12 py-4 rounded-2xl font-black bg-white border border-slate-200 text-slate-400 disabled:opacity-30 transition">السابق</button>
        {step < 3 ? (
          <button onClick={() => setStep(s => Math.min(3, s + 1))} className="px-12 py-4 rounded-2xl font-black bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition">التالي</button>
        ) : (
          <button onClick={() => { onSubmit(data); alert('تم حفظ البيانات بنجاح في شركة الاغبر'); setStep(1); }} className="px-12 py-4 rounded-2xl font-black bg-green-600 text-white shadow-xl flex items-center gap-2 hover:bg-green-700 transition">
            <Save size={20}/> إتمام الحفظ
          </button>
        )}
      </div>
    </div>
  );
};

// --- Permissions & Users ---

const PermissionsPage = ({ users, setUsers }: any) => {
  const toggle = (userId: string, key: string) => {
    setUsers(users.map((u: any) => {
      if(u.id === userId) {
        return { ...u, permissions: { ...u.permissions, [key]: !u.permissions[key] } };
      }
      return u;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-12 rounded-[40px] shadow-xl border animate-fadeIn">
      <h2 className="text-3xl font-black text-slate-900 mb-2">إدارة الصلاحيات التفصيلية</h2>
      <p className="text-slate-400 font-bold mb-10">تحكم بمدى وصول كل حساب لكل جزء من أجزاء النظام</p>
      <div className="overflow-x-auto rounded-3xl border overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-[#0f172a] text-white">
              <th className="p-6 font-black border-l border-slate-700">الموظف</th>
              {PERMISSION_STRUCTURE.map(p => (
                <th key={p.id} className="p-6 font-black text-center border-l border-slate-700" colSpan={p.sub.length}>{p.label}</th>
              ))}
            </tr>
            <tr className="bg-slate-100">
              <th className="p-3 border"></th>
              {PERMISSION_STRUCTURE.flatMap(p => p.sub.map(s => (
                <th key={`${p.id}_${s}`} className="p-4 border text-[10px] font-black uppercase text-slate-500 text-center min-w-[80px]">
                  {s === 'entry' ? 'إدخال' : s === 'dashboard' ? 'لوحة' : s === 'stats' ? 'إحصاء' : 'إعداد'}
                </th>
              )))}
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="p-6 border font-black text-slate-800 bg-slate-50/50">{u.username}</td>
                {PERMISSION_STRUCTURE.flatMap(p => p.sub.map(s => {
                  const key = `${p.id}_${s}`;
                  return (
                    <td key={key} className="p-4 border text-center">
                      <input 
                        type="checkbox" 
                        checked={u.role === 'admin' || u.permissions[key]} 
                        onChange={() => toggle(u.id, key)}
                        disabled={u.role === 'admin'}
                        className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 transition cursor-pointer" 
                      />
                    </td>
                  );
                }))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers }: any) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'staff' as const, perms: {} as any });

  const addUser = () => {
    if(!newUser.username || !newUser.password) return;
    setUsers([...users, { id: Math.random().toString(), username: newUser.username, password: newUser.password, role: newUser.role, permissions: newUser.perms }]);
    setModalOpen(false);
    setNewUser({ username: '', password: '', role: 'staff', perms: {} });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">إعدادات حسابات الموظفين</h2>
          <p className="text-slate-400 font-bold">إدارة فريق مبيعات شركة الاغبر</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition">
          <PlusCircle size={20}/> إضافة موظف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((u: any) => (
          <div key={u.id} className="bg-white p-6 rounded-3xl border flex items-center justify-between shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-2xl border">{u.username[0].toUpperCase()}</div>
               <div>
                  <h4 className="font-black text-slate-800 text-xl">{u.username}</h4>
                  <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{u.role === 'admin' ? 'مدير عام' : 'موظف مبيعات'}</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="px-6 py-2.5 rounded-xl font-bold bg-slate-50 text-slate-600 border hover:bg-slate-100 transition">تعديل</button>
               <button className="px-6 py-2.5 rounded-xl font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition">حذف</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-zoomIn">
              <div className="p-8 border-b bg-white flex justify-between items-center">
                 <h3 className="text-2xl font-black text-slate-900">إضافة حساب موظف جديد</h3>
                 <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><XCircle size={28} className="text-slate-300" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-sm font-black text-slate-700">اسم المستخدم</label>
                       <input type="text" onChange={e => setNewUser({...newUser, username: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="مثلاً: ahmed_oghbar" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-black text-slate-700">كلمة السر</label>
                       <input type="password" onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="••••••••" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-lg font-black text-blue-600 border-b pb-2">تحديد صلاحيات الوصول الفورية</h4>
                    <div className="grid grid-cols-2 gap-10">
                       {PERMISSION_STRUCTURE.map(p => (
                         <div key={p.id} className="space-y-4">
                            <h5 className="font-black text-slate-800 bg-slate-50 p-4 rounded-2xl flex items-center gap-2">
                              <ShieldCheck size={18} className="text-blue-500"/> {p.label}
                            </h5>
                            <div className="grid grid-cols-2 gap-4 mr-6">
                               {p.sub.map(s => {
                                 const key = `${p.id}_${s}`;
                                 return (
                                   <label key={key} className="flex items-center gap-3 cursor-pointer group p-2 rounded-xl hover:bg-blue-50 transition">
                                      <input 
                                        type="checkbox" 
                                        onChange={() => setNewUser({ ...newUser, perms: { ...newUser.perms, [key]: !newUser.perms[key] } })}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 transition" 
                                      />
                                      <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700 transition">
                                        {s === 'entry' ? 'إدخال بيانات' : s === 'dashboard' ? 'لوحة تحكم' : s === 'stats' ? 'إحصائيات' : 'إعدادات'}
                                      </span>
                                   </label>
                                 );
                               })}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-8 border-t bg-slate-50 flex justify-end gap-4">
                 <button onClick={() => setModalOpen(false)} className="px-10 py-4 rounded-2xl font-black border text-slate-600 hover:bg-white transition">إلغاء</button>
                 <button onClick={addUser} className="px-10 py-4 rounded-2xl font-black bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition">إنشاء الحساب وصلاحياته</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const CustomerDashboard = ({ customers }: any) => (
  <div className="bg-white rounded-[40px] shadow-sm border overflow-hidden">
    <div className="p-8 border-b flex items-center justify-between">
      <div className="relative w-96">
        <input type="text" className="w-full px-12 py-3 bg-slate-50 border rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="البحث عن متجر أو تاجر..." />
        <PlusCircle className="absolute right-4 top-3.5 text-slate-300" size={18} />
      </div>
      <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm">
        <List size={18}/> تصدير البيانات (Excel)
      </button>
    </div>
    <table className="w-full text-right">
      <thead className="bg-slate-50">
        <tr>
          <th className="p-6 font-black text-slate-600">اسم المتجر / التاجر</th>
          <th className="p-6 font-black text-slate-600">بيانات التواصل</th>
          <th className="p-6 font-black text-slate-600">المنطقة</th>
          <th className="p-6 font-black text-slate-600">الوصول</th>
          <th className="p-6 font-black text-slate-600 text-center">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c: any) => (
          <tr key={c.id} className="border-b hover:bg-blue-50/30 transition group">
            <td className="p-6">
              <div className="font-black text-slate-900 text-lg">{c.merchantData.storeName || 'تاجر مجهول'}</div>
              <div className="text-xs text-slate-400 font-bold">{c.merchantData.merchantName}</div>
            </td>
            <td className="p-6">
              <div className="font-mono text-slate-600 font-bold">{c.merchantData.phone}</div>
            </td>
            <td className="p-6">
              <span className="font-black text-slate-500">{c.merchantData.area}</span>
            </td>
            <td className="p-6">
              <span className="bg-white border text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">{c.merchantData.accessMethod}</span>
            </td>
            <td className="p-6 flex items-center justify-center gap-2">
               <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"><PhoneCall size={18}/></button>
               <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm"><Trash2 size={18}/></button>
            </td>
          </tr>
        ))}
        {customers.length === 0 && (
          <tr>
            <td colSpan={5} className="p-32 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200"><LayoutDashboard size={40}/></div>
              <p className="text-slate-300 font-black text-xl">لا توجد سجلات حالياً في شركة الاغبر</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default App;
