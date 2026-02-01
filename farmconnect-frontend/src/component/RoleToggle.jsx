export default function RoleToggle({ role, setRole }) {
  return (
    <div className="flex justify-center gap-3 mb-4">
      <button
        type="button"
        onClick={() => setRole("USER")}
        className={`px-4 py-1 rounded ${
          role === "USER" ? "bg-green-500 text-white" : "bg-gray-200"
        }`}
      >
        User
      </button>

      <button
        type="button"
        onClick={() => setRole("CONSUMER")}
        className={`px-4 py-1 rounded ${
          role === "CONSUMER" ? "bg-green-500 text-white" : "bg-gray-200"
        }`}
      >
        Consumer
      </button>

      <button
        type="button"
        onClick={() => setRole("ADMIN")}
        className={`px-4 py-1 rounded ${
          role === "ADMIN" ? "bg-green-500 text-white" : "bg-gray-200"
        }`}
      >
        Admin
      </button>
    </div>
  );
}
