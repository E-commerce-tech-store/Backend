export class Order {
  id: string;
  id_user: string;
  total: number;
  created_at: Date;
  status: 'PENDING' | 'FINISHED';
  details: OrderDetail[];
}

export class OrderDetail {
  id: string;
  id_product: string;
  id_order: string;
  quantity: number;
  subtotal: number;
  current_price: number;
  created_at: Date;
}
