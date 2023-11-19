export interface GetAllProductsResponse {
  ig: string;
  name: string;
  amount: number;
  description: string;
  price: string;
  category: {
    id: string;
    name: string;
  }

}
