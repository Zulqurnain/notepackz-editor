import Navbar from "@/components/Navbar";
import EditorShell from "@/components/EditorShell";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#07071a" }}>
      {/* Background gradient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 600,
            top: "-10%", left: "-5%",
            background: "radial-gradient(ellipse, rgba(109,40,217,0.14) 0%, transparent 70%)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 600, height: 500,
            top: "10%", right: "-8%",
            background: "radial-gradient(ellipse, rgba(37,99,235,0.10) 0%, transparent 70%)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 400,
            bottom: "5%", right: "20%",
            background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%)",
            filter: "blur(1px)",
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 overflow-hidden relative z-10 p-4 pt-3">
        <EditorShell />
      </main>
    </div>
  );
}
