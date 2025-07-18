export class UserWithStats {
  id: string;
  email: string;
  name: string;
  role: string;
  status: boolean;
  created_at: Date;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: Date | null;
}

export class UserEntity {
  id: string;
  email: string;
  name: string;
  role: string;
  status: boolean;
  created_at: Date;
}
