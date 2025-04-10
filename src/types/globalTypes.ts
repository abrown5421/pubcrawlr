import { ComponentPropsWithoutRef, ReactNode } from "react"

export interface ViewportState {
    width: number;
    height: number;
    type: "mobile" | "tablet" | "desktop";
}

export interface User {
  docId: string;
  UserEmail: string;
  UserFirstName: string;
  UserLastName: string;
}

export interface profileUserState {
  profileUser: User | null;
}

export interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface UserState {
    isAuthenticated: boolean;
    user: User | null;
}

export interface AnimatedContainerProps {
  children: React.ReactNode;
  isEntering: boolean;
  className?: string;
  entry?: string;
  exit?: string;
  sx?: React.CSSProperties;
}

export interface ActivePageState {
    Name: string;
    In: boolean;
}

export interface Place {
    name: string;
    geometry: {
      location: {
        lat: () => number; 
        lng: () => number;
      };
    };
    rating?: number;
    user_ratings_total?: number;
    vicinity?: string;
    photoUrl?: string;
    price?: number;
}

export interface BarsState {
    bars: Place[];
}

export interface ModalState  {
    open: boolean;
    title: string;
    body: ReactNode;
}

export interface NotificationState {
    open: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
}

export interface Place {
  id?: string;
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
  photoUrl?: string;
}

export interface SelectedBarsState {
  selectedBars: Place[];
  drawerOpen: boolean;
}

export interface MarkerPopupProps {
    imageUrl?: string;
    name: string;
    rating?: number;
    includeAddBtn: boolean;
}

export interface BarCrawlInfo {
  userID: string | null;
  selectedBars: Place[];
  crawlName: string;
  startDate?: Date; 
  endDate?: Date;   
  intimacyLevel: string;
}

export interface TrianglifyBannerProps {
  token?: string; 
}

export type BarCardProps = {
    bar: Place;
    mode: String;  
};

export type ValidationErrors = Partial<Record<keyof FormData, string>>;

export type SearchHereButtonProps = {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
};

export type FormHandle = {
    clear: () => void;
};

export type FormProps = ComponentPropsWithoutRef<'form'> & {
    onSave: (value: unknown) => void;
};

export type AuthProps = {
  mode: 'login' | 'signup';
};

export type FormData = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type PersonalInfoFormData = {
  firstName: string;
  lastName?: string;
  email: string;
};

export type PlaceAutocompleteProps = {
  onPlaceSelected: (lat: number, lng: number) => void;
};

export type BcFormValidationErrors = Partial<Record<keyof BcFormFormData, string>>;

export type PersonalInfoValidationErrors = Partial<Record<keyof PersonalInfoFormData, string>>;

export type BcFormFormData = {
  barCrawlName: string;
  selectedBars?: any[];
  intimacyLevel: "Public" | "Friends" | "Private";  
  startDate?: string;  
  endDate?: string;    
};

export type TrianglifyState = {
  cellSize: number;
  variance: number;
  xColors: string[];
  yColors: string[];
};