import { DocumentAdjustment } from './document-adjustment.interface';
import { DocumentPurchase } from './document-purchase.interface';
import { DocumentReturn } from './document-return.interface';
import { DocumentSale } from './document-sale.interface';
import { DocumentTransfer } from './document-transfer.interface';

/*
* The details JSON field structure varies based on the action type. Here is the breakdown of the fields for each action type:

1. CREATED
Stores the initial key state of the document.

json
{
  "status": "DRAFT",
  "total": "1500.00",
  "notes": "Initial creation"
}
2. UPDATED
Stores only the top-level fields that have changed. If a field didn't change, it won't be here.

json
{
  "notes": "Updated delivery instructions",
  "date": "2024-03-20T10:00:00.000Z",
  "storeId": "uuid-..."
}
3. STATUS_CHANGED
Tracks the state transition.

json
{
  "from": "DRAFT",
  "to": "COMPLETED"
}
4. ITEM_ADDED
Contains the full item object that was added.

json
{
  "productId": "uuid-...",
  "quantity": "10",
  "price": "150.00",
  "total": "1500.00"
}
5. ITEM_REMOVED
Contains the full item object that was removed.

json
{
  "productId": "uuid-...",
  "quantity": "5",
  "price": "100.00",
  "total": "500.00"
}
6. ITEM_CHANGED
Tracks specifically which fields changed for a single product.

json
{
  "productId": "uuid-...",
  "changes": {
    "quantity": {
      "from": "10",
      "to": "15"
    },
    "price": {
      "from": "100.00",
      "to": "120.00"
    }
  }
}
* */

export interface DocumentHistory {
  id: string;
  action: string;
  details?: Record<string, unknown>;
  userId?: string;
  documentPurchase?: DocumentPurchase;
  documentPurchaseId?: string;
  documentSale?: DocumentSale;
  documentSaleId?: string;
  documentReturn?: DocumentReturn;
  documentReturnId?: string;
  documentAdjustment?: DocumentAdjustment;
  documentAdjustmentId?: string;
  documentTransfer?: DocumentTransfer;
  documentTransferId?: string;
  createdAt?: string;
}
