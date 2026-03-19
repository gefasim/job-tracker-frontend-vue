import type { Company } from '@/models/company.dto'

export interface CompanyService {
  get(companyId: string): Promise<Company>
  // TODO: implement on backend
  // GET /companies?name=Google&domain=google.com
  //getByName(startsWith: string): Promise<Company>
  getByNameStartsWith(companyName: string): Promise<Company[]>
  create(company: Company): Promise<Company>
  update(companyId: string, company: Company): Promise<Company>
  delete(companyId: string): Promise<void>
}
