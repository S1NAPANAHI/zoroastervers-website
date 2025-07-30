"use client"

export default function BackButton() {
  return (
    <button onClick={() => history.back()} className="text-cyan-400 mb-6 hover:underline">
      ← Back
    </button>
  )
}
