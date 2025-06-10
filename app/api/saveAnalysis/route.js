import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * POST /api/saveAnalysis
 * Save job analysis data for authenticated user.
 *
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Basic validation
    const { analysis_type, input_data, analysis_result } = body;
    if (!analysis_type || !input_data || !analysis_result) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Save Analysis Request:', { userId: user.id, analysis_type });

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: user.id,
        analysis_type,
        input_data,
        analysis_result,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Analysis saved successfully', id: insertData.id });
  } catch (err) {
    console.error('Unexpected error in /api/saveAnalysis:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
