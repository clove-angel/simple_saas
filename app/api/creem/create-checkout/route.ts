import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { creem } from '@/lib/creem';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, productType, userId, credits } = body;

    // Verify authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Build success URL: use env var, then request origin, then fallback to /dashboard
    const origin = request.headers.get('origin');
    const successUrl = process.env.CREEM_SUCCESS_URL
      || (origin ? `${origin}/dashboard` : '/dashboard');

    // Create checkout session using SDK
    const checkout = await creem.checkouts.create({
      productId: productId,
      customer: {
        email: user.email,
      },
      successUrl,
      metadata: {
        user_id: user.id,
        product_type: productType,
        credits: credits || 0,
      }
    });

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
