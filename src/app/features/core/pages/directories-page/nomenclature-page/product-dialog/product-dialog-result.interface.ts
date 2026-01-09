export interface ProductDialogResult {
  name: string;
  article: string;
  categoryId: string;
  barcodes: { id?: string; value: string }[];
}
