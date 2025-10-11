export function downloadCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value instanceof Date) {
          return value.toISOString().split('T')[0];
        }
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export const regionData: Record<string, string[]> = {
  'Central': ['Al Bahah', 'Ar Riyad', 'Al Qaseem'],
  'Northern': ['Al Jawf', 'Northern Borders', 'Tabuk', 'Hail'],
  'Eastern': ['Eastern Region'],
  'Western': ['Al Madinah Al Munawwarah', 'Makkah Al Mukarramah'],
  'Southern': ['Jazan', 'Aseer', 'Najran']
};

export const cityData: Record<string, string[]> = {
  'Al Bahah': ['Al Bahah', 'Al Aqiq', 'Al Qara', 'Al Mukhwah', 'Al Mandaq', 'Biljurashi'],
  'Al Jawf': ['Al Hajrah', 'Al Qurayyat', 'Dawamat Al Jandal', 'Sakaka', 'Tubarjal'],
  'Northern Borders': ['Rafha', 'Turayf', 'Arar'],
  'Ar Riyad': ['Ar Riyad', 'Al Kharj', 'Ad Diriyah', 'Al Majmaah', 'Az Zulfi'],
  'Al Qaseem': ['Buraydah', 'Unayzah', 'Ar Rass', 'Al Bukayriyah'],
  'Al Madinah Al Munawwarah': ['Al Madinah Al Munawwarah', 'Yanbu', 'Badr', 'Khaybar'],
  'Eastern Region': ['Ad Dammam', 'Al Khubar', 'Al Ahsa', 'Al Jubayl', 'Hafar Al Batin'],
  'Tabuk': ['Tabuk', 'Al Wajh', 'Duba', 'Tayma'],
  'Jazan': ['Jazan', 'Sabya', 'Abu Arish', 'Samtah'],
  'Hail': ['Hail', 'Baqa', 'Ash Shamli'],
  'Aseer': ['Abha', 'Khamis Mushayt', 'Bishah', 'An Namas'],
  'Makkah Al Mukarramah': ['Makkah Al Mukarramah', 'Jiddah', 'Al Taif', 'Rabigh'],
  'Najran': ['Najran', 'Sharurah', 'Hubuna']
};