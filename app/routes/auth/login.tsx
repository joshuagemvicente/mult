import type { Route } from "./+types/login"
import { LoginForm } from "~/components/auth/LoginForm";

export async function loader({ request }: Route.LoaderArgs) { }

export default function Login() {
  return <LoginForm />
}


