import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin şifresi
  const hashedPassword = await bcrypt.hash("Berat123.salonsaç", 10);

  // Admin kullanıcısını veritabanına ekle
  const admin = await prisma.user.create({
    data: {
      email: "arslanberatt@hotmail.com", // Admin için belirli email
      password: hashedPassword, // Şifreyi hashle
      role: "admin", // Admin rolü
    },
  });

  console.log("Admin kullanıcısı başarıyla oluşturuldu:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
