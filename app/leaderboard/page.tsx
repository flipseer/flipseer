{/* Reputation Card */}
<div className="bg-gray-900 border border-gray-700 rounded-xl p-5 mt-4">
  <div className="flex items-center justify-between mb-4">
    <div>
      <span className="text-2xl">{profile?.rank_icon}</span>
      <span className="text-xl font-bold ml-2">{profile?.rank}</span>
    </div>
    <div className="text-green-400 text-2xl font-bold">
      {profile?.total_points ?? 0} pts
    </div>
  </div>
  <div className="grid grid-cols-3 gap-3 text-center">
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="text-lg font-bold">{profile?.prediction_count ?? 0}</div>
      <div className="text-xs text-gray-400">Predictions</div>
    </div>
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="text-lg font-bold">{profile?.correct_count ?? 0}</div>
      <div className="text-xs text-gray-400">Correct</div>
    </div>
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="text-lg font-bold">{profile?.accuracy_pct ?? 0}%</div>
      <div className="text-xs text-gray-400">Accuracy</div>
    </div>
  </div>
</div>
