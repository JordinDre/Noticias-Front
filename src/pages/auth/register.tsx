import { RegisterForm } from "@/components/register-form"
import Navbar from "@/components/navbar"

export default function Register() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <RegisterForm />
        </div>
      </div>
    </>
  )
}
