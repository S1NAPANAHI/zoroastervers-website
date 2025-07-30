import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const data = await request.json();
    
    // Check if beta is enabled
    if (process.env.NEXT_PUBLIC_BETA_ENABLED !== 'true') {
      return NextResponse.json(
        { message: 'Beta program is not active' },
        { status: 403 }
      );
    }

    // Check application count
    const { count } = await supabase
      .from('beta_applications')
      .select('*', { count: 'exact' });

    const maxApplications = parseInt(process.env.BETA_MAX_APPLICATIONS || '1000');
    if (count !== null && count >= maxApplications) {
      return NextResponse.json(
        { message: 'Beta application limit reached' },
        { status: 403 }
      );
    }

    // Insert application
    const { error } = await supabase
      .from('beta_applications')
      .insert([{
        ...data,
        status: process.env.BETA_AUTO_APPROVE === 'true' ? 'approved' : 'pending'
      }]);

    if (error) throw error;

    return NextResponse.json({ 
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Error submitting beta application:', error);
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    );
  }
}