import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { originalUrl, customSlug } = await req.json();
    
    if (!originalUrl || typeof originalUrl !== "string") {
      return NextResponse.json(
        { error: "Valid original URL is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const cookieStore =await cookies();
    const sessionId = cookieStore.get("trialSessionId")?.value || nanoid();

    const shortCode =
      customSlug && session
        ? customSlug.toLowerCase()
        : nanoid(8).toLowerCase();

    if (customSlug && session) {
      const existingUrl = await prisma.url.findUnique({ where: { shortCode } });
      const existingTrialUrl = await prisma.trialUrl.findUnique({
        where: { shortCode },
      });

      if (existingUrl || existingTrialUrl) {
        return NextResponse.json(
          { error: "Custom slug is already taken" },
          { status: 409 }
        );
      }
    }

    if (session?.user) {
      const shortUrl = await prisma.url.create({
        data: {
          originalUrl,
          shortCode,
          userId: session.user.id,
          isActive: true,
          createdAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          shortUrl: `${process.env.NEXTAUTH_URL+"/"+shortCode}`,
          url: shortUrl,
          message: "URL shortened successfully",
        },
        { status: 200 }
      );
    }

    const trialCount = await prisma.trialUrl.count({ where: { sessionId } });

    if (trialCount >= 5) {
      return NextResponse.json(
        { error: "Trial limit reached. Please log in." },
        { status: 403 }
      );
    }

    const shortUrl = await prisma.trialUrl.create({
      data: {
        originalUrl,
        shortCode,
        sessionId,
        isActive: true,
        createdAt: new Date(),
      },
    });

    cookieStore.set("trialSessionId", sessionId, { maxAge: 30 * 24 * 60 * 60 });

    return NextResponse.json(
      {
        shortUrl: `${process.env.NEXTAUTH_URL+"/"+shortCode}`,
        url: shortUrl,
        message: "URL shortened successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
