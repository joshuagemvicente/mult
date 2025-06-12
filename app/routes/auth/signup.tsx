import type { Route } from "./+types/signup"
import { parseWithZod } from "@conform-to/zod";
import { signUpSchema } from "~/dtos/auth/signUp.dto";
import { SignupForm } from "~/components/auth/SignupForm";
import { prisma } from "~/lib/prisma";
import { dataWithError, redirectWithSuccess } from "remix-toast";
import { auth } from "~/lib/auth";

export default function Signup() {
  return <SignupForm />
}


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: signUpSchema })

  if (submission.status !== "success") {
    return submission.reply()
  }

  const { name, email, password } = submission.value;

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return dataWithError(null, { message: "Email already exists" })
  }

  await auth.api.signUpEmail({
    headers: request.headers,
    body: {
      name,
      email,
      password
    }
  })

  return redirectWithSuccess("/login", { message: "Signed up successfully." })

}
