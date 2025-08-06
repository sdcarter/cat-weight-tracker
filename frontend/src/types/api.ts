// API Response Types
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

export interface Cat {
  id: number;
  name: string;
  target_weight: number;
  user_id: number;
}

export interface WeightRecord {
  id: number;
  date: string;
  user_weight: number;
  combined_weight: number;
  cat_weight: number;
  cat_id: number;
}

export interface PlotData {
  cat_id: number;
  dates: string[];
  weights: number[];
  target_weight: number;
  name: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Request Types
export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
}

export interface UserPasswordChange {
  current_password: string;
  new_password: string;
}

export interface CatCreate {
  name: string;
  target_weight: number;
}

export interface CatUpdate {
  name?: string;
  target_weight?: number;
}

export interface WeightRecordCreate {
  date: string;
  user_weight: number;
  combined_weight: number;
}

// Extended Types
export interface CatWithRecords extends Cat {
  weight_records: WeightRecord[];
}

export interface UserWithCats extends User {
  cats: Cat[];
}

// Component Props Types
export interface CatFormProps {
  open: boolean;
  onSubmit: (data: CatCreate) => Promise<void>;
  initialData?: Cat | null;
  onClose: () => void;
}

export interface CatListProps {
  cats: Cat[];
  selectedCatId: number | null;
  onSelectCat: (catId: number | null) => void;
  onEditCat: (cat: Cat) => void;
  onDeleteCat: (catId: number) => Promise<void>;
}

export interface WeightFormProps {
  onSubmit: (data: WeightRecordCreate) => Promise<void>;
}

export interface WeightTableProps {
  weights: WeightRecord[];
  onDeleteWeight: (weightId: number) => Promise<void>;
}

export interface WeightChartProps {
  plotData: PlotData;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UserUpdate) => Promise<void>;
  changePassword: (passwordData: UserPasswordChange) => Promise<void>;
}

// API Error Types
export interface ApiError {
  detail: string;
  errors?: string[];
}

// Toast Types
export interface ToastState {
  open: boolean;
  title: string;
  description: string;
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
