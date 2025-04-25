import { ComponentPropsWithoutRef } from "react"

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

export interface Bar {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  id: string;
  name: string;
  vicinity?: string;
}

export interface BarCrawl {
  id: string | null;
  crawlName: string;
  intimacyLevel: string;
  selectedBars: Bar[];
  userID: string;
}

export interface profileUserState {
  profileUser: User | null;
  barCrawls: BarCrawl[];
  invitedBarCrawls: BarCrawl[];
  friends: FriendEntry[];
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
  id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity?: string;
}

export interface BarsState {
    bars: Place[];
}

export interface ModalState {
  open: boolean;
  title: string;
  body: React.ReactNode | string;
  closeable?: boolean; 
}

export interface NotificationState {
    open: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
}

export interface RequestsState {
  open: boolean;
  requests: number;
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

export interface Attendee {
  docId: string | null;
  UserFirstName: string | null; 
  UserLastName: string | null; 
  invited: boolean;
  attending: boolean;
  creator: boolean;
}

export interface BarCrawlInfo {
  id?: string | null;
  userID: string | null;
  selectedBars: Place[];
  crawlName: string;
  startDate?: string; 
  endDate?: string;   
  intimacyLevel: string;
  attendees: Attendee[] | string;
  attendeeIds: string[];
}

export interface TrianglifyBannerProps {
  token?: string; 
}

export interface Feature {
  properties: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number]; 
  };
}

export interface FriendEntry {
  FriendDocId: string;
  FriendFirstName: string;
  FriendLastName: string;
  FriendEmail: string;
  FriendRequested: boolean;
  FriendRequestAccepted: boolean;
  DateRequested: string;
  Seen: boolean;
}

export type BarCardProps = {
    bar: Place;
    mode: String;  
};

export type FriendCardProps = {
  friend: FriendEntry;
  mode: 'friend' | 'pend' | 'request'
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
  intimacyLevel: "Public" | "Groups" | "Private";  
  startDate?: string;  
  endDate?: string;    
};

export type TrianglifyState = {
  cellSize: number;
  variance: number;
  xColors: string[];
  yColors: string[];
};

export type BarCrawlCardProps = {
  crawl: BarCrawl;
  mode: string
};