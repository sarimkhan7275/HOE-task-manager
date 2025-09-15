import { RegisterForm } from "@/components/register";




export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Join TaskFlow</h1>
          <p className="text-muted-foreground text-balance">
            Create your account to start organizing your tasks efficiently
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
