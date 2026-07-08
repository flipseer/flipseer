// app/api/push/send/route.ts
// Called by match reminder cron to send push notifications

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

export const dynamic = 'force-dynamic'

webpush.setVapidDetails(
  'mailto:founder@flipseer.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, body, url } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('subscription, user_id')

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No subscribers' })
    }

    let sent = 0
    let failed = 0

    for (const row of subscriptions) {
      try {
        const sub = JSON.parse(row.subscription)
        await webpush.sendNotification(sub, JSON.stringify({
          title,
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-96x96.png',
          url: url || 'https://flipseer.com/predict',
          tag: 'match-reminder',
          requireInteraction: false,
        }))
        sent++
      } catch (err: any) {
        failed++
        // Remove invalid subscriptions
        if (err.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', row.user_id)
        }
      }
    }

    return NextResponse.json({ sent, failed, total: subscriptions.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
