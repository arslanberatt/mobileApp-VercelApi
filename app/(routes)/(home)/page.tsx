"use client"; // Bu satır Next.js 13'te istemci tarafında çalıştırılacak bileşenler için gereklidir
import React from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Local storage'dan token'ı sil
    localStorage.removeItem("token");

    // Kullanıcıyı giriş sayfasına yönlendir
    router.push("/login");
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Çıkış Yap</button>
      <button onClick={() => router.push("/login")}>Logine git</button>
      <button onClick={() => router.push("/api/auth")}>apiye git</button>
    </div>
  );
};

export default Home;
