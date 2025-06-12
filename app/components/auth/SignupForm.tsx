
import { Form, Link, useActionData } from "react-router"
import {
  CardDescription, Card, CardTitle, CardHeader, CardAction, CardContent
} from "../ui/card"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Store, Mail, Lock, User } from "lucide-react"
import { useForm, getFormProps, getInputProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { signUpSchema } from "~/dtos/auth/signUp.dto"


export function SignupForm() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema })
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  })
  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Store className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">Enter your information to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <Form method="post" {...getFormProps(form)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input {...getInputProps(fields.name, { type: "text" })} id="name" type="text" placeholder="Juan Dela Cruz" className="pl-10 " />

              {fields.name.errors && fields.name.errors.length > 0 && (
                <div
                  id={fields.name.errorId}
                  className="text-red-500 text-sm"
                >
                  {fields.name.errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input {...getInputProps(fields.email, { type: "email" })} id="email" type="email" placeholder="your@email.com" className="pl-10" />
              {fields.email.errors && (
                <div id={fields.email.errorId} className="text-red-500 text-sm">
                  {fields.email.errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input {...getInputProps(fields.password, { type: "password" })} id="password" type="password" placeholder="••••••••" className="pl-10" />
              {fields.password.errors && (
                <div id={fields.password.errorId} className="text-red-500 text-sm">
                  {fields.password.errors.map((err, i) => (
                    <p key={i}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" >
            Create account
            {/* {isLoading ? "Creating account..." : "Create Account"} */}
          </Button>
        </Form>

        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground text-xs mb-2">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>

  )

}
