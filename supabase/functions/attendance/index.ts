import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (_req: Request)=>{
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? (
        (() => { throw new Error(
          '`SUPABASE_URL` is undefined.'
        ) })()
      ),
      Deno.env.get('ATTENDANCE_ACCESS_KEY') ?? (
        (() => { throw new Error(
          '`ATTENDANCE_ACCESS_KEY` is undefined.'
        ) })()
      ),
    )
    const { data, error } = (
      await supabase.from('attendance').select('*')
    )
    if (error) throw error
    return new Response(JSON.stringify({
      data
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({
      message: (err as Error)?.message ?? err,
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
