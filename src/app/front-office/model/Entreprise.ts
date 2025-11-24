export class Entreprise {
  id?: number;
  companyDescription?: string;
  address?: string;
  contactNumber?: number;
  logo?: string;
  industry?: string;
  companyWebsite?: string;

  constructor(data?: Partial<Entreprise>) {
    Object.assign(this, data);
  }
}
