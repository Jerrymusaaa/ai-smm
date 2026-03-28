'use client';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];

const DATA: Record<string, Record<string, number>> = {
  Mon: { '6am':42,'8am':68,'10am':74,'12pm':81,'2pm':65,'4pm':72,'6pm':94,'8pm':91,'10pm':63 },
  Tue: { '6am':38,'8am':71,'10am':78,'12pm':76,'2pm':69,'4pm':74,'6pm':88,'8pm':86,'10pm':58 },
  Wed: { '6am':45,'8am':65,'10am':72,'12pm':84,'2pm':71,'4pm':68,'6pm':91,'8pm':89,'10pm':61 },
  Thu: { '6am':41,'8am':70,'10am':76,'12pm':79,'2pm':67,'4pm':75,'6pm':92,'8pm':90,'10pm':64 },
  Fri: { '6am':35,'8am':62,'10am':69,'12pm':77,'2pm':63,'4pm':71,'6pm':96,'8pm':94,'10pm':72 },
  Sat: { '6am':28,'8am':54,'10am':81,'12pm':88,'2pm':84,'4pm':79,'6pm':82,'8pm':87,'10pm':76 },
  Sun: { '6am':24,'8am':51,'10am':78,'12pm':85,'2pm':82,'4pm':76,'6pm':79,'8pm':91,'10pm':68 },
};

function getColor(score: number): string {
  if (score >= 90) return 'rgba(0,102,255,0.9)';
  if (score >= 80) return 'rgba(0,102,255,0.65)';
  if (score >= 70) return 'rgba(0,102,255,0.45)';
  if (score >= 60) return 'rgba(0,102,255,0.28)';
  if (score >= 50) return 'rgba(0,102,255,0.16)';
  return 'rgba(255,255,255,0.05)';
}

export function BestTimesHeatmap() {
  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-base font-bold text-white">
            Best times to post
          </h3>
          <p className="text-xs text-white/40 mt-0.5">Based on your audience activity</p>
        </div>
        <select className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/60 outline-none">
          <option>All platforms</option>
          <option>Instagram</option>
          <option>TikTok</option>
          <option>LinkedIn</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour labels */}
          <div className="flex mb-1 ml-10">
            {HOURS.map(h => (
              <div key={h} className="flex-1 text-center text-[10px] text-white/30">{h}</div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map(day => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <div className="w-9 text-[11px] text-white/40 text-right pr-1 flex-shrink-0">{day}</div>
              {HOURS.map(hour => {
                const score = DATA[day][hour];
                return (
                  <div key={hour} className="flex-1 group relative">
                    <div
                      className="h-7 rounded-md cursor-pointer transition-all hover:scale-110 hover:z-10"
                      style={{ background: getColor(score) }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl"
                      style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {day} {hour}: {score}%
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 justify-end">
            <span className="text-[10px] text-white/30">Low</span>
            <div className="flex items-center gap-1">
              {[0.05, 0.16, 0.28, 0.45, 0.65, 0.9].map(o => (
                <div key={o} className="w-5 h-3 rounded-sm"
                  style={{ background: `rgba(0,102,255,${o})` }} />
              ))}
            </div>
            <span className="text-[10px] text-white/30">High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
