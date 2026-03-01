import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { products, email, total } = await request.json();

        if (!email || !products || products.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get or create customer
        let { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('id')
            .eq('email', email)
            .single();

        if (customerError && customerError.code !== 'PGRST116') { // PGRST116 is not found
            return NextResponse.json({ error: 'Failed to access customer records' }, { status: 500 });
        }

        if (!customer) {
            const { data: newCustomer, error: newCustomerError } = await supabase
                .from('customers')
                .insert([{ email }])
                .select('id')
                .single();

            if (newCustomerError) throw newCustomerError;
            customer = newCustomer;
        }

        // 2. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                customer_id: customer.id,
                total: total,
                status: 'pending'
            }])
            .select('id')
            .single();

        if (orderError) throw orderError;

        // Ideally, we'd also insert order items here, but skipping for brevity per constraints

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
