import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("برای اجرای seed باید DATABASE_URL تنظیم شده باشد.");
}

const target = new URL(databaseUrl);
const databaseName = decodeURIComponent(target.pathname.replace(/^\//, ""));
const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const developmentDatabase = /(?:_dev|_test)$/.test(databaseName);
const productionEnvironment =
  process.env.NODE_ENV?.toLowerCase() === "production" ||
  process.env.APP_ENV?.toLowerCase() === "production";

if (
  productionEnvironment ||
  !localHosts.has(target.hostname) ||
  !developmentDatabase
) {
  throw new Error(
    "Seed فقط برای پایگاه‌دادهٔ محلی با پسوند _dev یا _test مجاز است؛ دادهٔ seed در محیط تولید اجرا نمی‌شود.",
  );
}

const prisma = new PrismaClient();

const initialRoles = [
  { code: "APPLICANT", titleFa: "متقاضی نمایندگی" },
  { code: "FRANCHISOR", titleFa: "واگذارکننده" },
  { code: "VERIFICATION_OFFICER", titleFa: "کارشناس احراز" },
  { code: "ADMIN", titleFa: "مدیر" },
  { code: "SUPER_ADMIN", titleFa: "مدیرکل" },
] as const;

// این دسته‌ها از پیش‌نمایش Phase 1 آمده‌اند؛ برای توسعه‌اند و انتخاب صنایع پایلوت نیستند.
const developmentIndustries = [
  { slug: "food-restaurants-cafes", titleFa: "غذا، رستوران و کافه" },
  { slug: "education", titleFa: "آموزش" },
  { slug: "health-wellness", titleFa: "سلامت و تندرستی" },
  { slug: "sports-fitness", titleFa: "ورزش و باشگاه" },
  { slug: "beauty", titleFa: "زیبایی" },
  { slug: "retail", titleFa: "خرده‌فروشی" },
  { slug: "digital-services", titleFa: "فناوری و خدمات دیجیتال" },
] as const;

async function main() {
  for (const role of initialRoles) {
    await prisma.role.upsert({
      where: { code: role.code },
      create: { ...role, isSystem: true },
      update: { titleFa: role.titleFa, isSystem: true },
    });
  }

  for (const [index, industry] of developmentIndustries.entries()) {
    await prisma.industry.upsert({
      where: { slug: industry.slug },
      create: {
        ...industry,
        sortOrder: index + 1,
        isActive: true,
      },
      update: {
        titleFa: industry.titleFa,
        sortOrder: index + 1,
        isActive: true,
      },
    });
  }

  console.info(
    `Seed توسعه‌ای کامل شد: ${initialRoles.length} نقش آغازین و ${developmentIndustries.length} صنعت نمونه؛ هیچ کاربر یا فرصت عمومی ساخته نشد.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("اجرای seed شکست خورد.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
