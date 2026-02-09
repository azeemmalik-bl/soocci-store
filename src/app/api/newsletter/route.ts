import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

export async function POST(req: Request) {
    if (!resend) {
        return NextResponse.json(
            { error: 'Email service not configured.' },
            { status: 500 }
        );
    }

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Notify Admin about new subscriber
        const { data, error } = await resend.emails.send({
            from: 'Soocci Newsletter <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'alexwixpartner@gmail.com'],
            subject: 'New Newsletter Subscription',
            html: `
                <div style="font-family: serif; padding: 40px; border: 1px solid #000; max-width: 600px; margin: 0 auto; background-color: #fff;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="font-size: 24px; letter-spacing: 0.5em; text-transform: uppercase; margin: 0; color: #000;">SOOCCI</h1>
                    </div>
                    
                    <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 20px 0; margin-bottom: 30px; text-align: center;">
                        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em;">New Subscriber</h2>
                        <p style="font-size: 18px; color: #333; margin-top: 10px;">${email}</p>
                    </div>

                    <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">Sent via Soocci Digital Terminal</p>
                </div>
            `,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Note: In a production environment, you would also add them to a Resend Audience:
        // await resend.contacts.create({
        //   email: email,
        //   unsubscribed: false,
        //   audienceId: 'YOUR_AUDIENCE_ID',
        // });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
