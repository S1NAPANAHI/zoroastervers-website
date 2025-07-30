import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Get total number of applications
    const { count } = await supabase
      .from('beta_applications')
      .select('*', { count: 'exact' });

    const maxApplications = parseInt(process.env.BETA_MAX_APPLICATIONS || '1000');
    const closed = count !== null && count >= maxApplications;

    return NextResponse.json({
      closed,
      remaining: Math.max(0, maxApplications - (count || 0))
    });
  } catch (error) {
    console.error('Error checking beta status:', error);
    return NextResponse.json({ closed: true, remaining: 0 });
  }
}