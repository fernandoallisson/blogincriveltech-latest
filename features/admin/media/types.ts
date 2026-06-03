export type MediaFormState = {
  file: File | null;
  filename: string;
  url: string;
  type: string;
  size: string;
  post_id: string;
};

export const emptyMediaForm: MediaFormState = {
  file: null,
  filename: '',
  url: '',
  type: '',
  size: '',
  post_id: '',
};
