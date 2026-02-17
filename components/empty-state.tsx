import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, actionHref, actionText }: { title: string; description: string; actionHref?: string; actionText?: string; }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {actionHref && actionText ? (
        <CardContent>
          <Link href={actionHref}>
            <Button>{actionText}</Button>
          </Link>
        </CardContent>
      ) : null}
    </Card>
  );
}
