import Chatbot from "@/components/Chatbot";
import GetInTouch from "@/components/GetInTouch";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <GetInTouch />
      <Footer />
      <Chatbot />
    </div>
  );
}
