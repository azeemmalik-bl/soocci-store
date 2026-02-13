import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function POST(req: Request) {
    if (!resend) {
        return NextResponse.json(
            { error: 'Email service not configured. Please add RESEND_API_KEY to your environment variables.' },
            { status: 500 }
        );
    }

    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Soocci Inquiries <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'simon@soocci.com'],
            subject: subject || `New Inquiry from ${name}`,
            replyTo: email,
            html: `
                <div style="font-family: serif; padding: 40px; border: 1px solid #000; max-width: 600px; margin: 0 auto; background-color: #fff;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="font-size: 24px; letter-spacing: 0.5em; text-transform: uppercase; margin: 0; color: #000;">SOOCCI</h1>
                        <p style="font-size: 10px; letter-spacing: 0.2em; color: #666; margin-top: 10px; text-transform: uppercase;">Premium Jewelry Manufacture</p>
                    </div>
                    
                    <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 20px 0; margin-bottom: 30px;">
                        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 20px; text-align: center;">New Contact Inquiry</h2>
                        
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr>
                                <td style="padding: 10px 0; width: 100px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Name:</td>
                                <td style="padding: 10px 0; color: #333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Email:</td>
                                <td style="padding: 10px 0; color: #333;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Subject:</td>
                                <td style="padding: 10px 0; color: #333;">${subject || 'General Inquiry'}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="margin-bottom: 40px;">
                        <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 15px;">Message:</h3>
                        <div style="padding: 20px; background-color: #f9f9f9; font-style: italic; color: #444; line-height: 1.6; border-left: 2px solid #000;">
                            "${message}"
                        </div>
                    </div>

                    <div style="text-align: center; border-top: 1px solid #eee; pt-20">
                        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 30px;">Sent via Soocci Digital Terminal</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Resend Error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
