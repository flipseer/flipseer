import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function settleprediction(
  predictionId: number,
  actualOutcome: string, // 'home' | 'away' | 'draw'
  userId: string
) {
  const supabase = createClientComponentClient()

  // Get the prediction
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

  // Update prediction with points
  await supabase
    .from('predictions')
    .update({ points_earned: points })
    .eq('id', predictionId)

  // Update profile reputation via DB function
  await supabase.rpc('update_reputation', { p_user_id: userId })
}
