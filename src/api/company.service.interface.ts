import type { Company } from '@/models/company.dto'

export interface CompanyService {
  get(companyId: string): Promise<Company>
  create(company: Company): Promise<Company>
  update(companyId: string, company: Company): Promise<Company>
  delete(companyId: string): Promise<void>
}
