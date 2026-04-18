import { httpClient } from './http-client'
import type { Company } from '@/types/dtos/company.dto'

export const companyApi = {
  async get(companyId: string): Promise<Company> {
    const response = await httpClient.get<Company>(`/companies/${companyId}`)
    return response.data
  },

  async getByNameStartsWith(startsWith: string): Promise<Company[]> {
    const body = { name: startsWith }
    const response = await httpClient.post<Company[]>(`/companies/starts-with`, body)
    return response.data
  },

  async create(company: Company): Promise<Company> {
    const response = await httpClient.post<Company>(`/companies/`, company)
    return response.data
  },

  async update(companyId: string, company: Company): Promise<Company> {
    const response = await httpClient.put<Company>(`/companies/${companyId}`, company)
    return response.data
  },

  async delete(companyId: string): Promise<void> {
    await httpClient.delete(`/companies/${companyId}`)
  },
}
