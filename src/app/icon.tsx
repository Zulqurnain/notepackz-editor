import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 55%, #f97316 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none">
          <path d="M3 3h4v10H3zM9 3h4v4H9zM9 9h4v4H9z" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
