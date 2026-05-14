import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function settleprediction(
  predictionId: number,
  actualOutcome: string,
  userId: string
) {
  const { data: pred } = await supabase
    .from('predictions')
    .select('predicted_outcome, confidence_pct')
    .eq('id', predictionId)
    .single()

  if (!pred) return

  const correct = pred.predicted_outcome === actualOutcome
  const points = correct
    ? 10 + Math.round((pred.confidence_pct / 100) * 40)
    : 0

  await supabase
    .from('predictions')
    .update({ points_earned: points })
    .eq('id', predictionId)

  await supabase.rpc('update_reputation', { p_user_id: userId })
}
