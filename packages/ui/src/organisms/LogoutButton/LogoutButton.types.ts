export interface LogoutButtonProps {
  onLogout: () => Promise<void>
  onSuccess?: () => void
}
