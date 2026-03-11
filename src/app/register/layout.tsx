import { Toaster } from "react-hot-toast"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            marginTop: "60px",
            background: "#0a3cff",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />
    </>
  )
}

