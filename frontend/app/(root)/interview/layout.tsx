import ProtectedRouteWrapper from "@/components/ProtectedRouteWrapper";

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRouteWrapper>{children}</ProtectedRouteWrapper>;
}
