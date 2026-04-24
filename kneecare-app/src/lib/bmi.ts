export function calcBmi(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  return +(weightKg / (m * m)).toFixed(1);
}

export function bmiCategory(bmi: number): { label: string; hint: string } {
  if (bmi < 18.5) return { label: 'น้ำหนักน้อย', hint: 'ควรเพิ่มพลังงานและโปรตีนให้เพียงพอ' };
  if (bmi < 23) return { label: 'ปกติ', hint: 'รักษาน้ำหนักนี้ไว้เพื่อสุขภาพเข่า' };
  if (bmi < 25) return { label: 'น้ำหนักเกิน', hint: 'ลด 1 กก. = ลดแรงกดเข่าประมาณ 4 กก.' };
  if (bmi < 30) return { label: 'อ้วนระดับ 1', hint: 'น้ำหนักที่มากเพิ่มแรงกดเข่า ควรปรึกษาแพทย์เรื่องการลดน้ำหนัก' };
  return { label: 'อ้วนระดับ 2', hint: 'ควรปรึกษาแพทย์เพื่อวางแผนลดน้ำหนักอย่างปลอดภัย' };
}
