 export interface ProfileLocation {
  openEdit?: boolean;
}

export interface ProfilePhotoProps {
  photoPreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isLoading: boolean;
}


export interface ProfileViewProps {
  fullName: string;
  city: string;
  bio: string;
  photoPreview: string | null;
  setIsEditMode: (mode: boolean) => void;
  styles: Record<string, string>;
  stylesForm: Record<string, string>;

  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoError?: string;
  isLoading: boolean;
}