import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// POST /api/contact — Mock contact form handler
// Validates input and logs to console. Replace with real email service
// (SendGrid, Resend, etc.) for production.
// ============================================================================

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactPayload = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!body.message?.trim() || body.message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Log to console (replace with email service in production)
    console.log("=== New Contact Form Submission ===");
    console.log(`Name: ${body.name}`);
    console.log(`Email: ${body.email}`);
    console.log(`Message: ${body.message}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("==================================");

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We'll get back to you shortly.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
