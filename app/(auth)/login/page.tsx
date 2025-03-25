"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // API'ye ulaşılabiliyor mu ve doğru yanıt alınıyor mu kontrol et
      console.log("API response status:", response.status); // Yanıtın durumunu yazdır
      console.log("API response headers:", response.headers); // Yanıt başlıklarını yazdır

      let data;
      try {
        data = await response.json();
        console.log("API response data:", data); // Yanıt verisini yazdır
      } catch (error) {
        console.error("JSON parse error: ", error);
        setError("Yanıt alınamadı, lütfen tekrar deneyin.");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Bir şeyler ters gitti!");
      } else {
        localStorage.setItem("token", data.token); // Token'ı sakla
        router.push("/"); // Başarılı giriş sonrası yönlendirme
      }
    } catch (error) {
      console.error("Frontend error: ", error); // Detaylı hata kaydı
      setError("Bir şeyler ters gitti, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
