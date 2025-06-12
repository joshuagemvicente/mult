import { Form, Link } from "react-router"
import {
  CardDescription, Card, CardTitle, CardHeader, CardAction, CardContent
} from "../ui/card"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Store, Mail, Lock } from "lucide-react"
import { useForm, getFormProps, getInputProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { loginSchema } from "~/dtos/auth/login.dto"

export function LoginForm() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })

  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Store className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...getFormProps(form)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input {...getInputProps(fields.email, { type: "email" })} id="email" type="email" placeholder="your@email.com" className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input {...getInputProps(fields.password, { type: "password" })} id="password" type="password" placeholder="••••••••" className="pl-10" required />
              </div>
            </div>

            <Button form={form.id} type="submit" className="w-full" >
              Sign in
              {/* {isLoading ? "Signing in..." : "Sign In"} */}
            </Button>
          </Form>

          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </>

  )

}
