export type UserRole = 'admin' | 'user' | 'vendor'

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
  role: UserRole
  created_at?: string | null
  updated_at?: string | null
}